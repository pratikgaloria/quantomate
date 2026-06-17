import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';
import { PIVOT_TREND_UP, PIVOT_TREND_DOWN } from '../indicators/pivotTrend';

export interface PivotTrendParams {
  direction?: 'long' | 'short' | 'both';
}

export class PivotTrendStrategy implements Strategy {
  public readonly name: string;
  private readonly direction: 'long' | 'short' | 'both';

  constructor(name = 'PivotTrend', params: PivotTrendParams = {}) {
    this.name = name;
    this.direction = params.direction ?? 'both';
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    const trendSeries = context.getIndicatorSeries('pivotTrend');
    if (!trendSeries) {
      return { action: 'idle' };
    }

    const trend = trendSeries.at(index);
    if (trend === undefined || isNaN(trend)) {
      return { action: 'idle' };
    }

    const canLong = this.direction === 'long' || this.direction === 'both';
    const canShort = this.direction === 'short' || this.direction === 'both';

    if (canLong && trend === PIVOT_TREND_UP) {
      return { action: 'entry', direction: 'long' };
    }
    if (canShort && trend === PIVOT_TREND_DOWN) {
      return { action: 'entry', direction: 'short' };
    }
    if ((canLong && trend === PIVOT_TREND_DOWN) || (canShort && trend === PIVOT_TREND_UP)) {
      return { action: 'exit' };
    }

    return { action: 'idle' };
  }
}
