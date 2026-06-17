import { BarSeries, IndicatorBase, Series } from '@quantomate/core';
import { calculateEmaValues } from './dema';

export interface TEMAParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class TEMA extends IndicatorBase<TEMAParams, number> {
  constructor(name = 'TEMA', params: TEMAParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 9;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);

    const ema1 = calculateEmaValues(values, period);
    const ema2 = calculateEmaValues(ema1, period);
    const ema3 = calculateEmaValues(ema2, period);

    const result: number[] = [];
    for (let i = 0; i < values.length; i++) {
      const e1 = ema1[i];
      const e2 = ema2[i];
      const e3 = ema3[i];
      if (isNaN(e1) || isNaN(e2) || isNaN(e3)) {
        result.push(NaN);
      } else {
        result.push(3 * e1 - 3 * e2 + e3);
      }
    }

    return new Series(result);
  }
}
