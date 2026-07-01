import * as fs from 'fs';
import * as path from 'path';
import { BarSeries, Series } from '@quantomate/core';
import { SMA, RSI, MACD, MACDSignal, BB, PivotTrend, PIVOT_TREND_UP, PIVOT_TREND_DOWN } from '../src/indicators';
import {
  GoldenCrossStrategy,
  RSIMeanReversionStrategy,
  MACDStrategy,
  BollingerBandsStrategy,
  PivotTrendStrategy
} from '../src/strategies';

describe('Strategy Regression Tests', () => {
  let series: BarSeries;
  let indicators: Record<string, Series<number>> = {};
  let context: any;
  let currentStatus: 'idle' | 'long' | 'short' = 'idle';

  beforeAll(() => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sp500.json'), 'utf-8'));
    series = new BarSeries(data);

    // Compute indicators needed for strategies
    indicators['fastSma'] = new SMA('fastSma', { period: 50 }).calculate(series);
    indicators['slowSma'] = new SMA('slowSma', { period: 200 }).calculate(series);
    indicators['rsi'] = new RSI('rsi', { period: 14 }).calculate(series);
    indicators['sma'] = new SMA('sma', { period: 50 }).calculate(series);
    indicators['macd'] = new MACD('macd', { fastPeriod: 12, slowPeriod: 26 }).calculate(series);
    indicators['macdSignal'] = new MACDSignal('macdSignal', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }).calculate(series);
    indicators['bbUpper'] = new BB('bbUpper', { period: 20, multiplier: 2, band: 'upper' }).calculate(series);
    indicators['bbLower'] = new BB('bbLower', { period: 20, multiplier: 2, band: 'lower' }).calculate(series);
    indicators['pivotTrend'] = new PivotTrend('pivotTrend').calculate(series);

    context = {
      getIndicatorSeries: (name: string) => indicators[name],
      getSecondaryBarSeries: () => undefined,
      getPositionStatus: () => currentStatus,
      getPosition: () => ({
        status: currentStatus,
        entryPrice: 100,
        entryTime: 0,
        metadata: { entryAtr: 10, entryIndex: 2 }
      })
    };
  });

  test('GoldenCrossStrategy evaluation', () => {
    currentStatus = 'idle';
    const strategy = new GoldenCrossStrategy();
    expect(strategy.evaluate(series, 272, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 822, context)).toEqual({ action: 'entry', direction: 'short' });
    expect(strategy.evaluate(series, 875, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 100, context)).toEqual({ action: 'idle' });
  });

  test('RSIMeanReversionStrategy evaluation', () => {
    currentStatus = 'long';
    const strategy = new RSIMeanReversionStrategy('RsiReversion', { useTrendFilter: true });
    expect(strategy.evaluate(series, 153, context)).toEqual({ action: 'exit' });
    expect(strategy.evaluate(series, 154, context)).toEqual({ action: 'exit' });
    expect(strategy.evaluate(series, 155, context)).toEqual({ action: 'exit' });
  });

  test('MACDStrategy evaluation', () => {
    currentStatus = 'idle';
    const strategy = new MACDStrategy();
    expect(strategy.evaluate(series, 40, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 43, context)).toEqual({ action: 'entry', direction: 'short' });
    expect(strategy.evaluate(series, 50, context)).toEqual({ action: 'entry', direction: 'long' });
  });

  test('BollingerBandsStrategy evaluation', () => {
    currentStatus = 'idle';
    const strategy = new BollingerBandsStrategy();
    expect(strategy.evaluate(series, 35, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 76, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 78, context)).toEqual({ action: 'entry', direction: 'long' });
  });

  test('PivotTrendStrategy evaluation and status-awareness', () => {
    const strategy = new PivotTrendStrategy();
    
    // Entry signals when idle
    currentStatus = 'idle';
    expect(strategy.evaluate(series, 2, context)).toEqual({
      action: 'entry',
      direction: 'short',
      metadata: { entryAtr: 0, entryIndex: 2 }
    });
    expect(strategy.evaluate(series, 6, context)).toEqual({
      action: 'entry',
      direction: 'long',
      metadata: { entryAtr: 0, entryIndex: 6 }
    });

    // Exit signals when active (short)
    currentStatus = 'short';
    expect(strategy.evaluate(series, 6, context)).toEqual({ action: 'exit' });
    expect(strategy.evaluate(series, 2, context)).toEqual({ action: 'idle' });

    // Exit signals when active (long)
    currentStatus = 'long';
    expect(strategy.evaluate(series, 2, context)).toEqual({ action: 'exit' });
    expect(strategy.evaluate(series, 6, context)).toEqual({ action: 'idle' });
  });

  test('PivotTrendStrategy evaluation with trend filter', () => {
    const dailySeries = new BarSeries([
      { open: 100, high: 105, low: 95, close: 102, volume: 1000, timestamp: 0 },
      { open: 102, high: 110, low: 101, close: 109, volume: 1200, timestamp: 100000 },
    ]);
    const dailyTrend = new Series([PIVOT_TREND_DOWN, PIVOT_TREND_UP]);

    const localIndicators = { ...indicators };
    localIndicators['dailyPivotTrend'] = dailyTrend;

    const localContext = {
      getIndicatorSeries: (name: string) => localIndicators[name],
      getSecondaryBarSeries: (id: string) => {
        if (id === 'daily') return dailySeries;
        return undefined;
      },
      getPositionStatus: () => currentStatus,
      getPosition: () => ({
        status: currentStatus,
        entryPrice: 100,
        entryTime: 0,
        metadata: { entryAtr: 10, entryIndex: 2 }
      })
    };

    const strategy = new PivotTrendStrategy('PivotTrendFilter', {
      useTrendFilter: true,
      trendFilterInterval: '1d'
    });

    currentStatus = 'idle';
    
    // Create an intraday series with a timestamp in range (0, 100000)
    // This resolves to dailyIndex = 0 where dailyPivotTrend is DOWN (-1)
    const testIntradayBars = [
      ...series.toArray().slice(0, 6),
      { open: 100, high: 100, low: 100, close: 100, volume: 0, timestamp: 50000 }
    ];
    const testSeries = new BarSeries(testIntradayBars);

    // Force intraday index 6 pivotTrend to be UP (1)
    const originalIntradayTrend = indicators['pivotTrend'].toArray();
    localIndicators['pivotTrend'] = new Series([...originalIntradayTrend.slice(0, 6), PIVOT_TREND_UP]);

    // Long entry signal should be filtered since daily trend is DOWN
    const result = strategy.evaluate(testSeries, 6, localContext);
    expect(result).toEqual({ action: 'idle' });

    // When daily trend is UP (timestamp = 150000 -> dailyIndex = 1)
    const testSeriesUp = new BarSeries([
      ...series.toArray().slice(0, 6),
      { open: 100, high: 100, low: 100, close: 100, volume: 0, timestamp: 150000 }
    ]);
    const resultUp = strategy.evaluate(testSeriesUp, 6, localContext);
    expect(resultUp).toEqual({
      action: 'entry',
      direction: 'long',
      metadata: { entryAtr: 0, entryIndex: 6 }
    });
  });
});
