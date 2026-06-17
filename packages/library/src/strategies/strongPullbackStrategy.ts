import { BarSeries } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';

export interface StrongPullbackParams {
  emaPeriod?: number;
  dailyEmaPeriod?: number;
  rvolPeriod?: number;
  atrPeriod?: number;
  atrMultiplier?: number;
  rvolThreshold?: number;
  vwapDistanceAtrRatio?: number;
  tp1_R?: number;
  tp2_R?: number;
  tp1_pct?: number;
  direction?: 'long' | 'short' | 'both';
}

export class StrongPullbackStrategy implements Strategy {
  public readonly name: string;
  private readonly emaPeriod: number;
  private readonly dailyEmaPeriod: number;
  private readonly rvolPeriod: number;
  private readonly atrPeriod: number;
  private readonly atrMultiplier: number;
  private readonly rvolThreshold: number;
  private readonly vwapDistanceAtrRatio: number;
  private readonly tp1_R: number;
  private readonly tp2_R: number;
  private readonly direction: 'long' | 'short' | 'both';

  constructor(name = 'StrongPullback', params: StrongPullbackParams = {}) {
    this.name = name;
    this.emaPeriod = params.emaPeriod ?? 20;
    this.dailyEmaPeriod = params.dailyEmaPeriod ?? 50;
    this.rvolPeriod = params.rvolPeriod ?? 20;
    this.atrPeriod = params.atrPeriod ?? 14;
    this.atrMultiplier = params.atrMultiplier ?? 1.0;
    this.rvolThreshold = params.rvolThreshold ?? 1.2;
    this.vwapDistanceAtrRatio = params.vwapDistanceAtrRatio ?? 0.5;
    this.tp1_R = params.tp1_R ?? 1.0;
    this.tp2_R = params.tp2_R ?? 2.0;
    this.direction = params.direction ?? 'both';
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const stateBefore = this.getPositionStateBefore(series, index, context);

    if (stateBefore.status === 'idle') {
      // Evaluate entry condition on current bar (index)
      return this.evaluateEntry(series, index, context);
    } else {
      // Evaluate exit condition on current bar (index)
      return this.evaluateExit(series, index, stateBefore as any);
    }
  }

  private evaluateEntry(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    const currentBar = series.at(index)!;
    const prevBar = series.at(index - 1)!;

    const ema20Series = context.getIndicatorSeries('ema20');
    const vwapSeries = context.getIndicatorSeries('vwap');
    const rvolSeries = context.getIndicatorSeries('rvol');
    const atrSeries = context.getIndicatorSeries('atr');
    const dailyEma50Series = context.getIndicatorSeries('dailyEma50');
    const dailySeries = context.getSecondaryBarSeries('daily');

    if (!ema20Series || !vwapSeries || !rvolSeries || !atrSeries || !dailyEma50Series || !dailySeries) {
      return { action: 'idle' };
    }

    const ema20 = ema20Series.at(index);
    const vwap = vwapSeries.at(index);
    const rvol = rvolSeries.at(index);
    const atr = atrSeries.at(index);

    const prevEma20 = ema20Series.at(index - 1);

    if (
      ema20 === undefined || isNaN(ema20) ||
      vwap === undefined || isNaN(vwap) ||
      rvol === undefined || isNaN(rvol) ||
      atr === undefined || isNaN(atr) ||
      prevEma20 === undefined || isNaN(prevEma20)
    ) {
      return { action: 'idle' };
    }

    // Get Lookahead-Free Daily Quote
    const dailyIndex = this.getDailyIndexBefore(dailySeries, currentBar.timestamp);
    if (dailyIndex === -1) {
      return { action: 'idle' };
    }

    const dailyBar = dailySeries.at(dailyIndex)!;
    const dailyEma50 = dailyEma50Series.at(dailyIndex);

    if (dailyEma50 === undefined || isNaN(dailyEma50)) {
      return { action: 'idle' };
    }

    const canLong = this.direction === 'long' || this.direction === 'both';
    const canShort = this.direction === 'short' || this.direction === 'both';

    // Long entry conditions
    const dailyLongTrend = dailyBar.close > dailyEma50;
    const intradayLongTrend = currentBar.close > vwap && ema20 > vwap;
    const longVolumeSpike = rvol > this.rvolThreshold;
    const longVwapDistance = Math.abs(currentBar.close - vwap) <= this.vwapDistanceAtrRatio * atr;
    const longCrossover = prevBar.close <= prevEma20 && currentBar.close > ema20;

    if (canLong && dailyLongTrend && intradayLongTrend && longVolumeSpike && longVwapDistance && longCrossover) {
      return { action: 'entry', direction: 'long' };
    }

    // Short entry conditions
    const dailyShortTrend = dailyBar.close < dailyEma50;
    const intradayShortTrend = currentBar.close < vwap && ema20 < vwap;
    const shortVolumeSpike = rvol > this.rvolThreshold;
    const shortVwapDistance = Math.abs(currentBar.close - vwap) <= this.vwapDistanceAtrRatio * atr;
    const shortCrossover = prevBar.close >= prevEma20 && currentBar.close < ema20;

    if (canShort && dailyShortTrend && intradayShortTrend && shortVolumeSpike && shortVwapDistance && shortCrossover) {
      return { action: 'entry', direction: 'short' };
    }

    return { action: 'idle' };
  }

  private evaluateExit(
    series: BarSeries,
    index: number,
    state: { status: 'long' | 'short'; entryPrice: number; entryAtr: number; tp1Reached: boolean }
  ): TradeSignal {
    const currentBar = series.at(index)!;

    const stopLoss = state.status === 'long'
      ? state.entryPrice - state.entryAtr * this.atrMultiplier
      : state.entryPrice + state.entryAtr * this.atrMultiplier;

    const tp1 = state.status === 'long'
      ? state.entryPrice + state.entryAtr * this.atrMultiplier * this.tp1_R
      : state.entryPrice - state.entryAtr * this.atrMultiplier * this.tp1_R;

    if (state.status === 'long') {
      if (currentBar.close <= stopLoss) {
        return { action: 'exit' };
      }
      if (currentBar.close >= tp1) {
        return { action: 'exit' };
      }
    } else {
      if (currentBar.close >= stopLoss) {
        return { action: 'exit' };
      }
      if (currentBar.close <= tp1) {
        return { action: 'exit' };
      }
    }

    return { action: 'idle' };
  }

  private getPositionStateBefore(
    series: BarSeries,
    index: number,
    context: StrategyContext
  ): { status: 'idle' | 'long' | 'short'; entryPrice: number; entryAtr: number; tp1Reached: boolean } {
    let status: 'idle' | 'long' | 'short' = 'idle';
    let entryPrice = 0;
    let entryAtr = 0;
    let tp1Reached = false;

    // Simulate from index 0 to index - 1
    for (let i = 0; i < index; i++) {
      const bar = series.at(i)!;
      if (status === 'idle') {
        const signal = this.evaluateEntry(series, i, context);
        if (signal.action === 'entry') {
          status = signal.direction === 'short' ? 'short' : 'long';
          entryPrice = bar.close;
          const atrSeries = context.getIndicatorSeries('atr');
          entryAtr = atrSeries?.at(i) ?? 0;
          tp1Reached = false;
        }
      } else {
        // Evaluate exit
        const stopLoss = status === 'long'
          ? entryPrice - entryAtr * this.atrMultiplier
          : entryPrice + entryAtr * this.atrMultiplier;

        const tp1 = status === 'long'
          ? entryPrice + entryAtr * this.atrMultiplier * this.tp1_R
          : entryPrice - entryAtr * this.atrMultiplier * this.tp1_R;

        let shouldExit = false;
        if (status === 'long') {
          if (bar.close <= stopLoss || bar.close >= tp1) {
            shouldExit = true;
          }
        } else {
          if (bar.close >= stopLoss || bar.close <= tp1) {
            shouldExit = true;
          }
        }

        if (shouldExit) {
          status = 'idle';
        }
      }
    }

    return { status, entryPrice, entryAtr, tp1Reached };
  }

  private getDailyIndexBefore(dailySeries: BarSeries, timestamp: number): number {
    let low = 0;
    let high = dailySeries.length - 1;
    let resultIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midBar = dailySeries.at(mid);
      if (midBar && midBar.timestamp < timestamp) {
        resultIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return resultIndex;
  }
}
