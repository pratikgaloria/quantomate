import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';
import { ATR } from './atr';

export type ChandelierLineType = 'long' | 'short';

export interface ChandelierExitParams {
  period?: number;
  multiplier?: number;
  line?: ChandelierLineType;
}

export class ChandelierExit extends IndicatorBase<ChandelierExitParams, number> {
  constructor(name = 'ChandelierExit', params: ChandelierExitParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 22;
    const multiplier = this.params.multiplier || 3;
    const line = this.params.line || 'long';

    const atrCalc = new ATR(`${this.name}_atr`, { period });
    const atrSeries = atrCalc.calculate(series);

    const result: number[] = [];

    for (let i = 0; i < series.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
        continue;
      }

      const atrVal = atrSeries.at(i);
      if (atrVal === undefined || isNaN(atrVal)) {
        result.push(NaN);
        continue;
      }

      let highestHigh = -Infinity;
      let lowestLow = Infinity;

      for (let j = i - period + 1; j <= i; j++) {
        const bar = series.at(j)!;
        if (bar.high > highestHigh) highestHigh = bar.high;
        if (bar.low < lowestLow) lowestLow = bar.low;
      }

      if (line === 'long') {
        result.push(highestHigh - multiplier * atrVal);
      } else {
        result.push(lowestLow + multiplier * atrVal);
      }
    }

    return new Series(result);
  }
}
