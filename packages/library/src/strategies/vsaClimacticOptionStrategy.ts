import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface VsaClimacticOptionParams {
  bbPeriod?: number;
  bbStdDev?: number;
  rvolThreshold?: number;
  bodyMultiplier?: number;
}

export class VsaClimacticOptionStrategy implements Strategy {
  public readonly name: string;
  private readonly bbPeriod: number;
  private readonly bbStdDev: number;
  private readonly rvolThreshold: number;
  private readonly bodyMultiplier: number;

  constructor(name = 'VsaClimacticOption', params: VsaClimacticOptionParams = {}) {
    this.name = name;
    this.bbPeriod = params.bbPeriod ?? 20;
    this.bbStdDev = params.bbStdDev ?? 2.0;
    this.rvolThreshold = params.rvolThreshold ?? 2.0;
    this.bodyMultiplier = params.bodyMultiplier ?? 0.8;
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    const currentBar = series.at(index)!;

    const bbUpperSeries = context.getIndicatorSeries('bbUpper');
    const bbMiddleSeries = context.getIndicatorSeries('bbMiddle');
    const bbLowerSeries = context.getIndicatorSeries('bbLower');
    const rvolSeries = context.getIndicatorSeries('rvol');

    if (!bbUpperSeries || !bbMiddleSeries || !bbLowerSeries || !rvolSeries) {
      return { action: 'idle' };
    }

    const upperBand = bbUpperSeries.at(index);
    const middleBand = bbMiddleSeries.at(index);
    const lowerBand = bbLowerSeries.at(index);
    const rvolVal = rvolSeries.at(index);

    if (
      upperBand === undefined || isNaN(upperBand) ||
      middleBand === undefined || isNaN(middleBand) ||
      lowerBand === undefined || isNaN(lowerBand) ||
      rvolVal === undefined || isNaN(rvolVal)
    ) {
      return { action: 'idle' };
    }

    if (index < this.bbPeriod - 1) {
      return { action: 'idle' };
    }
    
    let sumBody = 0;
    for (let j = index - this.bbPeriod + 1; j <= index; j++) {
      const b = series.at(j)!;
      sumBody += Math.abs(b.close - b.open);
    }
    const avgBody = sumBody / this.bbPeriod;
    const bodySize = Math.abs(currentBar.close - currentBar.open);

    // Long triggers
    const entryLong = currentBar.close <= lowerBand && rvolVal >= this.rvolThreshold && bodySize < this.bodyMultiplier * avgBody;
    const exitLong = currentBar.close >= middleBand;

    // Short triggers
    const entryShort = currentBar.close >= upperBand && rvolVal >= this.rvolThreshold && bodySize < this.bodyMultiplier * avgBody;
    const exitShort = currentBar.close <= middleBand;

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
