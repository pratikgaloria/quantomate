import { Dataset } from '@quantomate/core';
import { WilliamsR } from '../../src';

describe('Williams %R Performance Tests', () => {
  const createTestData = (size: number) => {
    return Array.from({ length: size }, (_, i) => ({
      high: 50 + Math.random() * 10,
      low: 45 + Math.random() * 10,
      close: 47 + Math.random() * 10,
    }));
  };

  describe('spread() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should spread Williams %R over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const williamsR = new WilliamsR<{
          high: number;
          low: number;
          close: number;
        }>('williams_r', {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        });

        console.time(`Williams %R spread() - ${size} items`);
        williamsR.spread(dataset);
        console.timeEnd(`Williams %R spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('williams_r');
        if (size >= 14) {
          expect(lastValue).toBeDefined();
          expect(typeof lastValue).toBe('number');
          if (!isNaN(lastValue)) {
            expect(lastValue).toBeGreaterThanOrEqual(-100);
            expect(lastValue).toBeLessThanOrEqual(0);
          }
        }
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate Williams %R on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const williamsR = new WilliamsR<{
          high: number;
          low: number;
          close: number;
        }>('williams_r', {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        });

        console.time(`Williams %R calculate() - ${size} items`);
        const result = williamsR.calculate(dataset);
        console.timeEnd(`Williams %R calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        if (size >= 14 && !isNaN(result)) {
          expect(result).toBeGreaterThanOrEqual(-100);
          expect(result).toBeLessThanOrEqual(0);
        }
      });
    });
  });

  describe('Custom parameters performance', () => {
    it('Should handle different period values efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const periods = [5, 10, 14, 20];

      console.time(`Williams %R spread() - ${size} items with ${periods.length} periods`);
      periods.forEach((period) => {
        const dataset = new Dataset(data);
        const williamsR = new WilliamsR<{
          high: number;
          low: number;
          close: number;
        }>(`williams_r_${period}`, {
          period,
          high: 'high',
          low: 'low',
          close: 'close',
        });
        williamsR.spread(dataset);
      });
      console.timeEnd(`Williams %R spread() - ${size} items with ${periods.length} periods`);
    });
  });
});

