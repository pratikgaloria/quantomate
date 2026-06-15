/**
 * Static catalogue of all available indicators.
 * Used by the list_indicators tool and compute_indicator tool.
 */
export const INDICATOR_CATALOGUE = [
  {
    id: "SMA",
    name: "Simple Moving Average",
    description:
      "Arithmetic mean of prices over a rolling window. Classic trend-following tool.",
    params: {
      period: { type: "number", default: 14, description: "Lookback period" },
      attribute: {
        type: "string",
        default: "close",
        description: "OHLCV field to compute on (close, open, high, low, volume)",
        optional: true,
      },
    },
    outputType: "number",
  },
  {
    id: "EMA",
    name: "Exponential Moving Average",
    description:
      "Weighted average giving more weight to recent prices. Reacts faster than SMA.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
  {
    id: "WMA",
    name: "Weighted Moving Average",
    description: "Linear-weighted average that emphasises recent bars.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
  {
    id: "DEMA",
    name: "Double Exponential Moving Average",
    description:
      "EMA of EMA — reduces lag compared to standard EMA.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
  {
    id: "TEMA",
    name: "Triple Exponential Moving Average",
    description: "Even lower-lag moving average built from three EMA layers.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
  {
    id: "RSI",
    name: "Relative Strength Index",
    description:
      "Momentum oscillator (0–100). Values above 70 indicate overbought; below 30 oversold.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
  {
    id: "MACD",
    name: "Moving Average Convergence Divergence",
    description:
      "Difference between fast and slow EMAs, with a signal line. Returns { macd, signal, histogram }.",
    params: {
      fastPeriod: { type: "number", default: 12 },
      slowPeriod: { type: "number", default: 26 },
      signalPeriod: { type: "number", default: 9 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "object { macd, signal, histogram }",
  },
  {
    id: "BB",
    name: "Bollinger Bands",
    description:
      "SMA ± N standard deviations. Returns { upper, middle, lower }.",
    params: {
      period: { type: "number", default: 20 },
      multiplier: { type: "number", default: 2 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "object { upper, middle, lower }",
  },
  {
    id: "ATR",
    name: "Average True Range",
    description:
      "Measures volatility as the average of true ranges over a period.",
    params: {
      period: { type: "number", default: 14 },
    },
    outputType: "number",
  },
  {
    id: "CCI",
    name: "Commodity Channel Index",
    description:
      "Oscillator measuring current price relative to average price. Values outside ±100 signal extremes.",
    params: {
      period: { type: "number", default: 20 },
    },
    outputType: "number",
  },
  {
    id: "Stochastic",
    name: "Stochastic Oscillator",
    description:
      "Compares closing price to range over N periods. Returns { k, d }.",
    params: {
      period: { type: "number", default: 14 },
      dPeriod: { type: "number", default: 3 },
    },
    outputType: "object { k, d }",
  },
  {
    id: "WilliamsR",
    name: "Williams %R",
    description:
      "Momentum oscillator (−100 to 0). Readings near −100 indicate oversold; near 0 overbought.",
    params: {
      period: { type: "number", default: 14 },
    },
    outputType: "number",
  },
  {
    id: "PivotTrend",
    name: "Pivot Trend",
    description:
      "Identifies trend direction based on pivot highs/lows. Returns 1 (up), −1 (down), or 0 (neutral).",
    params: {
      lookback: { type: "number", default: 5, optional: true },
    },
    outputType: "number (1 | -1 | 0)",
  },
  {
    id: "AVWAP",
    name: "Anchored VWAP",
    description:
      "Volume-Weighted Average Price anchored from a specific bar. Useful for session or event-based analysis.",
    params: {
      anchorIndex: {
        type: "number",
        default: 0,
        description: "Bar index to anchor from (0 = first bar in dataset)",
        optional: true,
      },
    },
    outputType: "number",
  },
  {
    id: "RVOL",
    name: "Relative Volume",
    description:
      "Today's volume relative to the average volume over the lookback period.",
    params: {
      period: { type: "number", default: 20 },
    },
    outputType: "number",
  },
  {
    id: "Slope",
    name: "Linear Regression Slope",
    description:
      "Slope of the least-squares regression line over N bars. Positive = uptrend.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
  {
    id: "VWAP",
    name: "Volume Weighted Average Price",
    description:
      "Average price weighted by volume since session start. Common intraday reference.",
    params: {},
    outputType: "number",
  },
  {
    id: "ROC",
    name: "Rate of Change",
    description:
      "Percentage change in price over N periods. Positive = bullish momentum.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
  {
    id: "MOM",
    name: "Momentum",
    description:
      "Absolute price change over N periods.",
    params: {
      period: { type: "number", default: 14 },
      attribute: { type: "string", default: "close", optional: true },
    },
    outputType: "number",
  },
] as const;

export type IndicatorId = (typeof INDICATOR_CATALOGUE)[number]["id"];

/**
 * Static catalogue of all pre-built strategies.
 * Used by the list_strategies tool and run_backtest tool.
 */
export const STRATEGY_CATALOGUE = [
  {
    id: "golden-cross",
    name: "Golden Cross",
    description:
      "Enters long when a fast SMA crosses above a slow SMA (bullish crossover). Exits on the death cross.",
    defaultParams: {
      fastPeriod: 50,
      slowPeriod: 200,
      direction: "long",
    },
    paramSchema: {
      fastPeriod: { type: "number", default: 50, description: "Fast SMA period" },
      slowPeriod: { type: "number", default: 200, description: "Slow SMA period" },
      direction: { type: "string", default: "long", enum: ["long", "short", "both"] },
    },
    minBarsRequired: 210,
  },
  {
    id: "rsi-mean-reversion",
    name: "RSI Mean Reversion",
    description:
      "Enters long when RSI dips below oversoldThreshold and exits when it rises above overboughtThreshold.",
    defaultParams: {
      rsiPeriod: 14,
      oversoldThreshold: 30,
      overboughtThreshold: 70,
      direction: "long",
    },
    paramSchema: {
      rsiPeriod: { type: "number", default: 14 },
      oversoldThreshold: { type: "number", default: 30 },
      overboughtThreshold: { type: "number", default: 70 },
      direction: { type: "string", default: "long", enum: ["long", "short", "both"] },
    },
    minBarsRequired: 24,
  },
  {
    id: "bollinger-bands",
    name: "Bollinger Bands",
    description:
      "Enters long on a close below the lower band (mean reversion) and exits at the middle or upper band.",
    defaultParams: {
      period: 20,
      multiplier: 2,
      direction: "long",
    },
    paramSchema: {
      period: { type: "number", default: 20 },
      multiplier: { type: "number", default: 2 },
      direction: { type: "string", default: "long", enum: ["long", "short", "both"] },
    },
    minBarsRequired: 30,
  },
  {
    id: "macd",
    name: "MACD",
    description:
      "Enters long when MACD crosses above the signal line (bullish crossover) and exits on reversal.",
    defaultParams: {
      signalPeriod: 9,
      direction: "long",
    },
    paramSchema: {
      signalPeriod: { type: "number", default: 9 },
      direction: { type: "string", default: "long", enum: ["long", "short", "both"] },
    },
    minBarsRequired: 35,
  },
  {
    id: "pivot-trend",
    name: "Pivot Trend",
    description:
      "Determines trend direction from pivot highs/lows. Enters in the direction of the trend, exits on reversal.",
    defaultParams: {
      direction: "both",
    },
    paramSchema: {
      direction: { type: "string", default: "both", enum: ["long", "short", "both"] },
    },
    minBarsRequired: 10,
  },
] as const;

export type StrategyId = (typeof STRATEGY_CATALOGUE)[number]["id"];
