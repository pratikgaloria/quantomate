import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface EMAParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class EMA extends IndicatorBase<EMAParams, number> {
  constructor(name = 'EMA', params: EMAParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 5;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);
    const result: number[] = [];

    if (values.length === 0) {
      return new Series([]);
    }

    const smoothing = 2 / (period + 1);
    let prevEma = NaN;

    for (let i = 0; i < values.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
      } else if (i === period - 1) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += values[j];
        }
        prevEma = sum / period;
        result.push(prevEma);
      } else {
        const emaVal = values[i] * smoothing + prevEma * (1 - smoothing);
        prevEma = emaVal;
        result.push(emaVal);
      }
    }

    return new Series(result);
  }
}
