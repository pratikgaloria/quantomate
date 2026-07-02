import { BarSeries, Series } from '@quantomate/core';
import { Strategy, StrategyContext } from '@quantomate/core';
import { TradeSignal } from '@quantomate/core';
import { PIVOT_TREND_UP, PIVOT_TREND_DOWN } from '../indicators/pivotTrend';

export interface PivotTrendParams {
  direction?: 'long' | 'short' | 'both';
  useTrendFilter?: boolean;
  trendFilterInterval?: '1d' | '1wk';
  stopLossType?: 'none' | 'fixed-atr' | 'trailing-atr' | 'pivot';
  atrPeriod?: number;
  stopLossMultiplier?: number;
  continuousTrend?: boolean;
}

export class PivotTrendStrategy implements Strategy {
  public readonly name: string;
  private readonly direction: 'long' | 'short' | 'both';
  private readonly useTrendFilter: boolean;
  private readonly trendFilterInterval: '1d' | '1wk';
  private readonly stopLossType: 'none' | 'fixed-atr' | 'trailing-atr' | 'pivot';
  private readonly atrPeriod: number;
  private readonly stopLossMultiplier: number;
  private readonly continuousTrend: boolean;

  constructor(name = 'PivotTrend', params: PivotTrendParams = {}) {
    this.name = name;
    this.direction = params.direction ?? 'both';
    this.useTrendFilter = params.useTrendFilter ?? false;
    this.trendFilterInterval = params.trendFilterInterval ?? '1d';
    this.stopLossType = params.stopLossType ?? 'none';
    this.atrPeriod = params.atrPeriod ?? 14;
    this.stopLossMultiplier = params.stopLossMultiplier ?? 2.0;
    this.continuousTrend = params.continuousTrend ?? false;
  }

  getRequiredSecondaryIntervals(baseInterval: string): string[] {
    if (this.useTrendFilter && this.trendFilterInterval && baseInterval !== this.trendFilterInterval) {
      return [this.trendFilterInterval];
    }
    return [];
  }

  private resolveTrend(trendSeries: Series<number> | undefined, index: number): number | undefined {
    if (!trendSeries) return undefined;
    const trend = trendSeries.at(index);
    if (!this.continuousTrend) {
      return trend;
    }
    // Backward scan to find the first non-zero, non-NaN trend
    for (let i = index; i >= 0; i--) {
      const val = trendSeries.at(i);
      if (val !== undefined && !isNaN(val) && val !== 0) {
        return val;
      }
    }
    return 0; // Neutral fallback if no active trend found yet
  }

  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    if (index < 1) {
      return { action: 'idle' };
    }

    const position = context.getPosition?.() ?? { status: 'idle' };

    if (position.status === 'idle') {
      const signal = this.evaluateEntry(series, index, context);
      if (signal.action === 'entry') {
        const atrSeries = context.getIndicatorSeries('atr');
        const entryAtr = atrSeries?.at(index) ?? 0;
        signal.metadata = {
          entryAtr,
          entryIndex: index,
        };
      }
      return signal;
    } else {
      const currentBar = series.at(index)!;
      const metadata = position.metadata || {};
      const entryPrice = position.entryPrice ?? currentBar.close;
      const entryAtr = metadata.entryAtr ?? 0;
      const entryIndex = metadata.entryIndex ?? index;

      const atrSeries = context.getIndicatorSeries('atr');
      const currentAtr = atrSeries?.at(index) ?? entryAtr;

      let highestPriceSinceEntry = currentBar.high;
      let lowestPriceSinceEntry = currentBar.low;
      for (let j = entryIndex; j <= index; j++) {
        const b = series.at(j)!;
        highestPriceSinceEntry = Math.max(highestPriceSinceEntry, b.high);
        lowestPriceSinceEntry = Math.min(lowestPriceSinceEntry, b.low);
      }

      const shouldExitSL = this.checkStopLoss(
        position.status as 'long' | 'short',
        currentBar,
        entryPrice,
        entryAtr,
        currentAtr,
        highestPriceSinceEntry,
        lowestPriceSinceEntry,
        entryIndex,
        series
      );

      if (shouldExitSL) {
        return { action: 'exit' };
      }

      const trendSeries = context.getIndicatorSeries('pivotTrend');
      const trend = this.resolveTrend(trendSeries, index);
      if (trend !== undefined && !isNaN(trend)) {
        const isLong = position.status === 'long';
        if (isLong && trend === PIVOT_TREND_DOWN) {
          return { action: 'exit' };
        }
        if (!isLong && trend === PIVOT_TREND_UP) {
          return { action: 'exit' };
        }
      }
    }

    return { action: 'idle' };
  }

  private evaluateEntry(series: BarSeries, index: number, context: StrategyContext): TradeSignal {
    const trendSeries = context.getIndicatorSeries('pivotTrend');
    if (!trendSeries) {
      return { action: 'idle' };
    }

    const trend = this.resolveTrend(trendSeries, index);
    if (trend === undefined || isNaN(trend)) {
      return { action: 'idle' };
    }

    let canLong = this.direction === 'long' || this.direction === 'both';
    let canShort = this.direction === 'short' || this.direction === 'both';

    if (this.useTrendFilter) {
      const dailySeries = context.getSecondaryBarSeries('daily');
      const dailyTrendSeries = context.getIndicatorSeries('dailyPivotTrend');

      if (!dailySeries || !dailyTrendSeries) {
        return { action: 'idle' };
      }

      const currentBar = series.at(index)!;
      const dailyIndex = this.getSecondaryIndexBefore(dailySeries, currentBar.timestamp, this.trendFilterInterval);
      if (dailyIndex === -1) {
        return { action: 'idle' };
      }

      const dailyTrend = this.resolveTrend(dailyTrendSeries, dailyIndex);
      if (dailyTrend === undefined || isNaN(dailyTrend)) {
        return { action: 'idle' };
      }

      canLong = canLong && dailyTrend === PIVOT_TREND_UP;
      canShort = canShort && dailyTrend === PIVOT_TREND_DOWN;
    }

    if (canLong && trend === PIVOT_TREND_UP) {
      return { action: 'entry', direction: 'long' };
    }
    if (canShort && trend === PIVOT_TREND_DOWN) {
      return { action: 'entry', direction: 'short' };
    }

    return { action: 'idle' };
  }

  private checkStopLoss(
    status: 'long' | 'short',
    bar: { close: number; high: number; low: number },
    entryPrice: number,
    entryAtr: number,
    currentAtr: number,
    highestPriceSinceEntry: number,
    lowestPriceSinceEntry: number,
    entryIndex: number,
    series: BarSeries
  ): boolean {
    if (this.stopLossType === 'none') {
      return false;
    }

    if (this.stopLossType === 'fixed-atr') {
      const stopLoss = status === 'long'
        ? entryPrice - entryAtr * this.stopLossMultiplier
        : entryPrice + entryAtr * this.stopLossMultiplier;

      return status === 'long' ? bar.close <= stopLoss : bar.close >= stopLoss;
    }

    if (this.stopLossType === 'trailing-atr') {
      const stopLoss = status === 'long'
        ? highestPriceSinceEntry - currentAtr * this.stopLossMultiplier
        : lowestPriceSinceEntry + currentAtr * this.stopLossMultiplier;

      return status === 'long' ? bar.close <= stopLoss : bar.close >= stopLoss;
    }

    if (this.stopLossType === 'pivot') {
      if (entryIndex <= 0) return false;
      const prevBar = series.at(entryIndex - 1)!;
      const pivot = (prevBar.high + prevBar.low + prevBar.close) / 3;
      
      const stopLoss = status === 'long'
        ? 2 * pivot - prevBar.high
        : 2 * pivot - prevBar.low;

      return status === 'long' ? bar.close <= stopLoss : bar.close >= stopLoss;
    }

    return false;
  }

  private getSecondaryIndexBefore(
    series: BarSeries,
    timestamp: number,
    interval: '1d' | '1wk'
  ): number {
    let low = 0;
    let high = series.length - 1;
    let resultIndex = -1;

    const toUtcDateStr = (ts: number) => {
      return new Date(ts).toISOString().split('T')[0];
    };

    const getWeekStartTimestamp = (ts: number) => {
      const d = new Date(ts);
      const day = d.getUTCDay();
      const diff = d.getUTCDate() - day;
      const sunday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
      return sunday.getTime();
    };

    const currentUtcDateStr = toUtcDateStr(timestamp);
    const currentWeekStart = getWeekStartTimestamp(timestamp);

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midBar = series.at(mid);
      if (!midBar) {
        high = mid - 1;
        continue;
      }

      let isBefore = false;
      if (interval === '1d') {
        isBefore = toUtcDateStr(midBar.timestamp) < currentUtcDateStr;
      } else {
        isBefore = getWeekStartTimestamp(midBar.timestamp) < currentWeekStart;
      }

      if (isBefore) {
        resultIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return resultIndex;
  }
}
