import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface StochasticParams {
  kPeriod?: number;
  dPeriod?: number;
}

export interface StochasticOutput {
  k: number;
  d: number;
}

export class Stochastic extends IndicatorBase<StochasticParams, StochasticOutput> {
  constructor(name = 'Stochastic', params: StochasticParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<StochasticOutput> {
    const kPeriod = this.params.kPeriod || 14;
    const dPeriod = this.params.dPeriod || 3;
    const result: StochasticOutput[] = [];

    const kValues: number[] = [];

    // Calculate %K for all indices
    for (let i = 0; i < series.length; i++) {
      if (i < kPeriod - 1) {
        kValues.push(NaN);
      } else {
        let highestHigh = Number.NEGATIVE_INFINITY;
        let lowestLow = Number.POSITIVE_INFINITY;

        for (let j = i - kPeriod + 1; j <= i; j++) {
          const bar = series.at(j)!;
          if (bar.high > highestHigh) highestHigh = bar.high;
          if (bar.low < lowestLow) lowestLow = bar.low;
        }

        const range = highestHigh - lowestLow;
        const currentClose = series.at(i)!.close;
        const kVal = range === 0 ? 50 : 100 * ((currentClose - lowestLow) / range);
        kValues.push(kVal);
      }
    }

    // Calculate %D (SMA of %K)
    for (let i = 0; i < series.length; i++) {
      const kVal = kValues[i];

      if (i < kPeriod + dPeriod - 2) {
        result.push({ k: kVal, d: NaN });
      } else {
        let sumK = 0;
        let valid = true;
        for (let j = i - dPeriod + 1; j <= i; j++) {
          if (isNaN(kValues[j])) {
            valid = false;
            break;
          }
          sumK += kValues[j];
        }

        const dVal = valid ? sumK / dPeriod : NaN;
        result.push({ k: kVal, d: dVal });
      }
    }

    return new Series(result);
  }
}
