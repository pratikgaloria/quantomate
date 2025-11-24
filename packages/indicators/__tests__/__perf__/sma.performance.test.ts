import { Dataset } from '@quantomate/core';
import { SMA } from '../../src';

describe('SMA Performance Tests', () => {
  const createTestData = (size: number): number[] => {
    return Array.from({ length: size }, (_, i) => 20 + Math.random() * 10);
  };

  describe('spread() performance', () => {
    const sizes = [100, 500, 1000, 5000, 10000];

    sizes.forEach((size) => {
      it(`Should spread SMA over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const sma = new SMA('sma20', { period: 20 });

        console.time(`SMA spread() - ${size} items`);
        sma.spread(dataset);
        console.timeEnd(`SMA spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        expect(dataset.quotes[size - 1].getIndicator('sma20')).toBeDefined();
        expect(typeof dataset.quotes[size - 1].getIndicator('sma20')).toBe('number');
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate SMA on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const sma = new SMA('sma20', { period: 20 });

        console.time(`SMA calculate() - ${size} items`);
        const result = sma.calculate(dataset);
        console.timeEnd(`SMA calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
      });
    });
  });

  describe('Multiple SMA indicators performance', () => {
    it('Should handle multiple SMA indicators efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);

      const sma5 = new SMA('sma5', { period: 5 });
      const sma10 = new SMA('sma10', { period: 10 });
      const sma20 = new SMA('sma20', { period: 20 });
      const sma50 = new SMA('sma50', { period: 50 });

      console.time(`Multiple SMA spread() - ${size} items (4 indicators)`);
      sma5.spread(dataset);
      sma10.spread(dataset);
      sma20.spread(dataset);
      sma50.spread(dataset);
      console.timeEnd(`Multiple SMA spread() - ${size} items (4 indicators)`);

      // Verify correctness
      expect(dataset.quotes[size - 1].getIndicator('sma5')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('sma10')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('sma20')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('sma50')).toBeDefined();
    });
  });

  describe('SMA with object-based data performance', () => {
    it('Should handle object-based quotes efficiently', () => {
      const size = 1000;
      const data = Array.from({ length: size }, (_, i) => ({
        close: 20 + Math.random() * 10,
        high: 25 + Math.random() * 10,
        low: 15 + Math.random() * 10,
      }));
      const dataset = new Dataset<{ close: number; high: number; low: number }>(data);
      const sma = new SMA<{ close: number; high: number; low: number }>('sma20', {
        period: 20,
        attribute: 'close',
      });

      console.time(`SMA spread() - ${size} object-based items`);
      sma.spread(dataset);
      console.timeEnd(`SMA spread() - ${size} object-based items`);

      // Verify correctness
      expect(dataset.quotes[size - 1].getIndicator('sma20')).toBeDefined();
      expect(typeof dataset.quotes[size - 1].getIndicator('sma20')).toBe('number');
    });
  });
});

