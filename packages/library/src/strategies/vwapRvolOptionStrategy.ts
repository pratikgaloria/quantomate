import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface VwapRvolOptionParams {
  rvolThreshold?: number;
}

export class VwapRvolOptionStrategy implements Strategy {
  public readonly name: string;
  private readonly rvolThreshold: number;

  constructor(name = 'VwapRvolOption', params: VwapRvolOptionParams = {}) {
    this.name = name;
    this.rvolThreshold = params.rvolThreshold ?? 2.0;
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const currentBar = series.at(index)!;
    const prevBar = series.at(index - 1)!;

    const vwapSeries = context.getIndicatorSeries('vwap');
    const rvolSeries = context.getIndicatorSeries('rvol');

    if (!vwapSeries || !rvolSeries) {
      return { action: 'idle' };
    }

    const vwapVal = vwapSeries.at(index);
    const rvolVal = rvolSeries.at(index);
    const prevVwap = vwapSeries.at(index - 1);

    if (
      vwapVal === undefined || isNaN(vwapVal) ||
      rvolVal === undefined || isNaN(rvolVal) ||
      prevVwap === undefined || isNaN(prevVwap)
    ) {
      return { action: 'idle' };
    }

    // Long triggers
    const entryLong = prevBar.close <= prevVwap && currentBar.close > vwapVal && rvolVal >= this.rvolThreshold;
    const exitLong = currentBar.close < vwapVal;

    // Short triggers
    const entryShort = prevBar.close >= prevVwap && currentBar.close < vwapVal && rvolVal >= this.rvolThreshold;
    const exitShort = currentBar.close > vwapVal;

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
