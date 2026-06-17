import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface SMAParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class SMA extends IndicatorBase<SMAParams, number> {
  constructor(name = 'SMA', params: SMAParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 5;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);
    const result: number[] = [];

    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      if (i >= period) {
        sum -= values[i - period];
      }

      if (i < period - 1) {
        result.push(NaN);
      } else {
        result.push(sum / period);
      }
    }

    return new Series(result);
  }
}
