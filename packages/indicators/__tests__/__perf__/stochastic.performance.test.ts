import { Dataset } from '@quantomate/core';
import { Stochastic } from '../../src';

describe('Stochastic Oscillator Performance Tests', () => {
  const createTestData = (size: number) => {
    return Array.from({ length: size }, (_, i) => ({
      high: 50 + Math.random() * 10,
      low: 45 + Math.random() * 10,
      close: 47 + Math.random() * 10,
    }));
  };

  describe('spread() performance - %K', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should spread Stochastic %K over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
          'stoch_k',
          {
            kPeriod: 14,
            type: 'k',
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );

        console.time(`Stochastic %K spread() - ${size} items`);
        stochastic.spread(dataset);
        console.timeEnd(`Stochastic %K spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('stoch_k');
        if (size >= 14) {
          expect(lastValue).toBeDefined();
          expect(typeof lastValue).toBe('number');
          if (!isNaN(lastValue)) {
            expect(lastValue).toBeGreaterThanOrEqual(0);
            expect(lastValue).toBeLessThanOrEqual(100);
          }
        }
      });
    });
  });

  describe('spread() performance - %D', () => {
    const sizes = [100, 500, 1000];

    sizes.forEach((size) => {
      it(`Should spread Stochastic %D over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
          'stoch_d',
          {
            kPeriod: 14,
            dPeriod: 3,
            type: 'd',
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );

        console.time(`Stochastic %D spread() - ${size} items`);
        stochastic.spread(dataset);
        console.timeEnd(`Stochastic %D spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('stoch_d');
        const minRequired = 14 + 3 - 1; // kPeriod + dPeriod - 1
        if (size >= minRequired) {
          expect(lastValue).toBeDefined();
          expect(typeof lastValue).toBe('number');
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
      it(`Should calculate Stochastic %K on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
          'stoch_k',
          {
            kPeriod: 14,
            type: 'k',
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );

        console.time(`Stochastic %K calculate() - ${size} items`);
        const result = stochastic.calculate(dataset);
        console.timeEnd(`Stochastic %K calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        if (size >= 14 && !isNaN(result)) {
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(100);
        }
      });
    });
  });

  describe('Both %K and %D performance', () => {
    it('Should handle both %K and %D efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);

      const stochK = new Stochastic<{ high: number; low: number; close: number }>(
        'stoch_k',
        {
          kPeriod: 14,
          type: 'k',
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );
      const stochD = new Stochastic<{ high: number; low: number; close: number }>(
        'stoch_d',
        {
          kPeriod: 14,
          dPeriod: 3,
          type: 'd',
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      console.time(`Stochastic %K and %D spread() - ${size} items`);
      stochK.spread(dataset);
      stochD.spread(dataset);
      console.timeEnd(`Stochastic %K and %D spread() - ${size} items`);

      // Verify correctness
      expect(dataset.quotes[size - 1].getIndicator('stoch_k')).toBeDefined();
      const dValue = dataset.quotes[size - 1].getIndicator('stoch_d');
      if (dValue !== undefined && !isNaN(dValue)) {
        expect(dValue).toBeGreaterThanOrEqual(0);
        expect(dValue).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Custom parameters performance', () => {
    it('Should handle different kPeriod values efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const periods = [5, 10, 14, 20];

      console.time(`Stochastic %K spread() - ${size} items with ${periods.length} periods`);
      periods.forEach((kPeriod) => {
        const dataset = new Dataset(data);
        const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
          `stoch_k_${kPeriod}`,
          {
            kPeriod,
            type: 'k',
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );
        stochastic.spread(dataset);
      });
      console.timeEnd(`Stochastic %K spread() - ${size} items with ${periods.length} periods`);
    });
  });
});

