import { Indicator, Dataset } from '@quantomate/core';
import { ATR } from '../atr/atr';

export type ChandelierLineType = 'long' | 'short';

export interface IIndicatorParamsChandelierExit<T> {
  high?: T extends object ? keyof T : string;
  low?: T extends object ? keyof T : string;
  close?: T extends object ? keyof T : string;
  period?: number;
  multiplier?: number;
  line?: ChandelierLineType;
}

export class ChandelierExit<T = number> extends Indicator<IIndicatorParamsChandelierExit<T>, T> {
  constructor(name = 'ChandelierExit', params: IIndicatorParamsChandelierExit<T> = {}) {
    super(
      name,
      function (this: ChandelierExit<T>, dataset: Dataset<T>) {
        const {
          high,
          low,
          close,
          period = 22,
          multiplier = 3,
          line = 'long'
        } = params;

        const len = dataset.length;
        if (len < period) {
          return NaN;
        }

        // 1. Calculate ATR
        const atrIndicatorName = `${this.name}_atr_temp`;
        const atrIndicator = new ATR<T>(atrIndicatorName, { high, low, close, period });
        const atrVal = atrIndicator.calculate(dataset);

        if (isNaN(atrVal) || atrVal === undefined) {
          return NaN;
        }

        // 2. Find Highest High / Lowest Low over the last 'period' quotes
        let highestHigh = -Infinity;
        let lowestLow = Infinity;

        for (let i = len - period; i < len; i++) {
          const h = Number(high ? dataset.valueAt(i, high as string) : dataset.valueAt(i));
          const l = Number(low ? dataset.valueAt(i, low as string) : dataset.valueAt(i));
          if (h > highestHigh) highestHigh = h;
          if (l < lowestLow) lowestLow = l;
        }

        if (line === 'long') {
          return highestHigh - multiplier * atrVal;
        } else {
          return lowestLow + multiplier * atrVal;
        }
      },
      { params }
    );
  }
}
