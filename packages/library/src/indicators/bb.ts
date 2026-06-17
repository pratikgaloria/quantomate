import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';
import { SMA } from './sma';

export type BollingerBandType = 'upper' | 'middle' | 'lower';

export interface BBParams {
  period?: number;
  multiplier?: number;
  band?: BollingerBandType;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class BB extends IndicatorBase<BBParams, number> {
  constructor(name = 'BB', params: BBParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 20;
    const multiplier = this.params.multiplier || 2;
    const band = this.params.band || 'middle';
    const field = this.params.field || 'close';

    const middleSma = new SMA('middle_sma', { period, field }).calculate(series);
    const result: number[] = [];

    for (let i = 0; i < series.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
        continue;
      }

      const middleVal = middleSma.at(i)!;
      let sumSquaredDiff = 0;
      for (let j = i - period + 1; j <= i; j++) {
        const bar = series.at(j)!;
        const val = bar[field];
        const diff = val - middleVal;
        sumSquaredDiff += diff * diff;
      }
      const stdDev = Math.sqrt(sumSquaredDiff / period);

      if (band === 'upper') {
        result.push(middleVal + multiplier * stdDev);
      } else if (band === 'lower') {
        result.push(middleVal - multiplier * stdDev);
      } else {
        result.push(middleVal);
      }
    }

    return new Series(result);
  }
}
