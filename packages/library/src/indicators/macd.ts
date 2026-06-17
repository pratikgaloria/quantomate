import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';
import { EMA } from './ema';

export interface MACDParams {
  fastPeriod?: number;
  slowPeriod?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class MACD extends IndicatorBase<MACDParams, number> {
  constructor(name = 'MACD', params: MACDParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const fastPeriod = this.params.fastPeriod || 12;
    const slowPeriod = this.params.slowPeriod || 26;
    const field = this.params.field || 'close';

    const fastEma = new EMA('fast_ema', { period: fastPeriod, field }).calculate(series);
    const slowEma = new EMA('slow_ema', { period: slowPeriod, field }).calculate(series);

    const result: number[] = [];
    for (let i = 0; i < series.length; i++) {
      const f = fastEma.at(i);
      const s = slowEma.at(i);
      if (f === undefined || isNaN(f) || s === undefined || isNaN(s)) {
        result.push(NaN);
      } else {
        result.push(f - s);
      }
    }

    return new Series(result);
  }
}

export interface MACDSignalParams extends MACDParams {
  signalPeriod?: number;
}

export class MACDSignal extends IndicatorBase<MACDSignalParams, number> {
  constructor(name = 'MACDSignal', params: MACDSignalParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const macdLine = new MACD('macd', this.params).calculate(series);
    const signalPeriod = this.params.signalPeriod || 9;
    const result: number[] = [];
    const values = macdLine.toArray();

    let firstValidIndex = -1;
    for (let i = 0; i < values.length; i++) {
      if (!isNaN(values[i])) {
        firstValidIndex = i;
        break;
      }
    }

    if (firstValidIndex === -1 || values.length - firstValidIndex < signalPeriod) {
      return new Series(new Array(values.length).fill(NaN));
    }

    for (let i = 0; i < values.length; i++) {
      if (i < firstValidIndex + signalPeriod - 1) {
        result.push(NaN);
      } else if (i === firstValidIndex + signalPeriod - 1) {
        let sum = 0;
        for (let j = firstValidIndex; j <= i; j++) {
          sum += values[j];
        }
        result.push(sum / signalPeriod);
      } else {
        const smoothing = 2 / (signalPeriod + 1);
        const prevSignal = result[i - 1];
        result.push((values[i] - prevSignal) * smoothing + prevSignal);
      }
    }

    return new Series(result);
  }
}
