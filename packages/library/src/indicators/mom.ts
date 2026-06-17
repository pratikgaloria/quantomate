import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface MOMParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class MOM extends IndicatorBase<MOMParams, number> {
  constructor(name = 'MOM', params: MOMParams = {}) {
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
        result.push(currentValue - pastValue);
      }
    }

    return new Series(result);
  }
}
