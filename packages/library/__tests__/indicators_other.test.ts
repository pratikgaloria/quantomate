import * as fs from 'fs';
import * as path from 'path';
import { BarSeries } from '@quantomate/core';
import { BB, CCI, WilliamsR, ROC, MOM, Slope, VWAP } from '../src/indicators';

describe('Indicator Regression Tests - Other', () => {
  let series: BarSeries;

  beforeAll(() => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sp500.json'), 'utf-8'));
    series = new BarSeries(data);
  });

  test('BB calculates correctly', () => {
    const bbUpper = new BB('BBUpper', { period: 20, multiplier: 2, band: 'upper' }).calculate(series);
    const bbMiddle = new BB('BBMiddle', { period: 20, multiplier: 2, band: 'middle' }).calculate(series);
    const bbLower = new BB('BBLower', { period: 20, multiplier: 2, band: 'lower' }).calculate(series);

    expect(bbUpper.length).toBe(1002);
    expect(bbUpper.at(-1)).toBeCloseTo(6959.002510031039, 4);
    expect(bbUpper.at(500)).toBeCloseTo(4847.353644999925, 4);

    expect(bbMiddle.length).toBe(1002);
    expect(bbMiddle.at(-1)).toBeCloseTo(6855.4215087890625, 4);

    expect(bbLower.length).toBe(1002);
    expect(bbLower.at(-1)).toBeCloseTo(6751.840507547086, 4);
  });

  test('CCI calculates correctly', () => {
    const cci = new CCI('CCI', { period: 20 }).calculate(series);
    expect(cci.length).toBe(1002);
    expect(cci.at(-1)).toBeCloseTo(84.74156818265779, 4);
    expect(cci.at(500)).toBeCloseTo(77.52930002546798, 4);
  });

  test('WilliamsR calculates correctly', () => {
    const williams = new WilliamsR('WilliamsR', { period: 14 }).calculate(series);
    expect(williams.length).toBe(1002);
    expect(williams.at(-1)).toBeCloseTo(-21.98003883023905, 4);
  });

  test('ROC calculates correctly', () => {
    const roc = new ROC('ROC', { period: 14 }).calculate(series);
    expect(roc.length).toBe(1002);
    expect(roc.at(-1)).toBeCloseTo(0.8147122167715822, 4);
  });

  test('MOM calculates correctly', () => {
    const mom = new MOM('MOM', { period: 14 }).calculate(series);
    expect(mom.length).toBe(1002);
    expect(mom.at(-1)).toBeCloseTo(55.73046875, 4);
  });

  test('Slope calculates correctly', () => {
    const slope = new Slope('Slope', { period: 1 }).calculate(series);
    expect(slope.length).toBe(1002);
    expect(slope.at(-1)).toBeCloseTo(-9.5, 4);
  });

  test('VWAP calculates correctly on daily chart without matching close', () => {
    const vwap = new VWAP('VWAP').calculate(series);
    expect(vwap.length).toBe(1002);
    const lastClose = series.at(-1)!.close;
    expect(vwap.at(-1)).not.toBe(lastClose);
    expect(vwap.at(-1)).toBeCloseTo(5043.964680313397, 4);
  });
});
