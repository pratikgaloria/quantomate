import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface AVWAPParams {
  anchorIndex?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class AVWAP extends IndicatorBase<AVWAPParams, number> {
  constructor(name = 'AVWAP', params: AVWAPParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const anchorIndex = this.params.anchorIndex ?? 0;
    const field = this.params.field || 'close';
    const result: number[] = [];

    let sumPV = 0;
    let sumV = 0;

    for (let i = 0; i < series.length; i++) {
      if (i < anchorIndex) {
        result.push(NaN);
      } else {
        const bar = series.at(i)!;
        const price = bar[field];
        const volume = bar.volume;

        sumPV += price * volume;
        sumV += volume;

        result.push(sumV === 0 ? price : sumPV / sumV);
      }
    }

    return new Series(result);
  }
}
