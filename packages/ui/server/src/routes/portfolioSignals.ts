import { Router, Request, Response } from "express";
import { prisma } from "@quantomate/db";
import { DataService, FundamentalService, PortfolioSignalService } from "@quantomate/data";
import { Dataset } from "@quantomate/core";
import { createStrategy } from "../services/backtestRunner";
import * as fs from "fs";
import * as path from "path";

const router = Router();

const ACTIVE_STRATEGIES = [
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

/**
 * Helper to calculate the required lookback (warmup) period for a strategy.
 */
function getStrategyLookback(strategyId: string, params: Record<string, any>): number {
  switch (strategyId) {
    case "golden-cross": {
      const slowPeriod = params.slowPeriod || 200;
      return slowPeriod + 10; // add a buffer for crossover and SMA calculations
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
      // MACD EMA 26 + signal EMA 9 + convergence buffer (100)
      return 26 + signalPeriod + 100;
    }
    case "pivot-trend": {
      return 10; // PivotTrend requires very little history
    }
    default:
      return 250; // Safe default lookback
  }
}

// GET /api/portfolio-signals - Get combined fundamental metrics and technical signals
router.get("/", async (req: Request, res: Response) => {
  try {
    const symbolsQuery = req.query.symbols as string;
    let symbolsList: string[] = [];

    if (symbolsQuery) {
      symbolsList = symbolsQuery
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
    } else {
      // Fallback: load all symbols from DB symbols list
      const dbSymbols = await prisma.symbol.findMany({ select: { id: true } });
      if (dbSymbols.length > 0) {
        symbolsList = dbSymbols.map((s) => s.id);
      } else {
        // Fallback: symbols.json
        const symbolsPath = path.resolve(__dirname, "../../symbols.json");
        symbolsList = JSON.parse(fs.readFileSync(symbolsPath, "utf-8"));
      }
    }

    const isCached = req.query.cached === "true";
    const results = await PortfolioSignalService.getSignals(symbolsList, isCached);
    res.json(results);
  } catch (error: any) {
    console.error("Error fetching portfolio signals:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch portfolio signals",
        message: error.message,
      });
  }
});

// GET /api/quotes/chart/:symbol - Get price history and signal markers for UI rendering
router.get("/chart/:symbol", async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.trim().toUpperCase();

    // 1. Fetch historical quotes from local TimescaleDB (fetching/syncing if needed)
    const history = await DataService.getHistoricalData(symbol);
    if (!history || history.length === 0) {
      return res
        .status(404)
        .json({ error: `No historical data found for symbol ${symbol}` });
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

    // 2. Scan historical quotes to collect all strategy execution markers
    for (const stratInfo of ACTIVE_STRATEGIES) {
      const strategy = createStrategy(stratInfo.id, stratInfo.params);
      dataset.prepare(strategy);

      let lastPositionValue: string | null = null;

      for (let i = 0; i < dataset.length; i++) {
        const quote = dataset.at(i)!;
        const val = quote.value as any;
        const strategyValue = quote.getStrategy(strategy.name);

        if (strategyValue) {
          const currentPositionValue = strategyValue.position.value; // 'idle' | 'entry' | 'hold' | 'exit'
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

    // Sort markers by date ascending
    signalMarkers.sort((a, b) => a.date.getTime() - b.date.getTime());

    res.json({
      symbol,
      prices: stockData,
      signals: signalMarkers,
    });
  } catch (error: any) {
    console.error(
      `Error loading chart details for ${req.params.symbol}:`,
      error,
    );
    res
      .status(500)
      .json({ error: "Failed to fetch chart details", message: error.message });
  }
});

export default router;
