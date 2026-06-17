import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export const PIVOT_TREND_UP = 1;
export const PIVOT_TREND_DOWN = -1;
export const PIVOT_TREND_NEUTRAL = 0;

export class PivotTrend extends IndicatorBase<any, number> {
  constructor(name = 'PivotTrend') {
    super(name, {});
  }

  calculate(series: BarSeries): Series<number> {
    const result: number[] = [];

    for (let i = 0; i < series.length; i++) {
      if (i < 1) {
        result.push(NaN);
        continue;
      }

      const prevBar = series.at(i - 1)!;
      const currentBar = series.at(i)!;

      const pivot = (prevBar.high + prevBar.low + prevBar.close) / 3;
      const resistance = 2 * pivot - prevBar.low;
      const support = 2 * pivot - prevBar.high;

      if (currentBar.close > resistance) {
        result.push(PIVOT_TREND_UP);
      } else if (currentBar.close < support) {
        result.push(PIVOT_TREND_DOWN);
      } else {
        result.push(PIVOT_TREND_NEUTRAL);
      }
    }

    return new Series(result);
  }
}
