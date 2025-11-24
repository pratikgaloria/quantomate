import { Dataset } from '@quantomate/core';
import { CCI } from '../../src';

describe('CCI (Commodity Channel Index) Performance Tests', () => {
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
      it(`Should spread CCI over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const cci = new CCI<{ high: number; low: number; close: number }>(
          'cci',
          {
            period: 20,
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );

        console.time(`CCI spread() - ${size} items`);
        cci.spread(dataset);
        console.timeEnd(`CCI spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('cci');
        if (size >= 20) {
          expect(lastValue).toBeDefined();
          expect(typeof lastValue).toBe('number');
          expect(isNaN(lastValue)).toBe(false);
        }
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate CCI on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const cci = new CCI<{ high: number; low: number; close: number }>(
          'cci',
          {
            period: 20,
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );

        console.time(`CCI calculate() - ${size} items`);
        const result = cci.calculate(dataset);
        console.timeEnd(`CCI calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        if (size >= 20) {
          expect(isNaN(result)).toBe(false);
        }
      });
    });
  });

  describe('Custom parameters performance', () => {
    it('Should handle different period values efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const periods = [10, 14, 20, 28];

      console.time(`CCI spread() - ${size} items with ${periods.length} periods`);
      periods.forEach((period) => {
        const dataset = new Dataset(data);
        const cci = new CCI<{ high: number; low: number; close: number }>(
          `cci_${period}`,
          {
            period,
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );
        cci.spread(dataset);
      });
      console.timeEnd(`CCI spread() - ${size} items with ${periods.length} periods`);
    });
  });
});

