import { BarSeries, Strategy as V2Strategy, Series } from '@quantomate/core';
import {
  SMA, EMA, RSI, MACD, MACDSignal, PivotTrend, BB, ATR, VWAP, RVOL, WeeklyAVWAP, ChandelierExit
} from '@quantomate/library';

type BuilderFn = (s: any, base: BarSeries, map: Map<string, BarSeries>) => Series<any>;

const builders: Record<string, BuilderFn> = {
  rsi: (s, base) => new RSI('rsi', { period: s.rsiPeriod ?? 14, field: 'close' }).calculate(base),
  sma: (s, base) => new SMA('sma', { period: s.smaPeriod ?? 50, field: 'close' }).calculate(base),
  pivotTrend: (s, base) => new PivotTrend('pivotTrend').calculate(base),
  fastEma: (s, base) => new EMA('fastEma', { period: s.fastPeriod ?? 9, field: 'close' }).calculate(base),
  slowEma: (s, base) => new EMA('slowEma', { period: s.slowPeriod ?? 20, field: 'close' }).calculate(base),
  fastSma: (s, base) => new SMA('fastSma', { period: s.fastPeriod ?? 50, field: 'close' }).calculate(base),
  slowSma: (s, base) => new SMA('slowSma', { period: s.slowPeriod ?? 200, field: 'close' }).calculate(base),
  weeklyAvwap: (s, base) => new WeeklyAVWAP().calculate(base),
  volumeSma: (s, base) => new SMA('volumeSma', { period: s.volumeSmaPeriod ?? 20, field: 'volume' }).calculate(base),
  vwap: (s, base) => new VWAP().calculate(base),
  rvol: (s, base) => new RVOL('rvol', { period: s.period ?? s.bbPeriod ?? 20 }).calculate(base),
  bbUpper: (s, base) => new BB('bbUpper', { period: s.bbPeriod ?? 20, multiplier: s.bbStdDev ?? 2.0, band: 'upper' }).calculate(base),
  bbMiddle: (s, base) => new BB('bbMiddle', { period: s.bbPeriod ?? 20, multiplier: s.bbStdDev ?? 2.0, band: 'middle' }).calculate(base),
  bbLower: (s, base) => new BB('bbLower', { period: s.bbPeriod ?? 20, multiplier: s.bbStdDev ?? 2.0, band: 'lower' }).calculate(base),
  chandelierLong: (s, base) => new ChandelierExit('chandelierLong', { period: s.period ?? 22, multiplier: s.multiplier ?? 3.0, line: 'long' }).calculate(base),
  chandelierShort: (s, base) => new ChandelierExit('chandelierShort', { period: s.period ?? 22, multiplier: s.multiplier ?? 3.0, line: 'short' }).calculate(base),
  ema20: (s, base) => new EMA('ema20', { period: s.emaPeriod ?? 20, field: 'close' }).calculate(base),
  atr: (s, base) => new ATR('atr', { period: s.atrPeriod ?? 14 }).calculate(base),
  macd: (s, base) => new MACD('macd', { fastPeriod: s.fastPeriod ?? 12, slowPeriod: s.slowPeriod ?? 26, field: 'close' }).calculate(base),
  macdSignal: (s, base) => new MACDSignal('macdSignal', { fastPeriod: s.fastPeriod ?? 12, slowPeriod: s.slowPeriod ?? 26, signalPeriod: s.signalPeriod ?? 9, field: 'close' }).calculate(base),
  dailyEma50: (s, base, map) => new EMA('dailyEma50', { period: s.dailyEmaPeriod ?? 50, field: 'close' }).calculate(map.get('daily') ?? base),
  dailyPivotTrend: (s, base, map) => new PivotTrend('dailyPivotTrend').calculate(map.get('daily') ?? base),
  smaClose: (s, base) => new SMA('smaClose', { period: s.smaPeriod ?? 20, field: 'close' }).calculate(base),
};

export function createStrategyContext(
  strategy: V2Strategy,
  baseSeries: BarSeries,
  baseSeriesMap: Map<string, BarSeries>,
  symbol?: string
): any {
  const indicatorCache = new Map<string, Series<any>>();
  return {
    getIndicatorSeries: (name: string) => {
      if (indicatorCache.has(name)) {
        return indicatorCache.get(name);
      }
      const builder = builders[name];
      const resolvedMap = new Map<string, BarSeries>(baseSeriesMap);
      if (symbol) {
        const dailySeries = baseSeriesMap.get(`${symbol}:1d`) || baseSeriesMap.get(`${symbol}:1wk`);
        if (dailySeries) {
          resolvedMap.set('daily', dailySeries);
        }
      }
      const series = builder ? builder(strategy as any, baseSeries, resolvedMap) : undefined;
      if (series) {
        indicatorCache.set(name, series);
      }
      return series;
    },
    getSecondaryBarSeries: (id: string) => {
      if (id === 'daily' && symbol) {
        return baseSeriesMap.get(`${symbol}:1d`) || baseSeriesMap.get(`${symbol}:1wk`) || baseSeriesMap.get(id);
      }
      return baseSeriesMap.get(id);
    }
  };
}
