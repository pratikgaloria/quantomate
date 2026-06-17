import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface LongStrangleParams {
  rsiPeriod?: number;
  lowerThreshold?: number;
  upperThreshold?: number;
  strikeOffset?: number;
}

export class LongStrangleStrategy implements Strategy {
  public readonly name: string;
  private readonly rsiPeriod: number;
  private readonly lowerThreshold: number;
  private readonly upperThreshold: number;
  public readonly strikeOffset: number;

  constructor(name = 'LongStrangle', params: LongStrangleParams = {}) {
    this.name = name;
    this.rsiPeriod = params.rsiPeriod ?? 14;
    this.lowerThreshold = params.lowerThreshold ?? 35;
    this.upperThreshold = params.upperThreshold ?? 65;
    this.strikeOffset = params.strikeOffset ?? 2;
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

    // Exit when volatility cools down (RSI returns to balanced zone 45-55)
    if (rsiVal >= 45 && rsiVal <= 55) {
      return { action: 'exit' };
    }

    // Enter on volatility/trend breakout (RSI outside middle band 35-65)
    if (rsiVal < this.lowerThreshold || rsiVal > this.upperThreshold) {
      return { action: 'entry', direction: 'long' };
    }

    return { action: 'idle' };
  }
}
