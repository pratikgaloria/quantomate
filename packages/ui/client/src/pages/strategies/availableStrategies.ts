const num = (name: string, label: string, def: number) => ({ name, label, type: 'number', default: def });
const sel = (name: string, label: string, options: string[], def: string) => ({ name, label, type: 'select', options, default: def });
const bool = (name: string, label: string, def: boolean) => ({ name, label, type: 'boolean', default: def });

export const AVAILABLE_STRATEGIES: Record<string, any> = {
  GoldenCross: { name: 'Golden Cross', defaultParams: { fastPeriod: 9, slowPeriod: 20 }, paramSchema: [num('fastPeriod', 'Fast SMA Period', 9), num('slowPeriod', 'Slow SMA Period', 20)] },
  RSIMeanReversion: { name: 'RSI Mean Reversion', defaultParams: { rsiPeriod: 14, oversoldThreshold: 30, overboughtThreshold: 70 }, paramSchema: [num('rsiPeriod', 'RSI Period', 14), num('oversoldThreshold', 'Oversold Threshold', 30), num('overboughtThreshold', 'Overbought Threshold', 70)] },
  IndexOptionMomentum: { name: 'Index Option Momentum', defaultParams: { fastPeriod: 9, slowPeriod: 20, source: 'close' }, paramSchema: [num('fastPeriod', 'Fast Period', 9), num('slowPeriod', 'Slow Period', 20), sel('source', 'Source Candle Value', ['close', 'open', 'high', 'low'], 'close')] },
  IndexOptionRsiReversion: { name: 'Index Option RSI Reversion', defaultParams: { rsiPeriod: 14, oversoldThreshold: 30, overboughtThreshold: 70, source: 'close' }, paramSchema: [num('rsiPeriod', 'RSI Period', 14), num('oversoldThreshold', 'Oversold Threshold', 30), num('overboughtThreshold', 'Overbought Threshold', 70), sel('source', 'Source Candle Value', ['close', 'open', 'high', 'low'], 'close')] },
  PivotTrend: {
    name: 'Pivot Trend',
    defaultParams: {
      direction: 'both',
      useTrendFilter: false,
      trendFilterInterval: '1d',
      stopLossType: 'none',
      atrPeriod: 14,
      stopLossMultiplier: 2.0,
      continuousTrend: false
    },
    paramSchema: [
      sel('direction', 'Direction', ['both', 'long', 'short'], 'both'),
      bool('useTrendFilter', 'Use Trend Filter', false),
      sel('trendFilterInterval', 'Trend Filter Interval', ['1d', '1wk'], '1d'),
      sel('stopLossType', 'Stop Loss Type', ['none', 'fixed-atr', 'trailing-atr', 'pivot'], 'none'),
      num('atrPeriod', 'ATR Period', 14),
      num('stopLossMultiplier', 'Stop Loss Multiplier', 2.0),
      bool('continuousTrend', 'Continuous Trend (Ignore Neutral)', false)
    ]
  },
  PivotTrendOption: {
    name: 'Pivot Trend Option',
    defaultParams: {
      direction: 'both',
      useTrendFilter: false,
      trendFilterInterval: '1d',
      stopLossType: 'none',
      atrPeriod: 14,
      stopLossMultiplier: 2.0,
      continuousTrend: false
    },
    paramSchema: [
      sel('direction', 'Direction', ['both', 'long', 'short'], 'both'),
      bool('useTrendFilter', 'Use Trend Filter', false),
      sel('trendFilterInterval', 'Trend Filter Interval', ['1d', '1wk'], '1d'),
      sel('stopLossType', 'Stop Loss Type', ['none', 'fixed-atr', 'trailing-atr', 'pivot'], 'none'),
      num('atrPeriod', 'ATR Period', 14),
      num('stopLossMultiplier', 'Stop Loss Multiplier', 2.0),
      bool('continuousTrend', 'Continuous Trend (Ignore Neutral)', false)
    ]
  },
  VwapRvolOption: { name: 'VWAP + RVOL Option', defaultParams: { rvolThreshold: 2.0, source: 'close' }, paramSchema: [num('rvolThreshold', 'RVOL Threshold', 2.0), sel('source', 'Source Candle Value', ['close', 'open', 'high', 'low'], 'close')] },
  VsaClimacticOption: { name: 'VSA Climactic Option', defaultParams: { bbPeriod: 20, bbStdDev: 2.0, rvolThreshold: 2.0, bodyMultiplier: 0.8, source: 'close' }, paramSchema: [num('bbPeriod', 'BB Period', 20), num('bbStdDev', 'BB Std Dev', 2.0), num('rvolThreshold', 'RVOL Threshold', 2.0), num('bodyMultiplier', 'Body Multiplier', 0.8), sel('source', 'Source Candle Value', ['close', 'open', 'high', 'low'], 'close')] },
  WeeklyAvwapOption: { name: 'Weekly AVWAP Option', defaultParams: { volumeSmaPeriod: 20 }, paramSchema: [num('volumeSmaPeriod', 'Volume SMA Period', 20)] },
  ChandelierTrendOption: { name: 'Chandelier Trend Option', defaultParams: { period: 22, multiplier: 3.0, rvolThreshold: 2.0 }, paramSchema: [num('period', 'Chandelier Period', 22), num('multiplier', 'Chandelier Multiplier', 3.0), num('rvolThreshold', 'RVOL Threshold', 2.0)] },
  LongStraddle: { name: 'Long Straddle', defaultParams: { rsiPeriod: 14, lowerThreshold: 35, upperThreshold: 65 }, paramSchema: [num('rsiPeriod', 'RSI Period', 14), num('lowerThreshold', 'Lower RSI breakout limit', 35), num('upperThreshold', 'Upper RSI breakout limit', 65)] },
  LongStrangle: { name: 'Long Strangle', defaultParams: { rsiPeriod: 14, lowerThreshold: 35, upperThreshold: 65, strikeOffset: 2 }, paramSchema: [num('rsiPeriod', 'RSI Period', 14), num('lowerThreshold', 'Lower RSI breakout limit', 35), num('upperThreshold', 'Upper RSI breakout limit', 65), num('strikeOffset', 'Strike offset count', 2)] }
};

export const TIMEFRAME_INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '1d'];
