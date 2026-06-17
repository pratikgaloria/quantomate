import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';
import { Series } from '@quantomate/core';

export interface IndexOptionRsiReversionParams {
  rsiPeriod?: number;
  oversoldThreshold?: number;
  overboughtThreshold?: number;
}

export class IndexOptionRsiReversionStrategy implements Strategy {
  public readonly name: string;
  private readonly rsiPeriod: number;
  private readonly oversoldThreshold: number;
  private readonly overboughtThreshold: number;

  constructor(name = 'IndexOptionRsiReversion', params: IndexOptionRsiReversionParams = {}) {
    this.name = name;
    this.rsiPeriod = params.rsiPeriod ?? 14;
    this.oversoldThreshold = params.oversoldThreshold ?? 30;
    this.overboughtThreshold = params.overboughtThreshold ?? 70;
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    const rsiSeries = context.getIndicatorSeries('rsi');
    if (!rsiSeries) {
      return { action: 'idle' };
    }

    const rsiVal = rsiSeries.at(index);
    if (rsiVal === undefined || isNaN(rsiVal)) {
      return { action: 'idle' };
    }

    const bias = this.getBias(rsiSeries, index);

    if (bias === 'long') {
      if (rsiVal >= 50) {
        return { action: 'exit' };
      }
      if (rsiVal < this.oversoldThreshold) {
        return { action: 'entry', direction: 'long' };
      }
    } else if (bias === 'short') {
      if (rsiVal <= 50) {
        return { action: 'exit' };
      }
      if (rsiVal > this.overboughtThreshold) {
        return { action: 'entry', direction: 'short' };
      }
    }

    return { action: 'idle' };
  }

  private getBias(rsiSeries: Series<number>, index: number): 'long' | 'short' | 'neutral' {
    for (let j = index; j >= 0; j--) {
      const val = rsiSeries.at(j);
      if (val !== undefined && !isNaN(val)) {
        if (val < this.oversoldThreshold) {
          return 'long';
        }
        if (val > this.overboughtThreshold) {
          return 'short';
        }
      }
    }
    return 'neutral';
  }
}
