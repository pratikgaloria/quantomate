import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface ATRParams {
  period?: number;
}

export class ATR extends IndicatorBase<ATRParams, number> {
  constructor(name = 'ATR', params: ATRParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 14;
    const result: number[] = [];
    const trs: number[] = [];

    // Calculate True Range for all bars
    for (let i = 0; i < series.length; i++) {
      const bar = series.at(i)!;
      if (i === 0) {
        trs.push(bar.high - bar.low);
      } else {
        const prevBar = series.at(i - 1)!;
        const hl = bar.high - bar.low;
        const hc = Math.abs(bar.high - prevBar.close);
        const lc = Math.abs(bar.low - prevBar.close);
        trs.push(Math.max(hl, hc, lc));
      }
    }

    // Calculate Wilder's Smoothing / RMA
    let sumTR = 0;
    for (let i = 0; i < series.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
        if (i < period) {
          sumTR += trs[i];
        }
      } else if (i === period - 1) {
        sumTR += trs[i];
        result.push(sumTR / period);
      } else {
        const lastATR = result[i - 1];
        const currentATR = (lastATR * (period - 1) + trs[i]) / period;
        result.push(currentATR);
      }
    }

    return new Series(result);
  }
}
