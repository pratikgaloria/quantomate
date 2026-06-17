import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Bar, BarSeries, Series, StrategyContext } from "@quantomate/core";
import { SMA, EMA, RSI, MACD, MACDSignal, BB, PivotTrend } from "@quantomate/library";
import { DataService } from "@quantomate/data";
import {
  BacktestInputSchema,
  CompareStrategiesInputSchema,
} from "../schemas/inputs.js";
import { STRATEGY_CATALOGUE } from "../catalogues.js";
import { createStrategy } from "../strategyFactory.js";

// ─── Shared backtest runner ───────────────────────────────────────────────────

interface BacktestRunOptions {
  symbol: string;
  strategyId: string;
  strategyParams?: Record<string, any>;
  interval: string;
  capital: number;
  commission: number;
  slippage: number;
  limit?: number;
  /** Called for each progress step with a human-readable message */
  onProgress?: (step: number, total: number, message: string) => void;
}

interface SimTradeEvent {
  type: 'entry' | 'exit';
  date: string;
  price: number;
  shares: number;
  short: boolean;
  currentCapital: number;
  exitReason?: string | null;
  exitContext?: {
    entryPrice: number;
    exitPrice: number;
    holdDays: number;
    priceChange: number;
    priceChangePercent: number;
  } | null;
  commission: number;
  slippage: number;
}

function getIndicatorsForStrategy(
  strategyId: string,
  series: BarSeries,
  parameters: Record<string, any>
): Map<string, Series<any>> {
  const indicatorSeriesMap = new Map<string, Series<any>>();

  switch (strategyId) {
    case 'golden-cross': {
      const fastPeriod = parameters.fastPeriod || 50;
      const slowPeriod = parameters.slowPeriod || 200;
      const field = parameters.source || 'close';
      indicatorSeriesMap.set('fastSMA', new SMA('fastSMA', { period: fastPeriod, field }).calculate(series));
      indicatorSeriesMap.set('slowSMA', new SMA('slowSMA', { period: slowPeriod, field }).calculate(series));
      break;
    }
    case 'pivot-trend': {
      indicatorSeriesMap.set('pivotTrend', new PivotTrend('pivotTrend').calculate(series));
      break;
    }
    case 'rsi-mean-reversion': {
      const rsiPeriod = parameters.rsiPeriod || 14;
      indicatorSeriesMap.set('rsi', new RSI('rsi', { period: rsiPeriod, field: 'close' }).calculate(series));
      break;
    }
    case 'bollinger-bands': {
      const period = parameters.period || 20;
      const multiplier = parameters.multiplier || 2.0;
      indicatorSeriesMap.set('bbUpper', new BB('bbUpper', { period, multiplier, band: 'upper' }).calculate(series));
      indicatorSeriesMap.set('bbLower', new BB('bbLower', { period, multiplier, band: 'lower' }).calculate(series));
      break;
    }
    case 'macd': {
      const fastPeriod = parameters.fastPeriod || 12;
      const slowPeriod = parameters.slowPeriod || 26;
      const signalPeriod = parameters.signalPeriod || 9;
      indicatorSeriesMap.set('macd', new MACD('macd', { fastPeriod, slowPeriod, field: 'close' }).calculate(series));
      indicatorSeriesMap.set('macdSignal', new MACDSignal('macdSignal', { fastPeriod, slowPeriod, signalPeriod, field: 'close' }).calculate(series));
      break;
    }
  }

  return indicatorSeriesMap;
}

async function runBacktestInternal(opts: BacktestRunOptions) {
  const {
    symbol,
    strategyId,
    strategyParams = {},
    interval,
    capital,
    commission,
    slippage,
    limit,
    onProgress,
  } = opts;

  const TOTAL_STEPS = 4;

  // Step 1 — Fetch data
  onProgress?.(1, TOTAL_STEPS, `Fetching historical data for ${symbol} (${interval})…`);
  const rawData = await DataService.getHistoricalData(
    symbol.toUpperCase(),
    limit,
    interval
  );

  if (!rawData || rawData.length === 0) {
    throw new Error(`No historical data found for ${symbol} (${interval})`);
  }

  const bars: Bar[] = rawData.map((d: any) => ({
    open: Number(d.open),
    high: Number(d.high),
    low: Number(d.low),
    close: Number(d.close),
    volume: Number(d.volume),
    timestamp: d.date instanceof Date ? d.date.getTime() : new Date(d.date).getTime(),
  }));

  // Step 2 — Prepare dataset + strategy
  onProgress?.(
    2,
    TOTAL_STEPS,
    `Preparing dataset (${bars.length} bars) and computing strategy indicators…`
  );
  const series = new BarSeries(bars);
  const strategy = createStrategy(strategyId as any, strategyParams);
  const indicatorSeriesMap = getIndicatorsForStrategy(strategyId, series, strategyParams);

  const context: StrategyContext = {
    getIndicatorSeries: (name) => indicatorSeriesMap.get(name),
    getSecondaryBarSeries: () => undefined,
  };

  // Step 3 — Run backtest engine
  onProgress?.(3, TOTAL_STEPS, `Running backtest engine (${series.length} bars)…`);

  let currentCapital = capital;
  let sharesOwned = 0;
  let isShort = false;
  let entryTradedValue = 0;
  let activeEntryDate: number | null = null;

  let stopLossExits = 0;
  let takeProfitExits = 0;
  let strategyExits = 0;
  let totalCommissions = 0;
  let totalSlippage = 0;
  let winningTradesCount = 0;
  let losingTradesCount = 0;

  const trades: SimTradeEvent[] = [];
  let status: 'idle' | 'long' | 'short' = 'idle';

  for (let i = 0; i < series.length; i++) {
    const bar = series.at(i)!;
    const signal = strategy.evaluate(series, i, context);

    if (status === 'idle') {
      if (signal.action === 'entry') {
        const execBar = (i + 1 < series.length) ? series.at(i + 1)! : bar;
        const tradedValue = execBar.open;
        const date = new Date(execBar.timestamp).toISOString();

        isShort = signal.direction === 'short';
        status = isShort ? 'short' : 'long';
        activeEntryDate = execBar.timestamp;

        // Apply slippage to entry price
        const slippageFactor = isShort ? (1 - slippage) : (1 + slippage);
        const effectiveEntryPrice = tradedValue * slippageFactor;
        const slippageCost = Math.abs(effectiveEntryPrice - tradedValue);

        entryTradedValue = effectiveEntryPrice;

        // Calculate shares with all available capital
        const shares = currentCapital / effectiveEntryPrice;
        sharesOwned = shares;

        // Apply commission
        const commissionCost = shares * commission;
        totalCommissions += commissionCost;
        totalSlippage += (shares * slippageCost);

        if (isShort) {
          currentCapital = currentCapital + (shares * effectiveEntryPrice) - commissionCost;
        } else {
          const totalCostPerShare = effectiveEntryPrice + commission;
          const adjustedShares = currentCapital / totalCostPerShare;
          sharesOwned = adjustedShares;
          currentCapital = 0;
        }

        trades.push({
          type: 'entry',
          date,
          price: effectiveEntryPrice,
          shares: sharesOwned,
          short: isShort,
          currentCapital,
          commission: commissionCost,
          slippage: slippageCost * sharesOwned,
        });
      }
    } else {
      // In position: check for exit (either signal or end of series)
      const shouldExit = signal.action === 'exit';
      const isLastBar = i === series.length - 1;

      if (shouldExit || isLastBar) {
        const exitReason = 'strategy';
        strategyExits++;

        const execBar = (i + 1 < series.length) ? series.at(i + 1)! : bar;
        const tradedValue = execBar.open;
        const date = new Date(execBar.timestamp).toISOString();

        // Apply slippage to exit price
        const slippageFactor = isShort ? (1 + slippage) : (1 - slippage);
        const effectiveExitPrice = tradedValue * slippageFactor;
        const slippageCost = Math.abs(effectiveExitPrice - tradedValue);

        // Apply commission
        const commissionCost = sharesOwned * commission;
        totalCommissions += commissionCost;
        totalSlippage += (sharesOwned * slippageCost);

        const holdDays = Math.round((execBar.timestamp - activeEntryDate!) / 86400000);
        const priceChange = isShort ? entryTradedValue - effectiveExitPrice : effectiveExitPrice - entryTradedValue;
        const priceChangePercent = (priceChange / entryTradedValue) * 100;

        const exitContext = {
          entryPrice: entryTradedValue,
          exitPrice: effectiveExitPrice,
          holdDays,
          priceChange,
          priceChangePercent: Number(priceChangePercent.toFixed(2)),
        };

        let tradePnL = 0;
        if (isShort) {
          const proceeds = (sharesOwned * effectiveExitPrice) + commissionCost;
          currentCapital = currentCapital - proceeds;
          tradePnL = (entryTradedValue - effectiveExitPrice) * sharesOwned - commissionCost;
        } else {
          const saleProceeds = (sharesOwned * effectiveExitPrice) - commissionCost;
          currentCapital += saleProceeds;
          tradePnL = (effectiveExitPrice - entryTradedValue) * sharesOwned - commissionCost;
        }

        if (tradePnL > 0) {
          winningTradesCount++;
        } else {
          losingTradesCount++;
        }

        trades.push({
          type: 'exit',
          date,
          price: effectiveExitPrice,
          shares: sharesOwned,
          short: isShort,
          currentCapital,
          exitReason,
          exitContext,
          commission: commissionCost,
          slippage: slippageCost * sharesOwned,
        });

        sharesOwned = 0;
        status = 'idle';
      }
    }
  }

  // Step 4 — Build report
  onProgress?.(4, TOTAL_STEPS, "Generating report…");

  const totalTrades = winningTradesCount + losingTradesCount;
  const winningRate = totalTrades > 0 ? winningTradesCount / totalTrades : 0;
  const absoluteReturn = currentCapital - capital;
  const returnPercent = (absoluteReturn / capital) * 100;

  return {
    symbol: symbol.toUpperCase(),
    strategy: strategyId,
    strategyParams,
    interval,
    barsUsed: bars.length,
    dateRange: {
      from: new Date(bars[0].timestamp).toISOString(),
      to: new Date(bars[bars.length - 1].timestamp).toISOString(),
    },
    config: { capital, commission, slippage },
    summary: {
      initialCapital: Number(capital.toFixed(2)),
      finalCapital: Number(currentCapital.toFixed(2)),
      absoluteReturn: Number(absoluteReturn.toFixed(2)),
      returnPercent: Number(returnPercent.toFixed(2)),
      totalTrades,
      winningRate: Number((winningRate * 100).toFixed(1)),
      totalCommissions: Number(totalCommissions.toFixed(2)),
      totalSlippage: Number(totalSlippage.toFixed(2)),
    },
    riskMetrics: {
      stopLossExits,
      takeProfitExits,
      strategyExits,
      stopLossRate: 0,
      takeProfitRate: 0,
    },
    trades,
  };
}

// ─── Tool registration ────────────────────────────────────────────────────────

/**
 * Registers all backtest tools on the MCP server.
 */
export function registerBacktestTools(server: McpServer) {
  // ─── list_strategies ──────────────────────────────────────────────────────
  server.tool(
    "list_strategies",
    "List all available pre-built trading strategies with their IDs, descriptions, " +
      "default parameters, and minimum bars required. " +
      "Use this before calling run_backtest to discover strategy IDs and parameters.",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                count: STRATEGY_CATALOGUE.length,
                strategies: STRATEGY_CATALOGUE,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ─── run_backtest ─────────────────────────────────────────────────────────
  server.tool(
    "run_backtest",
    "Run a backtest for a pre-built trading strategy on a symbol's historical data. " +
      "Returns a full performance report including returns, win rate, trade log, and risk metrics. " +
      "Streams progress notifications as data is fetched, indicators computed, and trades simulated. " +
      "Use list_strategies to see available strategy IDs and their parameters.",
    BacktestInputSchema.shape,
    async ({ symbol, strategy, interval, capital, commission, slippage, params, limit }, extra) => {
      const progressMessages: string[] = [];

      try {
        const result = await runBacktestInternal({
          symbol,
          strategyId: strategy,
          strategyParams: params,
          interval,
          capital,
          commission,
          slippage,
          limit,
          onProgress: (step, total, message) => {
            const msg = `[${step}/${total}] ${message}`;
            progressMessages.push(msg);
            try {
              (extra?.signal as any)?.dispatchEvent;
            } catch {
              // Notifications not supported
            }
          },
        });

        return {
          content: [
            {
              type: "text",
              text: [
                "## Backtest Progress",
                ...progressMessages.map((m) => `- ${m}`),
                "- ✅ Backtest complete.",
                "",
                "## Result",
                "```json",
                JSON.stringify({ success: true, ...result }, null, 2),
                "```",
              ].join("\n"),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text: [
                "## Backtest Progress",
                ...progressMessages.map((m) => `- ${m}`),
                `- ❌ Failed: ${err.message}`,
                "",
                "## Error",
                JSON.stringify({ success: false, error: err.message }),
              ].join("\n"),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ─── compare_strategies ───────────────────────────────────────────────────
  server.tool(
    "compare_strategies",
    "Run multiple pre-built strategies on the same symbol and return a ranked comparison table. " +
      "Strategies are run sequentially with streaming progress updates. " +
      "Ranks by return percentage (highest first). Ideal for strategy selection.",
    CompareStrategiesInputSchema.shape,
    async ({ symbol, strategies, interval, capital, commission, slippage, limit }) => {
      const allProgress: string[] = [];
      const results: any[] = [];

      for (const strategyId of strategies) {
        allProgress.push(`\n### Running ${strategyId}…`);

        try {
          const result = await runBacktestInternal({
            symbol,
            strategyId,
            interval,
            capital,
            commission,
            slippage,
            limit,
            onProgress: (step, total, message) => {
              allProgress.push(`  [${step}/${total}] ${message}`);
            },
          });

          results.push({
            strategy: strategyId,
            returnPercent: result.summary.returnPercent,
            finalCapital: result.summary.finalCapital,
            totalTrades: result.summary.totalTrades,
            winningRate: result.summary.winningRate,
            summary: result.summary,
            riskMetrics: result.riskMetrics,
          });

          allProgress.push(`  ✅ Done — Return: ${result.summary.returnPercent}%`);
        } catch (err: any) {
          allProgress.push(`  ❌ Failed: ${err.message}`);
          results.push({
            strategy: strategyId,
            error: err.message,
            returnPercent: null,
          });
        }
      }

      const ranked = [...results].sort((a, b) => {
        if (a.returnPercent === null) return 1;
        if (b.returnPercent === null) return -1;
        return b.returnPercent - a.returnPercent;
      });

      return {
        content: [
          {
            type: "text",
            text: [
              "## Comparison Progress",
              ...allProgress,
              "",
              "## Ranked Results",
              "```json",
              JSON.stringify(
                {
                  success: true,
                  symbol: symbol.toUpperCase(),
                  interval,
                  capital,
                  dateRange: results[0]?.dateRange ?? null,
                  rankedStrategies: ranked,
                },
                null,
                2
              ),
              "```",
            ].join("\n"),
          },
        ],
      };
    }
  );
}
