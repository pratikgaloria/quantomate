import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface ROCParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class ROC extends IndicatorBase<ROCParams, number> {
  constructor(name = 'ROC', params: ROCParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 14;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);
    const result: number[] = [];

    for (let i = 0; i < values.length; i++) {
      if (i < period) {
        result.push(NaN);
      } else {
        const currentValue = values[i];
        const pastValue = values[i - period];
        if (pastValue === 0) {
          result.push(0);
        } else {
          result.push(((currentValue - pastValue) / pastValue) * 100);
        }
      }
    }

    return new Series(result);
  }
}
