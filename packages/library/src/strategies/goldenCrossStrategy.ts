import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface GoldenCrossParams {
  fastPeriod?: number;
  slowPeriod?: number;
  direction?: 'long' | 'short' | 'both';
}

export class GoldenCrossStrategy implements Strategy {
  public readonly name: string;
  private readonly fastPeriod: number;
  private readonly slowPeriod: number;
  private readonly direction: 'long' | 'short' | 'both';

  constructor(name = 'GoldenCross', params: GoldenCrossParams = {}) {
    this.name = name;
    this.fastPeriod = params.fastPeriod ?? 50;
    this.slowPeriod = params.slowPeriod ?? 200;
    this.direction = params.direction ?? 'both';
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const fastSmaSeries = context.getIndicatorSeries('fastSma');
    const slowSmaSeries = context.getIndicatorSeries('slowSma');

    if (!fastSmaSeries || !slowSmaSeries) {
      return { action: 'idle' };
    }

    const fastVal = fastSmaSeries.at(index);
    const slowVal = slowSmaSeries.at(index);
    const prevFast = fastSmaSeries.at(index - 1);
    const prevSlow = slowSmaSeries.at(index - 1);

    if (
      fastVal === undefined || isNaN(fastVal) ||
      slowVal === undefined || isNaN(slowVal) ||
      prevFast === undefined || isNaN(prevFast) ||
      prevSlow === undefined || isNaN(prevSlow)
    ) {
      return { action: 'idle' };
    }

    const canLong = this.direction === 'long' || this.direction === 'both';
    const canShort = this.direction === 'short' || this.direction === 'both';

    const entryLong = prevFast <= prevSlow && fastVal > slowVal;
    const exitLong = prevFast >= prevSlow && fastVal < slowVal;

    const entryShort = prevFast >= prevSlow && fastVal < slowVal;
    const exitShort = prevFast <= prevSlow && fastVal > slowVal;

    if (canLong && entryLong) {
      return { action: 'entry', direction: 'long' };
    }
    if (canShort && entryShort) {
      return { action: 'entry', direction: 'short' };
    }
    if ((canLong && exitLong) || (canShort && exitShort)) {
      return { action: 'exit' };
    }

    return { action: 'idle' };
  }
}
