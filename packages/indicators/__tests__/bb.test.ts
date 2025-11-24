import { Dataset } from '@quantomate/core';
import { BB } from '../src';

describe('BB (Bollinger Bands) should return the correct value', () => {
  // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:bollinger_bands
  const data = [
    22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15,
    22.39, 22.38, 22.61, 23.36, 24.05, 23.75, 23.83, 23.95, 23.63, 23.82, 23.87,
    23.65, 23.19, 23.10, 23.33, 22.68, 23.10, 22.40, 22.17,
  ];

  describe('Middle Band (SMA)', () => {
    const name = 'bb_middle';
    const period = 20;
    const bb = new BB(name, {
      period,
      multiplier: 2,
      band: 'middle',
    });

    it('When dataset length is less than period.', () => {
      const result = bb.calculate(new Dataset(data.slice(0, period - 1)));
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });

    it('When dataset length is equal to period.', () => {
      const result = bb.calculate(new Dataset(data.slice(0, period)));
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      // Should be close to SMA of first 20 values
      expect(result).toBeGreaterThan(22);
      expect(result).toBeLessThan(23);
    });

    it('When dataset length is more than period.', () => {
      const ds = new Dataset(data);
      const result = bb.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      // Middle band should be around 22.8-23.0 for this data
      expect(result).toBeGreaterThan(22);
      expect(result).toBeLessThan(24);
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      bb.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue)).toBe(false);
    });
  });

  describe('Upper Band', () => {
    const name = 'bb_upper';
    const period = 20;
    const bb = new BB(name, {
      period,
      multiplier: 2,
      band: 'upper',
    });

    it('Should return upper band value.', () => {
      const ds = new Dataset(data);
      const result = bb.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });

    it('Upper band should be greater than middle band.', () => {
      const ds = new Dataset(data);
      const middleBB = new BB('bb_middle', { period, multiplier: 2, band: 'middle' });
      const upperBB = new BB('bb_upper', { period, multiplier: 2, band: 'upper' });

      const middle = middleBB.calculate(ds);
      const upper = upperBB.calculate(ds);

      expect(upper).toBeGreaterThan(middle);
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      bb.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue)).toBe(false);
    });
  });

  describe('Lower Band', () => {
    const name = 'bb_lower';
    const period = 20;
    const bb = new BB(name, {
      period,
      multiplier: 2,
      band: 'lower',
    });

    it('Should return lower band value.', () => {
      const ds = new Dataset(data);
      const result = bb.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });

    it('Lower band should be less than middle band.', () => {
      const ds = new Dataset(data);
      const middleBB = new BB('bb_middle', { period, multiplier: 2, band: 'middle' });
      const lowerBB = new BB('bb_lower', { period, multiplier: 2, band: 'lower' });

      const middle = middleBB.calculate(ds);
      const lower = lowerBB.calculate(ds);

      expect(lower).toBeLessThan(middle);
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      bb.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue)).toBe(false);
    });
  });

  describe('Band relationships', () => {
    it('Upper band should be greater than middle, and middle should be greater than lower.', () => {
      const ds = new Dataset(data);
      const period = 20;
      const multiplier = 2;

      const upperBB = new BB('bb_upper', { period, multiplier, band: 'upper' });
      const middleBB = new BB('bb_middle', { period, multiplier, band: 'middle' });
      const lowerBB = new BB('bb_lower', { period, multiplier, band: 'lower' });

      const upper = upperBB.calculate(ds);
      const middle = middleBB.calculate(ds);
      const lower = lowerBB.calculate(ds);

      expect(upper).toBeGreaterThan(middle);
      expect(middle).toBeGreaterThan(lower);
      expect(upper - middle).toBeCloseTo(middle - lower, 2);
    });
  });

  describe('Custom parameters', () => {
    it('Should work with custom period.', () => {
      const ds = new Dataset(data);
      const bb = new BB('bb_custom', {
        period: 10,
        multiplier: 2,
        band: 'middle',
      });

      const result = bb.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });

    it('Should work with custom multiplier.', () => {
      const ds = new Dataset(data);
      const bb = new BB('bb_custom', {
        period: 20,
        multiplier: 1.5,
        band: 'upper',
      });

      const result = bb.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });
  });

  describe('Object-based data', () => {
    it('Should work with object-based quotes.', () => {
      const data = [
        { close: 22.27 },
        { close: 22.19 },
        { close: 22.08 },
        { close: 22.17 },
        { close: 22.18 },
        { close: 22.13 },
        { close: 22.23 },
        { close: 22.43 },
        { close: 22.24 },
        { close: 22.29 },
        { close: 22.15 },
        { close: 22.39 },
        { close: 22.38 },
        { close: 22.61 },
        { close: 23.36 },
        { close: 24.05 },
        { close: 23.75 },
        { close: 23.83 },
        { close: 23.95 },
        { close: 23.63 },
        { close: 23.82 },
        { close: 23.87 },
        { close: 23.65 },
        { close: 23.19 },
        { close: 23.10 },
        { close: 23.33 },
        { close: 22.68 },
        { close: 23.10 },
        { close: 22.40 },
        { close: 22.17 },
      ];

      const ds = new Dataset<{ close: number }>(data);
      const bb = new BB<{ close: number }>('bb_close', {
        period: 20,
        multiplier: 2,
        band: 'middle',
        attribute: 'close',
      });

      const result = bb.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });
  });
});

