import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface WeeklyAvwapOptionParams {
  volumeSmaPeriod?: number;
}

export class WeeklyAvwapOptionStrategy implements Strategy {
  public readonly name: string;
  private readonly volumeSmaPeriod: number;

  constructor(name = 'WeeklyAvwapOption', params: WeeklyAvwapOptionParams = {}) {
    this.name = name;
    this.volumeSmaPeriod = params.volumeSmaPeriod || 20;
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const currentBar = series.at(index)!;
    const prevBar = series.at(index - 1)!;

    const avwapSeries = context.getIndicatorSeries('weeklyAvwap');
    const volumeSmaSeries = context.getIndicatorSeries('volumeSma');

    if (!avwapSeries || !volumeSmaSeries) {
      return { action: 'idle' };
    }

    const avwapVal = avwapSeries.at(index);
    const volSmaVal = volumeSmaSeries.at(index);
    const prevAvwap = avwapSeries.at(index - 1);

    if (
      avwapVal === undefined || isNaN(avwapVal) ||
      volSmaVal === undefined || isNaN(volSmaVal) ||
      prevAvwap === undefined || isNaN(prevAvwap)
    ) {
      return { action: 'idle' };
    }

    // Long triggers
    const entryLong = prevBar.close <= prevAvwap && currentBar.close > avwapVal && currentBar.volume > volSmaVal;
    const exitLong = currentBar.close < avwapVal;

    // Short triggers
    const entryShort = prevBar.close >= prevAvwap && currentBar.close < avwapVal && currentBar.volume > volSmaVal;
    const exitShort = currentBar.close > avwapVal;

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
