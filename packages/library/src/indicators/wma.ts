import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface WMAParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class WMA extends IndicatorBase<WMAParams, number> {
  constructor(name = 'WMA', params: WMAParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 9;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);
    const result: number[] = [];

    const denominator = (period * (period + 1)) / 2;

    for (let i = 0; i < values.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          const weight = j + 1;
          const val = values[i - period + 1 + j];
          sum += val * weight;
        }
        result.push(sum / denominator);
      }
    }

    return new Series(result);
  }
}
