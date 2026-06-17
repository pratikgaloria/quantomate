import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface SlopeParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class Slope extends IndicatorBase<SlopeParams, number> {
  constructor(name = 'Slope', params: SlopeParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period ?? 1;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);
    const result: number[] = [];

    for (let i = 0; i < values.length; i++) {
      if (i < period) {
        result.push(NaN);
      } else {
        result.push(values[i] - values[i - period]);
      }
    }

    return new Series(result);
  }
}
