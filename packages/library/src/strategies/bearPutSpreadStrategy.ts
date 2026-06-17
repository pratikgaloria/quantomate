import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface BearPutSpreadParams {
  fastPeriod?: number;
  slowPeriod?: number;
  rsiPeriod?: number;
  rsiOversold?: number;
  useRsiExit?: boolean;
  strikeOffset?: number;
}

export class BearPutSpreadStrategy implements Strategy {
  public readonly name: string;
  private readonly fastPeriod: number;
  private readonly slowPeriod: number;
  private readonly rsiPeriod: number;
  private readonly rsiOversold: number;
  private readonly useRsiExit: boolean;
  public readonly strikeOffset: number;

  constructor(name = 'BearPutSpread', params: BearPutSpreadParams = {}) {
    this.name = name;
    this.fastPeriod = params.fastPeriod ?? 9;
    this.slowPeriod = params.slowPeriod ?? 20;
    this.rsiPeriod = params.rsiPeriod ?? 14;
    this.rsiOversold = params.rsiOversold ?? 35;
    this.useRsiExit = params.useRsiExit ?? true;
    this.strikeOffset = params.strikeOffset ?? 2;
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const fastEmaSeries = context.getIndicatorSeries('fastEma');
    const slowEmaSeries = context.getIndicatorSeries('slowEma');
    const rsiSeries = context.getIndicatorSeries('rsi');

    if (!fastEmaSeries || !slowEmaSeries || !rsiSeries) {
      return { action: 'idle' };
    }

    const fast = fastEmaSeries.at(index);
    const slow = slowEmaSeries.at(index);
    const prevFast = fastEmaSeries.at(index - 1);
    const prevSlow = slowEmaSeries.at(index - 1);
    const rsiVal = rsiSeries.at(index);

    if (
      fast === undefined || isNaN(fast) ||
      slow === undefined || isNaN(slow) ||
      prevFast === undefined || isNaN(prevFast) ||
      prevSlow === undefined || isNaN(prevSlow)
    ) {
      return { action: 'idle' };
    }

    // Exit conditions
    const shouldExitRsi = this.useRsiExit && rsiVal !== undefined && !isNaN(rsiVal) && rsiVal <= this.rsiOversold;
    const crossoverExit = prevFast <= prevSlow && fast > slow;

    if (shouldExitRsi || crossoverExit) {
      return { action: 'exit' };
    }

    // Entry condition (Short)
    const crossoverEntry = prevFast >= prevSlow && fast < slow;
    if (crossoverEntry) {
      return { action: 'entry', direction: 'short' };
    }

    return { action: 'idle' };
  }
}
