import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface CCParams {
  period?: number;
}

export class CCI extends IndicatorBase<CCParams, number> {
  constructor(name = 'CCI', params: CCParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 20;
    const result: number[] = [];

    const highs = series.highs;
    const lows = series.lows;
    const closes = series.closes;
    const typicalPrices = new Float64Array(series.length);
    for (let i = 0; i < series.length; i++) {
      typicalPrices[i] = (highs[i] + lows[i] + closes[i]) / 3;
    }

    for (let i = 0; i < series.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
      } else {
        // Calculate SMA of Typical Prices over the period
        let sumTP = 0;
        for (let j = i - period + 1; j <= i; j++) {
          sumTP += typicalPrices[j];
        }
        const smaTP = sumTP / period;

        // Calculate Mean Deviation
        let sumAbsoluteDeviation = 0;
        for (let j = i - period + 1; j <= i; j++) {
          sumAbsoluteDeviation += Math.abs(typicalPrices[j] - smaTP);
        }
        const meanDeviation = sumAbsoluteDeviation / period;

        if (meanDeviation === 0) {
          result.push(0);
        } else {
          const cciVal = (typicalPrices[i] - smaTP) / (0.015 * meanDeviation);
          result.push(cciVal);
        }
      }
    }

    return new Series(result);
  }
}
