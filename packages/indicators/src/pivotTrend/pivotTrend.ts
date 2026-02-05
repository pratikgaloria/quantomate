import { Indicator, Dataset } from '@quantomate/core';

/**
 * Pivot-based trend direction.
 * 1 = up, -1 = down, 0 = neutral
 */
export const PIVOT_TREND_UP = 1;
export const PIVOT_TREND_DOWN = -1;
export const PIVOT_TREND_NEUTRAL = 0;

interface IIndicatorParamsPivotTrend {}

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
  IIndicatorParamsPivotTrend,
  T
> {
  constructor(name = 'PivotTrend') {
    super(
      name,
      function (this: PivotTrend<T>, dataset: Dataset<T>) {
        const high = 'high';
        const low = 'low';
        const close = 'close';
        const datasetLength = dataset.length;

        if (datasetLength < 3) {
          return NaN;
        }

        const dayBeforeYesterdayHigh = Number(dataset.valueAt(-3, high));
        const dayBeforeYesterdayLow = Number(dataset.valueAt(-3, low));
        const dayBeforeYesterdayClose = Number(dataset.valueAt(-3, close));
        const yesterdayClose = Number(dataset.valueAt(-2, close));

        if (
          Number.isNaN(dayBeforeYesterdayHigh) ||
          Number.isNaN(dayBeforeYesterdayLow) ||
          Number.isNaN(dayBeforeYesterdayClose) ||
          Number.isNaN(yesterdayClose)
        ) {
          return NaN;
        }

        const pivot = (dayBeforeYesterdayHigh + dayBeforeYesterdayLow + dayBeforeYesterdayClose) / 3;
        const resistance = 2 * pivot - dayBeforeYesterdayLow;
        const support = 2 * pivot - dayBeforeYesterdayHigh;

        if (yesterdayClose > resistance) {
          return PIVOT_TREND_UP;
        }
        if (yesterdayClose < support) {
          return PIVOT_TREND_DOWN;
        }
        return PIVOT_TREND_NEUTRAL;
      },
      {
        params: {},
      }
    );

    this.withIncremental((prev, quote, dataset) => {
      return this.calculate(dataset);
    });
  }
}
