import { Strategy, Quote, Indicator, Dataset, StrategyDirection } from '@quantomate/core';
import { PivotTrend, PIVOT_TREND_UP, PIVOT_TREND_DOWN } from '../../indicators';

export interface PivotTrendParams {
  direction?: StrategyDirection;
}

/**
 * Pivot-based trend following strategy.
 *
 * Uses the PivotTrend indicator from @quantomate/indicators:
 * - Today's pivot = Last day's (High + Low + Close) / 3
 * - R = (2 * Pivot) - Last day's Low, S = (2 * Pivot) - Last day's High
 * - Close > R ⇒ trend up (next day), Close < S ⇒ trend down (next day)
 *
 * Entry: when previous bar's trend is up → enter long at today's open.
 * Exit: when previous bar's trend is down → exit long.
 */
export class PivotTrendStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<PivotTrendParams> = {}) {
    const pivotTrend = new PivotTrend<any>('pivotTrend');

    super(name, {
      indicators: [pivotTrend],
      direction: params.direction,
      entryWhen: (quote: Quote<any>) => {
        const trend = quote.getIndicator('pivotTrend');
        if (trend === undefined || Number.isNaN(trend)) return false;
        return trend === PIVOT_TREND_UP;
      },
      exitWhen: (quote: Quote<any>) => {
        const trend = quote.getIndicator('pivotTrend');
        if (trend === undefined || Number.isNaN(trend)) return false;
        return trend === PIVOT_TREND_DOWN;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const trend = quote.getIndicator('pivotTrend');
        if (trend === undefined || Number.isNaN(trend)) return false;
        return trend === PIVOT_TREND_DOWN;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const trend = quote.getIndicator('pivotTrend');
        if (trend === undefined || Number.isNaN(trend)) return false;
        return trend === PIVOT_TREND_UP;
      },
    });
  }
}
