import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface VWAPParams {
  field?: 'open' | 'high' | 'low' | 'close' | 'hlc3';
  volumeField?: 'volume';
}

export class VWAP extends IndicatorBase<VWAPParams, number> {
  constructor(name = 'VWAP', params: VWAPParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const field = this.params.field || 'close';
    const volumeField = this.params.volumeField || 'volume';
    const result: number[] = [];

    let isDailyOrHigher = false;
    if (series.length > 1) {
      let minDiff = Infinity;
      const limit = Math.min(series.length, 50);
      for (let j = 1; j < limit; j++) {
        const diff = series.at(j)!.timestamp - series.at(j - 1)!.timestamp;
        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
        }
      }
      if (minDiff !== Infinity && minDiff >= 20 * 60 * 60 * 1000) {
        isDailyOrHigher = true;
      }
    }

    let currentSumPV = 0;
    let currentSumV = 0;

    for (let i = 0; i < series.length; i++) {
      const bar = series.at(i)!;
      let price = 0;
      if (field === 'hlc3') {
        price = (bar.high + bar.low + bar.close) / 3;
      } else {
        price = bar[field as 'open' | 'high' | 'low' | 'close' | 'volume'];
      }
      const vol = bar[volumeField] || 0;

      if (i > 0) {
        const prevBar = series.at(i - 1)!;
        const d1 = new Date(bar.timestamp);
        const d2 = new Date(prevBar.timestamp);
        const isNewSession =
          !isDailyOrHigher &&
          (d1.getFullYear() !== d2.getFullYear() ||
            d1.getMonth() !== d2.getMonth() ||
            d1.getDate() !== d2.getDate());

        if (isNewSession) {
          currentSumPV = 0;
          currentSumV = 0;
        }
      }

      currentSumPV += price * vol;
      currentSumV += vol;

      const vwapVal = currentSumV === 0 ? price : currentSumPV / currentSumV;
      result.push(vwapVal);
    }

    return new Series(result);
  }
}
