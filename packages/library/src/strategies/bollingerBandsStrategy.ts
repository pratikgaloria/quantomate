import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface BollingerBandsParams {
  period?: number;
  multiplier?: number;
  direction?: 'long' | 'short' | 'both';
}

export class BollingerBandsStrategy implements Strategy {
  public readonly name: string;
  private readonly period: number;
  private readonly multiplier: number;
  private readonly direction: 'long' | 'short' | 'both';

  constructor(name = 'BollingerBands', params: BollingerBandsParams = {}) {
    this.name = name;
    this.period = params.period ?? 20;
    this.multiplier = params.multiplier ?? 2.0;
    this.direction = params.direction ?? 'both';
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const currentBar = series.at(index)!;
    const prevBar = series.at(index - 1)!;

    const bbUpperSeries = context.getIndicatorSeries('bbUpper');
    const bbLowerSeries = context.getIndicatorSeries('bbLower');

    if (!bbUpperSeries || !bbLowerSeries) {
      return { action: 'idle' };
    }

    const upperVal = bbUpperSeries.at(index);
    const lowerVal = bbLowerSeries.at(index);
    const prevUpper = bbUpperSeries.at(index - 1);
    const prevLower = bbLowerSeries.at(index - 1);

    if (
      upperVal === undefined || isNaN(upperVal) ||
      lowerVal === undefined || isNaN(lowerVal) ||
      prevUpper === undefined || isNaN(prevUpper) ||
      prevLower === undefined || isNaN(prevLower)
    ) {
      return { action: 'idle' };
    }

    const canLong = this.direction === 'long' || this.direction === 'both';
    const canShort = this.direction === 'short' || this.direction === 'both';

    const entryLong = prevBar.close >= prevLower && currentBar.close < lowerVal;
    const exitLong = prevBar.close <= prevUpper && currentBar.close > upperVal;

    const entryShort = prevBar.close <= prevUpper && currentBar.close > upperVal;
    const exitShort = prevBar.close >= prevLower && currentBar.close < lowerVal;

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
