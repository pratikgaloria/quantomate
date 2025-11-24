import { Dataset } from '@quantomate/core';
import { BB } from '../../src';

describe('BB (Bollinger Bands) Performance Tests', () => {
  const createTestData = (size: number): number[] => {
    return Array.from({ length: size }, (_, i) => 22 + Math.random() * 2);
  };

  describe('spread() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should spread BB middle band over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const bb = new BB('bb_middle', {
          period: 20,
          multiplier: 2,
          band: 'middle',
        });

        console.time(`BB middle spread() - ${size} items`);
        bb.spread(dataset);
        console.timeEnd(`BB middle spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('bb_middle');
        expect(lastValue).toBeDefined();
        expect(typeof lastValue).toBe('number');
        expect(isNaN(lastValue)).toBe(false);
      });

      it(`Should spread BB upper band over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const bb = new BB('bb_upper', {
          period: 20,
          multiplier: 2,
          band: 'upper',
        });

        console.time(`BB upper spread() - ${size} items`);
        bb.spread(dataset);
        console.timeEnd(`BB upper spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes[size - 1].getIndicator('bb_upper')).toBeDefined();
        expect(typeof dataset.quotes[size - 1].getIndicator('bb_upper')).toBe('number');
      });

      it(`Should spread BB lower band over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const bb = new BB('bb_lower', {
          period: 20,
          multiplier: 2,
          band: 'lower',
        });

        console.time(`BB lower spread() - ${size} items`);
        bb.spread(dataset);
        console.timeEnd(`BB lower spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes[size - 1].getIndicator('bb_lower')).toBeDefined();
        expect(typeof dataset.quotes[size - 1].getIndicator('bb_lower')).toBe('number');
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate BB middle band on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const bb = new BB('bb_middle', {
          period: 20,
          multiplier: 2,
          band: 'middle',
        });

        console.time(`BB middle calculate() - ${size} items`);
        const result = bb.calculate(dataset);
        console.timeEnd(`BB middle calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
      });
    });
  });

  describe('All three bands performance', () => {
    it('Should handle all three BB bands efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);

      const bbUpper = new BB('bb_upper', {
        period: 20,
        multiplier: 2,
        band: 'upper',
      });
      const bbMiddle = new BB('bb_middle', {
        period: 20,
        multiplier: 2,
        band: 'middle',
      });
      const bbLower = new BB('bb_lower', {
        period: 20,
        multiplier: 2,
        band: 'lower',
      });

      console.time(`All BB bands spread() - ${size} items (3 bands)`);
      bbUpper.spread(dataset);
      bbMiddle.spread(dataset);
      bbLower.spread(dataset);
      console.timeEnd(`All BB bands spread() - ${size} items (3 bands)`);

      // Verify correctness
      expect(dataset.quotes[size - 1].getIndicator('bb_upper')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('bb_middle')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('bb_lower')).toBeDefined();

      // Verify relationships
      const upper = dataset.quotes[size - 1].getIndicator('bb_upper');
      const middle = dataset.quotes[size - 1].getIndicator('bb_middle');
      const lower = dataset.quotes[size - 1].getIndicator('bb_lower');

      expect(upper).toBeGreaterThan(middle);
      expect(middle).toBeGreaterThan(lower);
    });
  });

  describe('BB with object-based data performance', () => {
    it('Should handle object-based quotes efficiently', () => {
      const size = 1000;
      const data = Array.from({ length: size }, (_, i) => ({
        close: 22 + Math.random() * 2,
        high: 25 + Math.random() * 2,
        low: 20 + Math.random() * 2,
      }));
      const dataset = new Dataset<{ close: number; high: number; low: number }>(data);
      const bb = new BB<{ close: number; high: number; low: number }>('bb_close', {
        period: 20,
        multiplier: 2,
        band: 'middle',
        attribute: 'close',
      });

      console.time(`BB spread() - ${size} object-based items`);
      bb.spread(dataset);
      console.timeEnd(`BB spread() - ${size} object-based items`);

      // Verify correctness
      const lastValue = dataset.quotes[size - 1].getIndicator('bb_close');
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue)).toBe(false);
    });
  });

  describe('BB with different multipliers', () => {
    it('Should handle different multiplier values efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);

      const multipliers = [1, 1.5, 2, 2.5];

      console.time(`BB spread() - ${size} items with ${multipliers.length} multipliers`);
      multipliers.forEach((multiplier) => {
        const bb = new BB(`bb_${multiplier}`, {
          period: 20,
          multiplier,
          band: 'upper',
        });
        bb.spread(dataset);
      });
      console.timeEnd(`BB spread() - ${size} items with ${multipliers.length} multipliers`);

      // Verify correctness
      multipliers.forEach((multiplier) => {
        const value = dataset.quotes[size - 1].getIndicator(`bb_${multiplier}`);
        expect(value).toBeDefined();
        expect(typeof value).toBe('number');
      });
    });
  });
});

