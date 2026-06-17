import { BarSeries, Strategy as V2Strategy, Series } from '@quantomate/core';
import {
  SMA,
  ChandelierExit,
  WeeklyAVWAP,
  VWAP,
  RVOL,
  BB
} from '@quantomate/library';

export function createStrategyContext(
  strategy: V2Strategy,
  baseSeries: BarSeries,
  baseSeriesMap: Map<string, BarSeries>
): any {
  const indicatorCache = new Map<string, Series<any>>();
  return {
    getIndicatorSeries: (name: string) => {
      if (indicatorCache.has(name)) {
        return indicatorCache.get(name);
      }

      let series: Series<any> | undefined = undefined;

      if (name === 'weeklyAvwap') {
        series = new WeeklyAVWAP().calculate(baseSeries);
      } else if (name === 'volumeSma') {
        const period = (strategy as any).volumeSmaPeriod ?? 20;
        series = new SMA('volumeSma', { period, field: 'volume' }).calculate(baseSeries);
      } else if (name === 'vwap') {
        series = new VWAP().calculate(baseSeries);
      } else if (name === 'rvol') {
        const period = (strategy as any).period ?? (strategy as any).bbPeriod ?? 20;
        series = new RVOL('rvol', { period }).calculate(baseSeries);
      } else if (name === 'bbUpper') {
        const period = (strategy as any).bbPeriod ?? 20;
        const multiplier = (strategy as any).bbStdDev ?? 2.0;
        series = new BB('bbUpper', { period, multiplier, band: 'upper' }).calculate(baseSeries);
      } else if (name === 'bbMiddle') {
        const period = (strategy as any).bbPeriod ?? 20;
        const multiplier = (strategy as any).bbStdDev ?? 2.0;
        series = new BB('bbMiddle', { period, multiplier, band: 'middle' }).calculate(baseSeries);
      } else if (name === 'bbLower') {
        const period = (strategy as any).bbPeriod ?? 20;
        const multiplier = (strategy as any).bbStdDev ?? 2.0;
        series = new BB('bbLower', { period, multiplier, band: 'lower' }).calculate(baseSeries);
      } else if (name === 'chandelierLong') {
        const period = (strategy as any).period ?? 22;
        const multiplier = (strategy as any).multiplier ?? 3.0;
        series = new ChandelierExit('chandelierLong', { period, multiplier, line: 'long' }).calculate(baseSeries);
      } else if (name === 'chandelierShort') {
        const period = (strategy as any).period ?? 22;
        const multiplier = (strategy as any).multiplier ?? 3.0;
        series = new ChandelierExit('chandelierShort', { period, multiplier, line: 'short' }).calculate(baseSeries);
      } else if (name === 'smaClose') {
        const period = (strategy as any).smaPeriod ?? 20;
        series = new SMA('smaClose', { period, field: 'close' }).calculate(baseSeries);
      }

      if (series) {
        indicatorCache.set(name, series);
      }
      return series;
    },
    getSecondaryBarSeries: (id: string) => {
      return baseSeriesMap.get(id);
    }
  };
}
