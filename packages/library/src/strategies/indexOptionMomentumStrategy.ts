import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface IndexOptionMomentumParams {
  fastPeriod?: number;
  slowPeriod?: number;
}

export class IndexOptionMomentumStrategy implements Strategy {
  public readonly name: string;
  private readonly fastPeriod: number;
  private readonly slowPeriod: number;

  constructor(name = 'IndexOptionMomentum', params: IndexOptionMomentumParams = {}) {
    this.name = name;
    this.fastPeriod = params.fastPeriod ?? 9;
    this.slowPeriod = params.slowPeriod ?? 20;
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const fastEmaSeries = context.getIndicatorSeries('fastEma');
    const slowEmaSeries = context.getIndicatorSeries('slowEma');

    if (!fastEmaSeries || !slowEmaSeries) {
      return { action: 'idle' };
    }

    const fast = fastEmaSeries.at(index);
    const slow = slowEmaSeries.at(index);
    const prevFast = fastEmaSeries.at(index - 1);
    const prevSlow = slowEmaSeries.at(index - 1);

    if (
      fast === undefined || isNaN(fast) ||
      slow === undefined || isNaN(slow) ||
      prevFast === undefined || isNaN(prevFast) ||
      prevSlow === undefined || isNaN(prevSlow)
    ) {
      return { action: 'idle' };
    }

    // Exit conditions
    const exitLong = prevFast >= prevSlow && fast < slow;
    const exitShort = prevFast <= prevSlow && fast > slow;

    if (exitLong || exitShort) {
      return { action: 'exit' };
    }

    // Entry conditions
    const entryLong = prevFast <= prevSlow && fast > slow;
    const entryShort = prevFast >= prevSlow && fast < slow;

    if (entryLong) {
      return { action: 'entry', direction: 'long' };
    }
    if (entryShort) {
      return { action: 'entry', direction: 'short' };
    }

    return { action: 'idle' };
  }
}
