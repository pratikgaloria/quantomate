import { BarSeries, Series } from '@quantomate/core';
import {
  SMA, EMA, RSI, MACD, MACDSignal, PivotTrend, BB, ATR, VWAP, RVOL, WeeklyAVWAP, ChandelierExit
} from '@quantomate/library';

type BuilderFn = (p: any, base: BarSeries, ds?: BarSeries) => Series<number>;

const builders: Record<string, BuilderFn> = {
  fastSma: (p, s) => new SMA('fastSma', { period: p.fastPeriod || 50, field: 'close' }).calculate(s),
  slowSma: (p, s) => new SMA('slowSma', { period: p.slowPeriod || 200, field: 'close' }).calculate(s),
  pivotTrend: (p, s) => new PivotTrend('pivotTrend').calculate(s),
  dailyPivotTrend: (p, s, ds) => new PivotTrend('dailyPivotTrend').calculate(ds || s),
  rsi: (p, s) => new RSI('rsi', { period: p.rsiPeriod || 14, field: 'close' }).calculate(s),
  sma: (p, s) => new SMA('sma', { period: p.smaPeriod || 50, field: 'close' }).calculate(s),
  bbUpper: (p, s) => new BB('bbUpper', { period: p.period ?? p.bbPeriod ?? 20, multiplier: p.multiplier ?? p.bbStdDev ?? 2.0, band: 'upper' }).calculate(s),
  bbMiddle: (p, s) => new BB('bbMiddle', { period: p.period ?? p.bbPeriod ?? 20, multiplier: p.multiplier ?? p.bbStdDev ?? 2.0, band: 'middle' }).calculate(s),
  bbLower: (p, s) => new BB('bbLower', { period: p.period ?? p.bbPeriod ?? 20, multiplier: p.multiplier ?? p.bbStdDev ?? 2.0, band: 'lower' }).calculate(s),
  macd: (p, s) => new MACD('macd', { fastPeriod: p.fastPeriod || 12, slowPeriod: p.slowPeriod || 26, field: 'close' }).calculate(s),
  macdSignal: (p, s) => new MACDSignal('macdSignal', { fastPeriod: p.fastPeriod || 12, slowPeriod: p.slowPeriod || 26, signalPeriod: p.signalPeriod || 9, field: 'close' }).calculate(s),
  ema20: (p, s) => new EMA('ema20', { period: p.emaPeriod || 20, field: 'close' }).calculate(s),
  vwap: (p, s) => new VWAP().calculate(s),
  rvol: (p, s) => new RVOL('rvol', { period: p.period ?? p.bbPeriod ?? 20 }).calculate(s),
  atr: (p, s) => new ATR('atr', { period: p.atrPeriod || 14 }).calculate(s),
  dailyEma50: (p, s, ds) => new EMA('dailyEma50', { period: p.dailyEmaPeriod || 50, field: 'close' }).calculate(ds || s),
  fastEma: (p, s) => new EMA('fastEma', { period: p.fastPeriod || 9, field: 'close' }).calculate(s),
  slowEma: (p, s) => new EMA('slowEma', { period: p.slowPeriod || 20, field: 'close' }).calculate(s),
  weeklyAvwap: (p, s) => new WeeklyAVWAP().calculate(s),
  volumeSma: (p, s) => new SMA('volumeSma', { period: p.volumeSmaPeriod ?? 20, field: 'volume' }).calculate(s),
  chandelierLong: (p, s) => new ChandelierExit('chandelierLong', { period: p.period ?? 22, multiplier: p.multiplier ?? 3.0, line: 'long' }).calculate(s),
  chandelierShort: (p, s) => new ChandelierExit('chandelierShort', { period: p.period ?? 22, multiplier: p.multiplier ?? 3.0, line: 'short' }).calculate(s),
};

const strategyIndicatorMap: Record<string, string[]> = {
  'golden-cross': ['fastSma', 'slowSma'],
  'pivot-trend': ['pivotTrend', 'dailyPivotTrend', 'atr'],
  'pivot-trend-option': ['pivotTrend', 'dailyPivotTrend', 'atr'],
  'rsi-mean-reversion': ['rsi'],
  'bollinger-bands': ['bbUpper', 'bbLower'],
  'macd': ['macd', 'macdSignal'],
  'strong-pullback': ['ema20', 'vwap', 'rvol', 'atr', 'dailyEma50'],
  'bear-put-spread': ['fastEma', 'slowEma', 'rsi'],
  'long-straddle': ['rsi'],
  'long-strangle': ['rsi'],
  'index-option-momentum': ['fastEma', 'slowEma'],
  'index-option-rsi-reversion': ['rsi'],
  'vwap-rvol-option': ['vwap', 'rvol'],
  'vsa-climactic-option': ['bbUpper', 'bbMiddle', 'bbLower', 'rvol'],
  'weekly-avwap-option': ['weeklyAvwap', 'volumeSma'],
  'chandelier-trend-option': ['chandelierLong', 'chandelierShort', 'rvol'],
};

export function getIndicatorsForStrategy(
  strategyId: string,
  series: BarSeries,
  parameters: Record<string, any>,
  dailySeries?: BarSeries
): { indicatorSeriesMap: Map<string, Series<number>>; secondarySeriesMap: Map<string, BarSeries> } {
  const indicatorSeriesMap = new Map<string, Series<number>>();
  const secondarySeriesMap = new Map<string, BarSeries>();
  if (dailySeries) secondarySeriesMap.set('daily', dailySeries);

  const list = strategyIndicatorMap[strategyId] || [];
  for (const name of list) {
    const builder = builders[name];
    if (builder) {
      indicatorSeriesMap.set(name, builder(parameters, series, dailySeries));
    }
  }

  if (strategyId === 'rsi-mean-reversion' && parameters.useTrendFilter) {
    indicatorSeriesMap.set('sma', builders.sma(parameters, series));
  }

  return { indicatorSeriesMap, secondarySeriesMap };
}
