import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface WilliamsRParams {
  period?: number;
}

export class WilliamsR extends IndicatorBase<WilliamsRParams, number> {
  constructor(name = 'WilliamsR', params: WilliamsRParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 14;
    const result: number[] = [];

    for (let i = 0; i < series.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
      } else {
        let highestHigh = Number.NEGATIVE_INFINITY;
        let lowestLow = Number.POSITIVE_INFINITY;

        for (let j = i - period + 1; j <= i; j++) {
          const bar = series.at(j)!;
          if (bar.high > highestHigh) highestHigh = bar.high;
          if (bar.low < lowestLow) lowestLow = bar.low;
        }

        const range = highestHigh - lowestLow;
        const currentClose = series.at(i)!.close;
        const rVal = range === 0 ? -50 : -100 * ((highestHigh - currentClose) / range);
        result.push(rVal);
      }
    }

    return new Series(result);
  }
}
