import { z } from "zod";

// ─── Shared ───────────────────────────────────────────────────────────────────

export const IntervalSchema = z
  .enum(["1m", "5m", "15m", "1h", "1d"])
  .default("1d")
  .describe("OHLCV candle interval");

export const MarketSchema = z
  .enum(["india", "us", "crypto"])
  .describe("Market identifier");

export const DirectionSchema = z
  .enum(["long", "short", "both"])
  .default("long")
  .describe("Trade direction");

// ─── Market Data ──────────────────────────────────────────────────────────────

export const HistoricalDataInputSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .describe(
      "Ticker symbol, e.g. AAPL, RELIANCE.NS, ^NSEI, BTC-USD"
    ),
  interval: IntervalSchema,
  limit: z
    .number()
    .int()
    .positive()
    .max(5000)
    .optional()
    .describe("Max number of candles to return (most recent). Omit for all."),
});

export const MarketStatusInputSchema = z.object({
  market: MarketSchema,
});

export const SymbolMetaInputSchema = z.object({
  symbol: z.string().min(1).describe("Ticker symbol"),
});

// ─── Indicators ───────────────────────────────────────────────────────────────

export const IndicatorIdSchema = z
  .enum([
    "SMA",
    "EMA",
    "WMA",
    "DEMA",
    "TEMA",
    "RSI",
    "MACD",
    "BB",
    "ATR",
    "CCI",
    "Stochastic",
    "WilliamsR",
    "PivotTrend",
    "AVWAP",
    "RVOL",
    "Slope",
    "VWAP",
    "ROC",
    "MOM",
  ])
  .describe("Indicator identifier");

export const ComputeIndicatorInputSchema = z.object({
  symbol: z.string().min(1).describe("Ticker symbol"),
  interval: IntervalSchema,
  indicator: IndicatorIdSchema,
  params: z
    .record(z.union([z.number(), z.string(), z.boolean()]))
    .optional()
    .describe(
      "Indicator parameters, e.g. { period: 14 } for RSI. Use list_indicators to see defaults."
    ),
  limit: z
    .number()
    .int()
    .positive()
    .max(5000)
    .optional()
    .describe("Number of recent candles to compute over"),
});

export const GetIndicatorValueInputSchema = ComputeIndicatorInputSchema.extend({
  count: z
    .number()
    .int()
    .positive()
    .max(500)
    .default(10)
    .describe("Number of most-recent indicator values to return"),
});

// ─── Backtest ─────────────────────────────────────────────────────────────────

export const StrategyIdSchema = z
  .enum([
    "golden-cross",
    "rsi-mean-reversion",
    "bollinger-bands",
    "macd",
    "pivot-trend",
  ])
  .describe("Pre-built strategy identifier");

export const BacktestInputSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .describe("Ticker symbol to backtest, e.g. AAPL or RELIANCE.NS"),
  strategy: StrategyIdSchema,
  interval: IntervalSchema,
  capital: z
    .number()
    .positive()
    .default(10000)
    .describe("Initial capital in base currency"),
  commission: z
    .number()
    .min(0)
    .max(50)
    .default(0)
    .describe("Commission cost per share (flat, e.g. 0.01)"),
  slippage: z
    .number()
    .min(0)
    .max(0.1)
    .default(0)
    .describe("Slippage as a decimal fraction (e.g. 0.001 = 0.1%)"),
  params: z
    .record(z.union([z.number(), z.string(), z.boolean()]))
    .optional()
    .describe("Strategy-specific parameters. Use list_strategies to see defaults."),
  limit: z
    .number()
    .int()
    .positive()
    .max(5000)
    .optional()
    .describe(
      "Limit candles used for backtest (most recent). Omit to use all available history."
    ),
});

export const CompareStrategiesInputSchema = z.object({
  symbol: z.string().min(1).describe("Ticker symbol to compare strategies on"),
  strategies: z
    .array(StrategyIdSchema)
    .min(2)
    .max(5)
    .describe("List of 2-5 strategy IDs to compare"),
  interval: IntervalSchema,
  capital: z.number().positive().default(10000),
  commission: z.number().min(0).max(50).default(0),
  slippage: z.number().min(0).max(0.1).default(0),
  limit: z.number().int().positive().max(5000).optional(),
});
