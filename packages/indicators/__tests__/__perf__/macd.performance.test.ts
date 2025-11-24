import { Dataset } from '@quantomate/core';
import { MACD } from '../../src';

describe('MACD Performance Tests', () => {
  const createTestData = (size: number): number[] => {
    return Array.from({ length: size }, (_, i) => 50 + Math.random() * 10);
  };

  describe('spread() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should spread MACD over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const macd = new MACD<number>('macd', {});

        console.time(`MACD spread() - ${size} items`);
        macd.spread(dataset);
        console.timeEnd(`MACD spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('macd');
        // MACD might be 0 or NaN if dataset is too small
        if (size > 26) {
          expect(lastValue).toBeDefined();
          expect(typeof lastValue).toBe('number');
        }
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate MACD on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const macd = new MACD<number>('macd', {});

        console.time(`MACD calculate() - ${size} items`);
        const result = macd.calculate(dataset);
        console.timeEnd(`MACD calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        // MACD might return 0 or NaN if dataset is too small
        if (size > 26) {
          expect(isNaN(result)).toBe(false);
        }
      });
    });
  });

  describe('MACD with object-based data performance', () => {
    it('Should handle object-based quotes efficiently', () => {
      const size = 1000;
      const data = Array.from({ length: size }, (_, i) => ({
        close: 50 + Math.random() * 10,
        high: 55 + Math.random() * 10,
        low: 45 + Math.random() * 10,
      }));
      const dataset = new Dataset<{ close: number; high: number; low: number }>(data);
      const macd = new MACD<{ close: number; high: number; low: number }>('macd', {
        attribute: 'close',
      });

      console.time(`MACD spread() - ${size} object-based items`);
      macd.spread(dataset);
      console.timeEnd(`MACD spread() - ${size} object-based items`);

      // Verify correctness
      const lastValue = dataset.quotes[size - 1].getIndicator('macd');
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      // MACD should have valid value for large datasets
      if (size > 26) {
        expect(isNaN(lastValue)).toBe(false);
      }
    });
  });

  describe('MACD dependency performance', () => {
    it('Should efficiently handle MACD which depends on EMA12 and EMA26', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);
      const macd = new MACD<number>('macd', {});

      console.time(`MACD spread() with dependencies - ${size} items`);
      macd.spread(dataset);
      console.timeEnd(`MACD spread() with dependencies - ${size} items`);

      // Verify that dependencies are calculated
      expect(dataset.quotes[size - 1].getIndicator('ema12')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('ema26')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('macd')).toBeDefined();

      // Verify MACD is EMA12 - EMA26
      const ema12 = dataset.quotes[size - 1].getIndicator('ema12');
      const ema26 = dataset.quotes[size - 1].getIndicator('ema26');
      const macdValue = dataset.quotes[size - 1].getIndicator('macd');
      if (!isNaN(ema12) && !isNaN(ema26)) {
        expect(macdValue).toBeCloseTo(ema12 - ema26, 5);
      }
    });
  });
});

