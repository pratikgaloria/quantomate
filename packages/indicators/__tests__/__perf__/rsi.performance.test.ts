import { Dataset } from '@quantomate/core';
import { RSI } from '../../src';

describe('RSI Performance Tests', () => {
  const createTestData = (size: number): number[] => {
    return Array.from({ length: size }, (_, i) => 44 + Math.random() * 2);
  };

  describe('spread() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should spread RSI over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const rsi = new RSI('rsi14', { period: 14 });

        console.time(`RSI spread() - ${size} items`);
        rsi.spread(dataset);
        console.timeEnd(`RSI spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('rsi14');
        // RSI might be NaN if dataset is too small
        if (size > 14) {
          expect(lastValue).toBeDefined();
          expect(typeof lastValue).toBe('number');
          // RSI should be between 0 and 100
          if (!isNaN(lastValue)) {
            expect(lastValue).toBeGreaterThanOrEqual(0);
            expect(lastValue).toBeLessThanOrEqual(100);
          }
        }
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate RSI on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const rsi = new RSI('rsi14', { period: 14 });

        console.time(`RSI calculate() - ${size} items`);
        const result = rsi.calculate(dataset);
        console.timeEnd(`RSI calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        // RSI might return NaN if dataset is too small
        if (size > 14) {
          expect(isNaN(result)).toBe(false);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(100);
        }
      });
    });
  });

  describe('Multiple RSI indicators performance', () => {
    it('Should handle multiple RSI indicators efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);

      const rsi7 = new RSI('rsi7', { period: 7 });
      const rsi14 = new RSI('rsi14', { period: 14 });
      const rsi21 = new RSI('rsi21', { period: 21 });

      console.time(`Multiple RSI spread() - ${size} items (3 indicators)`);
      rsi7.spread(dataset);
      rsi14.spread(dataset);
      rsi21.spread(dataset);
      console.timeEnd(`Multiple RSI spread() - ${size} items (3 indicators)`);

      // Verify correctness
      expect(dataset.quotes[size - 1].getIndicator('rsi7')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('rsi14')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('rsi21')).toBeDefined();
    });
  });

  describe('RSI with object-based data performance', () => {
    it('Should handle object-based quotes efficiently', () => {
      const size = 1000;
      const data = Array.from({ length: size }, (_, i) => ({
        close: 44 + Math.random() * 2,
        high: 46 + Math.random() * 2,
        low: 42 + Math.random() * 2,
      }));
      const dataset = new Dataset<{ close: number; high: number; low: number }>(data);
      const rsi = new RSI<{ close: number; high: number; low: number }>('rsi14', {
        period: 14,
        attribute: 'close',
      });

      console.time(`RSI spread() - ${size} object-based items`);
      rsi.spread(dataset);
      console.timeEnd(`RSI spread() - ${size} object-based items`);

      // Verify correctness
      const lastValue = dataset.quotes[size - 1].getIndicator('rsi14');
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      if (!isNaN(lastValue)) {
        expect(lastValue).toBeGreaterThanOrEqual(0);
        expect(lastValue).toBeLessThanOrEqual(100);
      }
    });
  });
});

