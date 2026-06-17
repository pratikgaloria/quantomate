import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface RsiMeanReversionParams {
  rsiPeriod?: number;
  oversoldThreshold?: number;
  overboughtThreshold?: number;
  smaPeriod?: number;
  useTrendFilter?: boolean;
  direction?: 'long' | 'short' | 'both';
}

export class RSIMeanReversionStrategy implements Strategy {
  public readonly name: string;
  private readonly rsiPeriod: number;
  private readonly oversoldThreshold: number;
  private readonly overboughtThreshold: number;
  private readonly smaPeriod: number;
  private readonly useTrendFilter: boolean;
  private readonly direction: 'long' | 'short' | 'both';

  constructor(name = 'RSIMeanReversion', params: RsiMeanReversionParams = {}) {
    this.name = name;
    this.rsiPeriod = params.rsiPeriod ?? 14;
    this.oversoldThreshold = params.oversoldThreshold ?? 30;
    this.overboughtThreshold = params.overboughtThreshold ?? 70;
    this.smaPeriod = params.smaPeriod ?? 50;
    this.useTrendFilter = params.useTrendFilter ?? false;
    this.direction = params.direction ?? 'both';
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    const currentBar = series.at(index)!;

    const rsiSeries = context.getIndicatorSeries('rsi');
    const smaSeries = context.getIndicatorSeries('sma');

    if (!rsiSeries) {
      return { action: 'idle' };
    }

    const rsiVal = rsiSeries.at(index);
    if (rsiVal === undefined || isNaN(rsiVal)) {
      return { action: 'idle' };
    }

    let isUptrend = true;
    let isDowntrend = true;

    if (this.useTrendFilter) {
      if (!smaSeries) {
        return { action: 'idle' };
      }
      const smaVal = smaSeries.at(index);
      if (smaVal === undefined || isNaN(smaVal)) {
        return { action: 'idle' };
      }
      isUptrend = currentBar.close > smaVal;
      isDowntrend = currentBar.close < smaVal;
    }

    const canLong = this.direction === 'long' || this.direction === 'both';
    const canShort = this.direction === 'short' || this.direction === 'both';

    const entryLong = rsiVal < this.oversoldThreshold && isUptrend;
    const exitLong = rsiVal >= this.overboughtThreshold;

    const entryShort = rsiVal > this.overboughtThreshold && isDowntrend;
    const exitShort = rsiVal <= this.oversoldThreshold;

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
