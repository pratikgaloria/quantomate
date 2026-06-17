import * as fs from 'fs';
import * as path from 'path';
import { BarSeries, Series } from '@quantomate/core';
import { SMA, RSI, MACD, MACDSignal, BB } from '../src/indicators';
import {
  GoldenCrossStrategy,
  RSIMeanReversionStrategy,
  MACDStrategy,
  BollingerBandsStrategy
} from '../src/strategies';

describe('Strategy Regression Tests', () => {
  let series: BarSeries;
  let indicators: Record<string, Series<number>> = {};
  let context: any;

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

    context = {
      getIndicatorSeries: (name: string) => indicators[name],
      getSecondaryBarSeries: () => undefined
    };
  });

  test('GoldenCrossStrategy evaluation', () => {
    const strategy = new GoldenCrossStrategy();
    expect(strategy.evaluate(series, 272, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 822, context)).toEqual({ action: 'entry', direction: 'short' });
    expect(strategy.evaluate(series, 875, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 100, context)).toEqual({ action: 'idle' });
  });

  test('RSIMeanReversionStrategy evaluation', () => {
    const strategy = new RSIMeanReversionStrategy('RsiReversion', { useTrendFilter: true });
    expect(strategy.evaluate(series, 153, context)).toEqual({ action: 'exit' });
    expect(strategy.evaluate(series, 154, context)).toEqual({ action: 'exit' });
    expect(strategy.evaluate(series, 155, context)).toEqual({ action: 'exit' });
  });

  test('MACDStrategy evaluation', () => {
    const strategy = new MACDStrategy();
    expect(strategy.evaluate(series, 40, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 43, context)).toEqual({ action: 'entry', direction: 'short' });
    expect(strategy.evaluate(series, 50, context)).toEqual({ action: 'entry', direction: 'long' });
  });

  test('BollingerBandsStrategy evaluation', () => {
    const strategy = new BollingerBandsStrategy();
    expect(strategy.evaluate(series, 35, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 76, context)).toEqual({ action: 'entry', direction: 'long' });
    expect(strategy.evaluate(series, 78, context)).toEqual({ action: 'entry', direction: 'long' });
  });
});
