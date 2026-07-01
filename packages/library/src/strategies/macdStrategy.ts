import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface MacdStrategyParams {
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  direction?: 'long' | 'short' | 'both';
}

export class MACDStrategy implements Strategy {
  public readonly name: string;
  private readonly fastPeriod: number;
  private readonly slowPeriod: number;
  private readonly signalPeriod: number;
  private readonly direction: 'long' | 'short' | 'both';

  constructor(name = 'MACD', params: MacdStrategyParams = {}) {
    this.name = name;
    this.fastPeriod = params.fastPeriod ?? 12;
    this.slowPeriod = params.slowPeriod ?? 26;
    this.signalPeriod = params.signalPeriod ?? 9;
    this.direction = params.direction ?? 'both';
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const macdSeries = context.getIndicatorSeries('macd');
    const signalSeries = context.getIndicatorSeries('macdSignal');

    if (!macdSeries || !signalSeries) {
      return { action: 'idle' };
    }

    const macdVal = macdSeries.at(index);
    const sigVal = signalSeries.at(index);
    const prevMacd = macdSeries.at(index - 1);
    const prevSig = signalSeries.at(index - 1);

    if (
      macdVal === undefined || isNaN(macdVal) ||
      sigVal === undefined || isNaN(sigVal) ||
      prevMacd === undefined || isNaN(prevMacd) ||
      prevSig === undefined || isNaN(prevSig)
    ) {
      return { action: 'idle' };
    }

    const positionStatus = context.getPositionStatus?.() ?? 'idle';
    const canLong = this.direction === 'long' || this.direction === 'both';
    const canShort = this.direction === 'short' || this.direction === 'both';

    const entryLong = prevMacd <= prevSig && macdVal > sigVal;
    const exitLong = prevMacd >= prevSig && macdVal < sigVal;

    const entryShort = prevMacd >= prevSig && macdVal < sigVal;
    const exitShort = prevMacd <= prevSig && macdVal > sigVal;

    if (positionStatus === 'idle') {
      if (canLong && entryLong) {
        return { action: 'entry', direction: 'long' };
      }
      if (canShort && entryShort) {
        return { action: 'entry', direction: 'short' };
      }
    } else {
      const isLong = positionStatus === 'long';
      if (isLong && exitLong) {
        return { action: 'exit' };
      }
      if (!isLong && exitShort) {
        return { action: 'exit' };
      }
    }

    return { action: 'idle' };
  }
}
