import { prisma } from "@quantomate/db";
import { DataService } from "../DataService";
import { FundamentalService } from "../fundamentals/FundamentalService";
import { 
  Bar, 
  BarSeries, 
  Series
} from "@quantomate/core";
import {
  SMA, 
  RSI, 
  BB, 
  MACD, 
  MACDSignal, 
  PivotTrend,
  GoldenCrossStrategy,
  PivotTrendStrategy,
  RSIMeanReversionStrategy,
  BollingerBandsStrategy,
  MACDStrategy
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
      return new GoldenCrossStrategy("Golden Cross", parameters);
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

function getIndicatorsForStrategy(
  strategyId: string,
  series: BarSeries,
  parameters: Record<string, any>
): { indicatorSeriesMap: Map<string, Series<number>>; secondarySeriesMap: Map<string, BarSeries> } {
  const indicatorSeriesMap = new Map<string, Series<number>>();
  const secondarySeriesMap = new Map<string, BarSeries>();

  switch (strategyId) {
    case "golden-cross": {
      const fastPeriod = parameters.fastPeriod || 50;
      const slowPeriod = parameters.slowPeriod || 200;
      indicatorSeriesMap.set("fastSma", new SMA("fastSma", { period: fastPeriod, field: "close" }).calculate(series));
      indicatorSeriesMap.set("slowSma", new SMA("slowSma", { period: slowPeriod, field: "close" }).calculate(series));
      break;
    }
    case "pivot-trend": {
      indicatorSeriesMap.set("pivotTrend", new PivotTrend("pivotTrend").calculate(series));
      break;
    }
    case "rsi-mean-reversion": {
      const rsiPeriod = parameters.rsiPeriod || 14;
      indicatorSeriesMap.set("rsi", new RSI("rsi", { period: rsiPeriod, field: "close" }).calculate(series));
      if (parameters.useTrendFilter) {
        const smaPeriod = parameters.smaPeriod || 50;
        indicatorSeriesMap.set("sma", new SMA("sma", { period: smaPeriod, field: "close" }).calculate(series));
      }
      break;
    }
    case "bollinger-bands": {
      const period = parameters.period || 20;
      const multiplier = parameters.multiplier || 2.0;
      indicatorSeriesMap.set("bbUpper", new BB("bbUpper", { period, multiplier, band: "upper" }).calculate(series));
      indicatorSeriesMap.set("bbLower", new BB("bbLower", { period, multiplier, band: "lower" }).calculate(series));
      break;
    }
    case "macd": {
      const fastPeriod = parameters.fastPeriod || 12;
      const slowPeriod = parameters.slowPeriod || 26;
      const signalPeriod = parameters.signalPeriod || 9;
      indicatorSeriesMap.set("macd", new MACD("macd", { fastPeriod, slowPeriod, field: "close" }).calculate(series));
      indicatorSeriesMap.set("macdSignal", new MACDSignal("macdSignal", { fastPeriod, slowPeriod, signalPeriod, field: "close" }).calculate(series));
      break;
    }
  }

  return { indicatorSeriesMap, secondarySeriesMap };
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

        const bars: Bar[] = stockData.map((d) => ({
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
          timestamp: d.date.getTime(),
        }));
        const series = new BarSeries(bars);
        const technicals: any[] = [];

        for (const stratInfo of ACTIVE_STRATEGIES) {
          const strategy = createStrategy(stratInfo.id, stratInfo.params);
          const { indicatorSeriesMap, secondarySeriesMap } = getIndicatorsForStrategy(stratInfo.id, series, stratInfo.params);
          const context = {
            getIndicatorSeries: (name: string) => indicatorSeriesMap.get(name),
            getSecondaryBarSeries: (id: string) => secondarySeriesMap.get(id),
          };

          const cached = symbolCachedMap?.get(stratInfo.id);

          let latestSignalValue = cached?.signalValue || "HOLD";
          let latestSignalPrice = cached?.price !== undefined ? Number(cached.price) : stockData[stockData.length - 1].close;
          let latestSignalDate = cached?.triggeredAt || stockData[stockData.length - 1].date;

          let status: 'idle' | 'long' | 'short' = 'idle';

          for (let i = 0; i < series.length; i++) {
            const bar = series.at(i)!;
            const signal = strategy.evaluate(series, i, context);

            if (status === 'idle') {
              if (signal.action === 'entry') {
                const isShort = signal.direction === 'short';
                status = isShort ? 'short' : 'long';
                const signalVal = isShort ? "SHORT" : "BUY";
                const price = stratInfo.id === "pivot-trend" ? bar.open : bar.close;
                const date = new Date(bar.timestamp);

                if (!cached || date.getTime() >= cached.triggeredAt.getTime()) {
                  latestSignalValue = signalVal;
                  latestSignalPrice = price;
                  latestSignalDate = date;
                }
              }
            } else {
              if (signal.action === 'exit') {
                const isShort = status === 'short';
                status = 'idle';
                const signalVal = isShort ? "COVER" : "SELL";
                const price = stratInfo.id === "pivot-trend" ? bar.open : bar.close;
                const date = new Date(bar.timestamp);

                if (!cached || date.getTime() >= cached.triggeredAt.getTime()) {
                  latestSignalValue = signalVal;
                  latestSignalPrice = price;
                  latestSignalDate = date;
                }
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

    const bars: Bar[] = stockData.map((d) => ({
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
      timestamp: d.date.getTime(),
    }));
    const series = new BarSeries(bars);
    const signalMarkers: any[] = [];

    for (const stratInfo of ACTIVE_STRATEGIES) {
      const strategy = createStrategy(stratInfo.id, stratInfo.params);
      const { indicatorSeriesMap, secondarySeriesMap } = getIndicatorsForStrategy(stratInfo.id, series, stratInfo.params);
      const context = {
        getIndicatorSeries: (name: string) => indicatorSeriesMap.get(name),
        getSecondaryBarSeries: (id: string) => secondarySeriesMap.get(id),
      };

      let status: 'idle' | 'long' | 'short' = 'idle';

      for (let i = 0; i < series.length; i++) {
        const bar = series.at(i)!;
        const signal = strategy.evaluate(series, i, context);

        if (status === 'idle') {
          if (signal.action === 'entry') {
            const isShort = signal.direction === 'short';
            status = isShort ? 'short' : 'long';
            signalMarkers.push({
              date: new Date(bar.timestamp),
              strategyId: stratInfo.id,
              type: isShort ? "SHORT" : "BUY",
              price: stratInfo.id === "pivot-trend" ? bar.open : bar.close,
            });
          }
        } else {
          if (signal.action === 'exit') {
            const isShort = status === 'short';
            status = 'idle';
            signalMarkers.push({
              date: new Date(bar.timestamp),
              strategyId: stratInfo.id,
              type: isShort ? "COVER" : "SELL",
              price: stratInfo.id === "pivot-trend" ? bar.open : bar.close,
            });
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

