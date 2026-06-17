import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface ChandelierTrendOptionParams {
  period?: number;
  multiplier?: number;
  rvolThreshold?: number;
}

export class ChandelierTrendOptionStrategy implements Strategy {
  public readonly name: string;
  private readonly period: number;
  private readonly multiplier: number;
  private readonly rvolThreshold: number;

  constructor(name = 'ChandelierTrendOption', params: ChandelierTrendOptionParams = {}) {
    this.name = name;
    this.period = params.period ?? 22;
    this.multiplier = params.multiplier ?? 3.0;
    this.rvolThreshold = params.rvolThreshold ?? 2.0;
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const currentBar = series.at(index)!;
    const prevBar = series.at(index - 1)!;

    const chanLongSeries = context.getIndicatorSeries('chandelierLong');
    const chanShortSeries = context.getIndicatorSeries('chandelierShort');
    const rvolSeries = context.getIndicatorSeries('rvol');

    if (!chanLongSeries || !chanShortSeries || !rvolSeries) {
      return { action: 'idle' };
    }

    const chanLong = chanLongSeries.at(index);
    const chanShort = chanShortSeries.at(index);
    const rvolVal = rvolSeries.at(index);

    const prevChanLong = chanLongSeries.at(index - 1);
    const prevChanShort = chanShortSeries.at(index - 1);

    if (
      chanLong === undefined || isNaN(chanLong) ||
      chanShort === undefined || isNaN(chanShort) ||
      rvolVal === undefined || isNaN(rvolVal) ||
      prevChanLong === undefined || isNaN(prevChanLong) ||
      prevChanShort === undefined || isNaN(prevChanShort)
    ) {
      return { action: 'idle' };
    }

    // Long triggers
    const entryLong = prevBar.close <= prevChanShort && currentBar.close > chanShort && rvolVal >= this.rvolThreshold;
    const exitLong = currentBar.close < chanLong;

    // Short triggers
    const entryShort = prevBar.close >= prevChanLong && currentBar.close < chanLong && rvolVal >= this.rvolThreshold;
    const exitShort = currentBar.close > chanShort;

    if (entryLong) {
      return { action: 'entry', direction: 'long' };
    }
    if (entryShort) {
      return { action: 'entry', direction: 'short' };
    }
    if (exitLong || exitShort) {
      return { action: 'exit' };
    }

    return { action: 'idle' };
  }
}
