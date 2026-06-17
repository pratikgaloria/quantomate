import { BarSeries, IndicatorBase, Series } from '@quantomate/core';

export interface DEMAParams {
  period?: number;
  field?: 'open' | 'high' | 'low' | 'close' | 'volume';
}

export function calculateEmaValues(values: number[] | Float64Array, period: number): number[] {
  const result: number[] = [];
  if (values.length === 0) return result;

  const smoothing = 2 / (period + 1);
  let prevEma = NaN;

  for (let i = 0; i < values.length; i++) {
    if (isNaN(values[i])) {
      result.push(NaN);
      prevEma = NaN;
      continue;
    }

    // We need 'period' valid non-NaN elements to start the EMA
    // Check if we have enough elements
    let firstValidIndex = -1;
    for (let k = 0; k < values.length; k++) {
      if (!isNaN(values[k])) {
        firstValidIndex = k;
        break;
      }
    }

    if (firstValidIndex === -1 || i < firstValidIndex + period - 1) {
      result.push(NaN);
    } else if (i === firstValidIndex + period - 1) {
      let sum = 0;
      for (let j = firstValidIndex; j <= i; j++) {
        sum += values[j];
      }
      prevEma = sum / period;
      result.push(prevEma);
    } else {
      if (isNaN(prevEma)) {
        // Find if we can restart
        let sum = 0;
        let hasNan = false;
        for (let j = i - period + 1; j <= i; j++) {
          if (isNaN(values[j])) {
            hasNan = true;
            break;
          }
          sum += values[j];
        }
        if (hasNan) {
          result.push(NaN);
          prevEma = NaN;
        } else {
          prevEma = sum / period;
          result.push(prevEma);
        }
      } else {
        const emaVal = values[i] * smoothing + prevEma * (1 - smoothing);
        prevEma = emaVal;
        result.push(emaVal);
      }
    }
  }
  return result;
}

export class DEMA extends IndicatorBase<DEMAParams, number> {
  constructor(name = 'DEMA', params: DEMAParams = {}) {
    super(name, params);
  }

  calculate(series: BarSeries): Series<number> {
    const period = this.params.period || 9;
    const field = this.params.field || 'close';
    const values = series.getPriceColumn(field);

    const ema1 = calculateEmaValues(values, period);
    const ema2 = calculateEmaValues(ema1, period);

    const result: number[] = [];
    for (let i = 0; i < values.length; i++) {
      const e1 = ema1[i];
      const e2 = ema2[i];
      if (isNaN(e1) || isNaN(e2)) {
        result.push(NaN);
      } else {
        result.push(2 * e1 - e2);
      }
    }

    return new Series(result);
  }
}
