import * as fs from 'fs';
import * as path from 'path';
import { BarSeries } from '@quantomate/core';
import { SMA, EMA, RSI, MACD, MACDSignal, PivotTrend, ATR } from '../src/indicators';

describe('Indicator Regression Tests - Core', () => {
  let series: BarSeries;

  beforeAll(() => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sp500.json'), 'utf-8'));
    series = new BarSeries(data);
  });

  test('SMA calculates correctly', () => {
    const sma = new SMA('SMA', { period: 14 }).calculate(series);
    expect(sma.length).toBe(1002);
    expect(sma.at(-1)).toBeCloseTo(6858.20002092634, 4);
    expect(sma.at(500)).toBeCloseTo(4730.72429547991, 4);
  });

  test('EMA calculates correctly', () => {
    const ema = new EMA('EMA', { period: 14 }).calculate(series);
    expect(ema.length).toBe(1002);
    expect(ema.at(-1)).toBeCloseTo(6866.578251589761, 4);
    expect(ema.at(500)).toBeCloseTo(4723.990368950041, 4);
  });

  test('RSI calculates correctly', () => {
    const rsi = new RSI('RSI', { period: 14 }).calculate(series);
    expect(rsi.length).toBe(1002);
    expect(rsi.at(-1)).toBeCloseTo(56.94189341659997, 4);
    expect(rsi.at(500)).toBeCloseTo(70.16487426374943, 4);
  });

  test('MACD & MACDSignal calculate correctly', () => {
    const macd = new MACD('MACD', { fastPeriod: 12, slowPeriod: 26 }).calculate(series);
    const macdSig = new MACDSignal('MACDSig', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }).calculate(series);
    expect(macd.length).toBe(1002);
    expect(macd.at(-1)).toBeCloseTo(35.12869098549345, 4);
    expect(macdSig.length).toBe(1002);
    expect(macdSig.at(-1)).toBeCloseTo(29.23527478706806, 4);
  });

  test('PivotTrend calculates correctly', () => {
    const pivot = new PivotTrend('PivotTrend').calculate(series);
    expect(pivot.length).toBe(1002);
    expect(pivot.at(-1)).toBe(0);
  });

  test('ATR calculates correctly', () => {
    const atr = new ATR('ATR', { period: 14 }).calculate(series);
    expect(atr.length).toBe(1002);
    expect(atr.at(-1)).toBeCloseTo(59.90853004217013, 4);
  });
});
