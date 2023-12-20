import { Dataset } from '@quantomate/core';
import { RSI } from '../src';

describe('SMA should return the correct value', () => {
  // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:relative_strength_index_rsi
  const data = [
    44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.42, 45.84, 46.08, 45.89,
    46.03, 45.61, 46.28, 46.28, 46.0, 46.03,
  ];
  const name = 'rsi14';
  const period = 14;
  const rsi14 = new RSI(name, { period });

  it('When dataset is less than period.', () => {
    expect(rsi14.calculate(new Dataset(data.slice(0, period - 1)))).toBeNaN();
  });

  it('When dataset is equal to period.', () => {
    expect(rsi14.calculate(new Dataset(data.slice(0, period)))).toBeNaN();
  });

  it('When dataset more than period.', () => {
    expect(rsi14.calculate(new Dataset(data)).toFixed(2)).toBe('66.48');
  });

  it('When spreaded over the dataset.', () => {
    const ds = new Dataset(data);
    rsi14.spread(ds);

    expect(ds.at(-1).getIndicator(name).toFixed(2)).toBe('66.48');
  });
});
