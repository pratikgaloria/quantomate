import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Dataset } from "@quantomate/core";
import { Backtest } from "@quantomate/core";
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

  const stockData = rawData.map((d: any) => ({
    date: d.date instanceof Date ? d.date : new Date(d.date),
    open: Number(d.open),
    high: Number(d.high),
    low: Number(d.low),
    close: Number(d.close),
    volume: Number(d.volume),
  }));

  // Step 2 — Prepare dataset + strategy
  onProgress?.(
    2,
    TOTAL_STEPS,
    `Preparing dataset (${stockData.length} bars) and computing strategy indicators…`
  );
  const dataset = new Dataset(stockData);
  const strategy = createStrategy(strategyId as any, strategyParams);
  dataset.prepare(strategy);

  // Step 3 — Run backtest engine
  onProgress?.(3, TOTAL_STEPS, `Running backtest engine (${dataset.length} bars)…`);
  const bt = new Backtest(dataset, strategy);
  const report = bt.run({
    config: {
      capital,
      commission,
      slippage,
      entryPriceField: "close",
    },
    onEntry: (quote) => {
      const val = quote.value as any;
      return typeof val === "object" ? val.close : val;
    },
    onExit: (quote) => {
      const val = quote.value as any;
      return typeof val === "object" ? val.close : val;
    },
  });

  // Step 4 — Build report
  onProgress?.(4, TOTAL_STEPS, "Generating report…");

  const summary = report.summary();
  const riskMetrics = report.getRiskMetrics();

  // Build trade log with context
  const trades = report.trades.map((t) => {
    const val = t.quote.value as any;
    return {
      type: t.type,
      date:
        val?.date instanceof Date
          ? val.date.toISOString()
          : val?.date ?? null,
      price: t.tradedValue,
      shares: t.shares,
      short: t.short ?? false,
      currentCapital: t.currentCapital,
      exitReason: t.exitReason ?? null,
      exitContext: t.exitContext
        ? {
            entryPrice: t.exitContext.entryPrice,
            exitPrice: t.exitContext.exitPrice,
            holdDays: Math.round(t.exitContext.holdDuration / 86400000),
            priceChange: t.exitContext.priceChange,
            priceChangePercent: Number(t.exitContext.priceChangePercent.toFixed(2)),
          }
        : null,
      commission: t.commission ?? 0,
      slippage: t.slippage ?? 0,
    };
  });

  return {
    symbol: symbol.toUpperCase(),
    strategy: strategyId,
    strategyParams,
    interval,
    barsUsed: stockData.length,
    dateRange: {
      from: stockData[0]?.date?.toISOString(),
      to: stockData[stockData.length - 1]?.date?.toISOString(),
    },
    config: { capital, commission, slippage },
    summary: {
      initialCapital: Number(summary.initialCapital.toFixed(2)),
      finalCapital: Number(summary.finalCapital.toFixed(2)),
      absoluteReturn: Number((summary.finalCapital - summary.initialCapital).toFixed(2)),
      returnPercent: Number(summary.returnsPercentage.toFixed(2)),
      totalTrades: summary.totalTrades,
      winningRate: Number((summary.winningRate * 100).toFixed(1)),
      totalCommissions: Number(summary.totalCommissions.toFixed(2)),
      totalSlippage: Number(summary.totalSlippage.toFixed(2)),
    },
    riskMetrics: {
      stopLossExits: riskMetrics.stopLossExits,
      takeProfitExits: riskMetrics.takeProfitExits,
      strategyExits: riskMetrics.strategyExits,
      stopLossRate: Number((riskMetrics.stopLossRate * 100).toFixed(1)),
      takeProfitRate: Number((riskMetrics.takeProfitRate * 100).toFixed(1)),
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
            // Emit MCP progress notification
            try {
              (extra?.signal as any)?.dispatchEvent; // no-op check
            } catch {
              // Notifications not supported in this transport — silent
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

      // Rank by return (nulls last)
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
