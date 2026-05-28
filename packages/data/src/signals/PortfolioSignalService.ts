import { prisma } from "@quantomate/db";
import { DataService } from "../DataService";
import { FundamentalService } from "../fundamentals/FundamentalService";
import { Dataset } from "@quantomate/core";
import {
  GoldenCrossStrategy,
  RSIMeanReversionStrategy,
  BollingerBandsStrategy,
  MACDStrategy,
  PivotTrendStrategy
} from "@quantomate/library";

export const ACTIVE_STRATEGIES = [
  {
    id: "golden-cross",
    params: { fastPeriod: 50, slowPeriod: 200, direction: "long" },
  },
  {
    id: "rsi-mean-reversion",
    params: {
      rsiPeriod: 14,
      oversoldThreshold: 30,
      overboughtThreshold: 70,
      useTrendFilter: false,
      direction: "long",
    },
  },
  {
    id: "bollinger-bands",
    params: { period: 20, multiplier: 2, direction: "long" },
  },
  { id: "macd", params: { signalPeriod: 9, direction: "long" } },
  { id: "pivot-trend", params: { direction: "both" } },
];

function getStrategyLookback(strategyId: string, params: Record<string, any>): number {
  switch (strategyId) {
    case "golden-cross": {
      const slowPeriod = params.slowPeriod || 200;
      return slowPeriod + 10;
    }
    case "rsi-mean-reversion": {
      const rsiPeriod = params.rsiPeriod || 14;
      const smaPeriod = params.smaPeriod || 50;
      const useTrendFilter = params.useTrendFilter || false;
      const basePeriod = useTrendFilter ? Math.max(rsiPeriod, smaPeriod) : rsiPeriod;
      return basePeriod + 10;
    }
    case "bollinger-bands": {
      const period = params.period || 20;
      return period + 10;
    }
    case "macd": {
      const signalPeriod = params.signalPeriod || 9;
      return 26 + signalPeriod + 100;
    }
    case "pivot-trend": {
      return 10;
    }
    default:
      return 250;
  }
}

function createStrategy(strategyId: string, parameters: Record<string, any>) {
  switch (strategyId) {
    case "golden-cross": {
      const fastPeriod = parameters.fastPeriod || 50;
      const slowPeriod = parameters.slowPeriod || 200;
      return new GoldenCrossStrategy("Golden Cross", {
        fastPeriod,
        slowPeriod,
        source: "close",
        ...parameters
      });
    }
    case "pivot-trend": {
      return new PivotTrendStrategy("Pivot Trend", parameters);
    }
    case "rsi-mean-reversion": {
      return new RSIMeanReversionStrategy("RSI Mean Reversion", parameters);
    }
    case "bollinger-bands": {
      return new BollingerBandsStrategy("Bollinger Bands", parameters);
    }
    case "macd": {
      return new MACDStrategy("MACD", parameters);
    }
    default:
      throw new Error(`Unknown strategy: ${strategyId}`);
  }
}

export class PortfolioSignalService {
  static async getSignals(symbolsList: string[], isCached: boolean): Promise<any[]> {
    if (symbolsList.length === 0) {
      return [];
    }

    // 1. Fetch metadata from DB for existing symbols
    const dbSymbolsMeta = await prisma.symbol.findMany({
      where: { id: { in: symbolsList } },
    });
    const symbolMetaMap = new Map(dbSymbolsMeta.map((s) => [s.id, s]));

    const fundamentalsInput = symbolsList.map((ticker) => {
      const meta = symbolMetaMap.get(ticker);
      return {
        ticker,
        name: meta?.name || undefined,
        sector: meta?.sector || undefined,
      };
    });

    // 2. Fetch and Cache Fundamentals
    const fundamentalsList = await FundamentalService.refreshSignals(
      fundamentalsInput,
      undefined,
      isCached,
    );
    const fundamentalsMap = new Map(fundamentalsList.map((f: any) => [f.ticker, f]));

    if (isCached) {
      // Fetch cached technical signals
      const cachedSignals = await prisma.strategySignal.findMany({
        where: { symbolId: { in: symbolsList } },
      });

      const signalsMap = new Map<string, any[]>();
      for (const sig of cachedSignals) {
        if (!signalsMap.has(sig.symbolId)) {
          signalsMap.set(sig.symbolId, []);
        }
        signalsMap.get(sig.symbolId)!.push({
          strategyId: sig.strategyId,
          signalValue: sig.signalValue,
          price: sig.price,
          triggeredAt: sig.triggeredAt,
        });
      }

      return symbolsList.map((symbol) => ({
        symbol,
        fundamentals: fundamentalsMap.get(symbol) || null,
        technicals: signalsMap.get(symbol) || [],
      }));
    }

    // 3. Run Technical Strategy Scans & Sync StrategySignal Table
    const results: any[] = [];

    // Calculate maximum lookback required across all active strategies
    let maxLookback = 0;
    for (const stratInfo of ACTIVE_STRATEGIES) {
      const lookback = getStrategyLookback(stratInfo.id, stratInfo.params);
      if (lookback > maxLookback) {
        maxLookback = lookback;
      }
    }

    // Fetch all existing cached strategy signals for these symbols to initialize states
    const allCachedSignals = await prisma.strategySignal.findMany({
      where: { symbolId: { in: symbolsList } },
    });

    // Group cached signals by symbolId and strategyId
    const cachedSignalsMap = new Map<string, Map<string, any>>();
    for (const sig of allCachedSignals) {
      if (!cachedSignalsMap.has(sig.symbolId)) {
        cachedSignalsMap.set(sig.symbolId, new Map());
      }
      cachedSignalsMap.get(sig.symbolId)!.set(sig.strategyId, sig);
    }

    for (const symbol of symbolsList) {
      try {
        const symbolCachedMap = cachedSignalsMap.get(symbol);
        const hasAllCached = ACTIVE_STRATEGIES.every((strat) => symbolCachedMap?.has(strat.id));

        const limit = hasAllCached ? maxLookback : undefined;
        const history = await DataService.getHistoricalData(symbol, limit);

        if (!history || history.length === 0) {
          results.push({
            symbol,
            fundamentals: fundamentalsMap.get(symbol) || null,
            technicals: [],
          });
          continue;
        }

        const stockData = history.map((h) => ({
          date: new Date(h.date),
          open: Number(h.open),
          high: Number(h.high),
          low: Number(h.low),
          close: Number(h.close),
          volume: Number(h.volume),
        }));

        const dataset = new Dataset(stockData);
        const technicals: any[] = [];

        for (const stratInfo of ACTIVE_STRATEGIES) {
          const strategy = createStrategy(stratInfo.id, stratInfo.params);
          dataset.prepare(strategy);

          const cached = symbolCachedMap?.get(stratInfo.id);

          let latestSignalValue = cached?.signalValue || "HOLD";
          let latestSignalPrice = cached?.price !== undefined ? Number(cached.price) : stockData[stockData.length - 1].close;
          let latestSignalDate = cached?.triggeredAt || stockData[stockData.length - 1].date;

          for (let i = dataset.length - 1; i >= 0; i--) {
            const quote = dataset.at(i)!;
            const val = quote.value as any;
            const strategyValue = quote.getStrategy(strategy.name);

            if (strategyValue) {
              const posVal = strategyValue.position.value;
              if (posVal === "entry" || posVal === "exit") {
                const signalVal = posVal === "entry"
                  ? (strategyValue.position.options?.short ? "SHORT" : "BUY")
                  : (strategyValue.position.options?.short ? "COVER" : "SELL");
                const price = stratInfo.id === "pivot-trend" ? val.open : val.close;
                const date = val.date;

                if (!cached || date.getTime() >= cached.triggeredAt.getTime()) {
                  latestSignalValue = signalVal;
                  latestSignalPrice = price;
                  latestSignalDate = date;
                }
                break;
              }
            }
          }

          // Persist the signal to StrategySignal cache in TimescaleDB
          await prisma.strategySignal.upsert({
            where: {
              symbolId_strategyId: {
                symbolId: symbol,
                strategyId: stratInfo.id,
              },
            },
            create: {
              symbolId: symbol,
              strategyId: stratInfo.id,
              signalValue: latestSignalValue,
              price: latestSignalPrice,
              triggeredAt: latestSignalDate,
            },
            update: {
              signalValue: latestSignalValue,
              price: latestSignalPrice,
              triggeredAt: latestSignalDate,
            },
          });

          technicals.push({
            strategyId: stratInfo.id,
            signalValue: latestSignalValue,
            price: latestSignalPrice,
            triggeredAt: latestSignalDate,
          });
        }

        results.push({
          symbol,
          fundamentals: fundamentalsMap.get(symbol) || null,
          technicals,
        });
      } catch (err) {
        console.error(`Error processing technicals for ${symbol}:`, err);
        results.push({
          symbol,
          fundamentals: fundamentalsMap.get(symbol) || null,
          technicals: [],
          error: (err as Error).message,
        });
      }
    }

    return results;
  }

  static async getChartData(symbol: string): Promise<any> {
    const history = await DataService.getHistoricalData(symbol);
    if (!history || history.length === 0) {
      throw new Error(`No historical data found for symbol ${symbol}`);
    }

    const stockData = history.map((h) => ({
      date: new Date(h.date),
      open: Number(h.open),
      high: Number(h.high),
      low: Number(h.low),
      close: Number(h.close),
      volume: Number(h.volume),
    }));

    const dataset = new Dataset(stockData);
    const signalMarkers: any[] = [];

    for (const stratInfo of ACTIVE_STRATEGIES) {
      const strategy = createStrategy(stratInfo.id, stratInfo.params);
      dataset.prepare(strategy);

      let lastPositionValue: string | null = null;

      for (let i = 0; i < dataset.length; i++) {
        const quote = dataset.at(i)!;
        const val = quote.value as any;
        const strategyValue = quote.getStrategy(strategy.name);

        if (strategyValue) {
          const currentPositionValue = strategyValue.position.value;
          if (currentPositionValue !== lastPositionValue) {
            if (currentPositionValue === "entry") {
              signalMarkers.push({
                date: val.date,
                strategyId: stratInfo.id,
                type: strategyValue.position.options?.short ? "SHORT" : "BUY",
                price: stratInfo.id === "pivot-trend" ? val.open : val.close,
              });
            } else if (currentPositionValue === "exit") {
              signalMarkers.push({
                date: val.date,
                strategyId: stratInfo.id,
                type: strategyValue.position.options?.short ? "COVER" : "SELL",
                price: stratInfo.id === "pivot-trend" ? val.open : val.close,
              });
            }
            lastPositionValue = currentPositionValue;
          }
        }
      }
    }

    signalMarkers.sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      symbol,
      prices: stockData,
      signals: signalMarkers,
    };
  }
}
