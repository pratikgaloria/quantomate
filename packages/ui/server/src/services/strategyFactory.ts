import {
  GoldenCrossStrategy, PivotTrendStrategy, RSIMeanReversionStrategy, BollingerBandsStrategy, MACDStrategy,
  StrongPullbackStrategy, BearPutSpreadStrategy, LongStraddleStrategy, LongStrangleStrategy,
  IndexOptionMomentumStrategy, IndexOptionRsiReversionStrategy, WeeklyAvwapOptionStrategy,
  VwapRvolOptionStrategy, VsaClimacticOptionStrategy, ChandelierTrendOptionStrategy
} from '@quantomate/library';

export function getWarmupDate(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export function createStrategy(strategyId: string, parameters: Record<string, any>) {
  switch (strategyId) {
    case 'golden-cross':
      return new GoldenCrossStrategy('Golden Cross', parameters);
    case 'pivot-trend':
    case 'pivot-trend-option':
      return new PivotTrendStrategy('Pivot Trend', parameters);
    case 'rsi-mean-reversion':
      return new RSIMeanReversionStrategy('RSI Mean Reversion', parameters);
    case 'bollinger-bands':
      return new BollingerBandsStrategy('Bollinger Bands', parameters);
    case 'macd':
      return new MACDStrategy('MACD', parameters);
    case 'strong-pullback':
      return new StrongPullbackStrategy('Strong Pullback', parameters);
    case 'bear-put-spread':
      return new BearPutSpreadStrategy('Bear Put Spread', parameters);
    case 'long-straddle':
      return new LongStraddleStrategy('Long Straddle', parameters);
    case 'long-strangle':
      return new LongStrangleStrategy('Long Strangle', parameters);
    case 'index-option-momentum':
      return new IndexOptionMomentumStrategy('Index Option Momentum', parameters);
    case 'index-option-rsi-reversion':
      return new IndexOptionRsiReversionStrategy('Index Option RSI Reversion', parameters);
    case 'vwap-rvol-option':
      return new VwapRvolOptionStrategy('VWAP RVOL Option', parameters);
    case 'vsa-climactic-option':
      return new VsaClimacticOptionStrategy('VSA Climactic Option', parameters);
    case 'weekly-avwap-option':
      return new WeeklyAvwapOptionStrategy('Weekly AVWAP Option', parameters);
    case 'chandelier-trend-option':
      return new ChandelierTrendOptionStrategy('Chandelier Trend Option', parameters);
    default:
      throw new Error(`Unknown strategy: ${strategyId}`);
  }
}
