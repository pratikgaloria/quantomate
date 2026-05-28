import { Indicator, Dataset } from '@quantomate/core';

/**
 * Pivot-based trend direction.
 * 1 = up, -1 = down, 0 = neutral
 */
export const PIVOT_TREND_UP = 1;
export const PIVOT_TREND_DOWN = -1;
export const PIVOT_TREND_NEUTRAL = 0;

interface IIndicatorParamsPivotTrend<T> {
  high?: T extends object ? keyof T : string;
  low?: T extends object ? keyof T : string;
  close?: T extends object ? keyof T : string;
}

/**
 * Pivot-based trend indicator (daily bars).
 *
 * Today's pivot = Last day's (High + Low + Close) / 3
 * Today's R = (2 * Pivot) - Last day's Low
 * Today's S = (2 * Pivot) - Last day's High
 *
 * Today's close vs R/S decides the trend for the NEXT day:
 * - Close > R  → up   (1)
 * - Close < S  → down (-1)
 * - else       → neutral (0)
 *
 * Returns: 1 (up), -1 (down), 0 (neutral). NaN if not enough data.
 */
export class PivotTrend<T = number> extends Indicator<
  IIndicatorParamsPivotTrend<T>,
  T
> {
  constructor(name = 'PivotTrend', params: IIndicatorParamsPivotTrend<T> = {}) {
    super(
      name,
      function (this: PivotTrend<T>, dataset: Dataset<T>) {
        const high = (params.high as string) || 'high';
        const low = (params.low as string) || 'low';
        const close = (params.close as string) || 'close';
        const datasetLength = dataset.length;

        if (datasetLength < 2) {
          return NaN;
        }

        const previousHigh = Number(dataset.valueAt(-2, high));
        const previousLow = Number(dataset.valueAt(-2, low));
        const previousClose = Number(dataset.valueAt(-2, close));
        const currentClose = Number(dataset.valueAt(-1, close));

        if (
          Number.isNaN(previousHigh) ||
          Number.isNaN(previousLow) ||
          Number.isNaN(previousClose) ||
          Number.isNaN(currentClose)
        ) {
          return NaN;
        }

        const pivot = (previousHigh + previousLow + previousClose) / 3;
        const resistance = 2 * pivot - previousLow;
        const support = 2 * pivot - previousHigh;

        if (currentClose > resistance) {
          return PIVOT_TREND_UP;
        }
        if (currentClose < support) {
          return PIVOT_TREND_DOWN;
        }
        return PIVOT_TREND_NEUTRAL;
      },
      {
        params,
      }
    );

    this.withIncremental((prev, quote, dataset) => {
      return this.calculate(dataset);
    });
  }
}
