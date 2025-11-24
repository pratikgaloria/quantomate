import { Dataset } from '@quantomate/core';
import { EMA } from '../../src';

describe('EMA Performance Tests', () => {
  const createTestData = (size: number): number[] => {
    return Array.from({ length: size }, (_, i) => 22 + Math.random() * 2);
  };

  describe('spread() performance', () => {
    const sizes = [100, 500, 1000, 5000, 10000];

    sizes.forEach((size) => {
      it(`Should spread EMA over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const ema = new EMA('ema20', { period: 20 });

        console.time(`EMA spread() - ${size} items`);
        ema.spread(dataset);
        console.timeEnd(`EMA spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('ema20');
        expect(lastValue).toBeDefined();
        expect(typeof lastValue).toBe('number');
        expect(isNaN(lastValue)).toBe(false);
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate EMA on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const ema = new EMA('ema20', { period: 20 });

        console.time(`EMA calculate() - ${size} items`);
        const result = ema.calculate(dataset);
        console.timeEnd(`EMA calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        // EMA might return NaN if dataset is too small, but for large datasets it should be valid
        if (size >= 20) {
          expect(isNaN(result)).toBe(false);
        }
      });
    });
  });

  describe('Multiple EMA indicators performance', () => {
    it('Should handle multiple EMA indicators efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);

      const ema5 = new EMA('ema5', { period: 5 });
      const ema10 = new EMA('ema10', { period: 10 });
      const ema20 = new EMA('ema20', { period: 20 });
      const ema50 = new EMA('ema50', { period: 50 });

      console.time(`Multiple EMA spread() - ${size} items (4 indicators)`);
      ema5.spread(dataset);
      ema10.spread(dataset);
      ema20.spread(dataset);
      ema50.spread(dataset);
      console.timeEnd(`Multiple EMA spread() - ${size} items (4 indicators)`);

      // Verify correctness
      expect(dataset.quotes[size - 1].getIndicator('ema5')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('ema10')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('ema20')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('ema50')).toBeDefined();
    });
  });

  describe('EMA with object-based data performance', () => {
    it('Should handle object-based quotes efficiently', () => {
      const size = 1000;
      const data = Array.from({ length: size }, (_, i) => ({
        close: 22 + Math.random() * 2,
        high: 25 + Math.random() * 2,
        low: 20 + Math.random() * 2,
      }));
      const dataset = new Dataset<{ close: number; high: number; low: number }>(data);
      const ema = new EMA<{ close: number; high: number; low: number }>('ema20', {
        period: 20,
        attribute: 'close',
      });

      console.time(`EMA spread() - ${size} object-based items`);
      ema.spread(dataset);
      console.timeEnd(`EMA spread() - ${size} object-based items`);

      // Verify correctness
      const lastValue = dataset.quotes[size - 1].getIndicator('ema20');
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue)).toBe(false);
    });
  });
});

