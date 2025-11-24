import { Dataset } from '@quantomate/core';
import { ATR } from '../../src';

describe('ATR (Average True Range) Performance Tests', () => {
  const createTestData = (size: number) => {
    return Array.from({ length: size }, (_, i) => ({
      high: 50 + Math.random() * 5,
      low: 45 + Math.random() * 5,
      close: 47 + Math.random() * 5,
    }));
  };

  describe('spread() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should spread ATR over ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const atr = new ATR<{ high: number; low: number; close: number }>(
          'atr',
          {
            period: 14,
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );

        console.time(`ATR spread() - ${size} items`);
        atr.spread(dataset);
        console.timeEnd(`ATR spread() - ${size} items`);

        // Verify correctness
        expect(dataset.quotes.length).toBe(size);
        const lastValue = dataset.quotes[size - 1].getIndicator('atr');
        if (size >= 2) {
          expect(lastValue).toBeDefined();
          expect(typeof lastValue).toBe('number');
          if (!isNaN(lastValue)) {
            expect(lastValue).toBeGreaterThanOrEqual(0);
          }
        }
      });
    });
  });

  describe('calculate() performance', () => {
    const sizes = [100, 500, 1000, 5000];

    sizes.forEach((size) => {
      it(`Should calculate ATR on ${size} items efficiently`, () => {
        const data = createTestData(size);
        const dataset = new Dataset(data);
        const atr = new ATR<{ high: number; low: number; close: number }>(
          'atr',
          {
            period: 14,
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );

        console.time(`ATR calculate() - ${size} items`);
        const result = atr.calculate(dataset);
        console.timeEnd(`ATR calculate() - ${size} items`);

        // Verify correctness
        expect(typeof result).toBe('number');
        if (size >= 2 && !isNaN(result)) {
          expect(result).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });

  describe('Custom parameters performance', () => {
    it('Should handle different period values efficiently', () => {
      const size = 1000;
      const data = createTestData(size);
      const periods = [7, 14, 21, 28];

      console.time(`ATR spread() - ${size} items with ${periods.length} periods`);
      periods.forEach((period) => {
        const dataset = new Dataset(data);
        const atr = new ATR<{ high: number; low: number; close: number }>(
          `atr_${period}`,
          {
            period,
            high: 'high',
            low: 'low',
            close: 'close',
          }
        );
        atr.spread(dataset);
      });
      console.timeEnd(`ATR spread() - ${size} items with ${periods.length} periods`);
    });
  });

  describe('True Range storage performance', () => {
    it('Should efficiently store True Range values for incremental calculation', () => {
      const size = 1000;
      const data = createTestData(size);
      const dataset = new Dataset(data);
      const atr = new ATR<{ high: number; low: number; close: number }>(
        'atr',
        {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      console.time(`ATR spread() with TR storage - ${size} items`);
      atr.spread(dataset);
      console.timeEnd(`ATR spread() with TR storage - ${size} items`);

      // Verify True Range values are stored
      expect(dataset.quotes[0].getIndicator('atr_tr')).toBeDefined();
      expect(dataset.quotes[size - 1].getIndicator('atr_tr')).toBeDefined();

      // Verify ATR is calculated
      const atrValue = dataset.quotes[size - 1].getIndicator('atr');
      expect(atrValue).toBeDefined();
      expect(typeof atrValue).toBe('number');
      if (!isNaN(atrValue)) {
        expect(atrValue).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

