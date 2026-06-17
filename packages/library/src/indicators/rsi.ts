import { BarSeries } from '@quantomate/core';
import { IndicatorBase } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface RSIParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export class RSI extends IndicatorBase<RSIParams, number> {
  constructor(name = 'RSI', params: RSIParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 14;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);
    const result: number[] = [];

    if (values.length <= period) {
      return new Series(new Array(values.length).fill(NaN));
    }

    let avgGain = 0;
    let avgLoss = 0;

    let sumGain = 0;
    let sumLoss = 0;
    for (let i = 1; i <= period; i++) {
      const diff = values[i] - values[i - 1];
      if (diff > 0) {
        sumGain += diff;
      } else {
        sumLoss -= diff;
      }
    }

    avgGain = sumGain / period;
    avgLoss = sumLoss / period;

    for (let i = 0; i < period; i++) {
      result.push(NaN);
    }

    const rs0 = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    const rsi0 = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs0);
    result.push(rsi0);

    for (let i = period + 1; i < values.length; i++) {
      const diff = values[i] - values[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
      const rsiVal = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
      result.push(rsiVal);
    }

    return new Series(result);
  }
}
