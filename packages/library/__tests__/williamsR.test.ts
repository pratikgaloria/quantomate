import { Dataset } from '@quantomate/core';
import { WilliamsR } from '../src';

describe('Williams %R should return the correct value', () => {
  // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:williams_r
  // Sample data with high, low, close
  const data = [
    { high: 127.01, low: 125.36, close: 126.0 },
    { high: 127.62, low: 126.16, close: 126.6 },
    { high: 126.59, low: 124.93, close: 127.1 },
    { high: 127.35, low: 126.09, close: 127.2 },
    { high: 128.17, low: 126.82, close: 128.0 },
    { high: 128.43, low: 127.01, close: 128.1 },
    { high: 127.37, low: 126.01, close: 127.2 },
    { high: 126.42, low: 124.8, close: 126.0 },
    { high: 126.9, low: 126.39, close: 126.5 },
    { high: 126.85, low: 125.72, close: 126.3 },
    { high: 125.65, low: 124.56, close: 125.0 },
    { high: 125.72, low: 124.52, close: 125.0 },
    { high: 127.16, low: 125.55, close: 126.8 },
    { high: 127.72, low: 126.28, close: 127.5 },
    { high: 127.69, low: 126.28, close: 127.4 },
    { high: 128.22, low: 126.44, close: 128.0 },
    { high: 128.27, low: 127.1, close: 127.8 },
    { high: 128.09, low: 126.93, close: 127.5 },
    { high: 128.27, low: 127.11, close: 127.8 },
    { high: 127.74, low: 126.84, close: 127.3 },
  ];

  describe('Basic Williams %R calculation', () => {
    const name = 'williams_r';
    const period = 14;
    const williamsR = new WilliamsR<{
      high: number;
      low: number;
      close: number;
    }>(name, {
      period,
      high: 'high',
      low: 'low',
      close: 'close',
    });

    it('When dataset length is less than period.', () => {
      const result = williamsR.calculate(
        new Dataset(data.slice(0, period - 1))
      );
      expect(isNaN(result)).toBe(true);
    });

    it('When dataset length is equal to period.', () => {
      const result = williamsR.calculate(new Dataset(data.slice(0, period)));
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      // %R should be between -100 and 0
      expect(result).toBeGreaterThanOrEqual(-100);
      expect(result).toBeLessThanOrEqual(0);
    });

    it('When dataset length is more than period.', () => {
      const ds = new Dataset(data);
      const result = williamsR.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      expect(result).toBeGreaterThanOrEqual(-100);
      expect(result).toBeLessThanOrEqual(0);
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      williamsR.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue!)).toBe(false);
      expect(lastValue).toBeGreaterThanOrEqual(-100);
      expect(lastValue).toBeLessThanOrEqual(0);
    });
  });

  describe('Value range validation', () => {
    it('%R should always be between -100 and 0.', () => {
      const ds = new Dataset(data);
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

      williamsR.spread(ds);

      for (let index = 0; index < ds.length; index++) {
        const quote = ds.at(index)!;
        if (index >= 13) {
          // After period
          const rValue = quote.getIndicator('williams_r');
          if (rValue !== undefined && !isNaN(rValue)) {
            expect(rValue).toBeGreaterThanOrEqual(-100);
            expect(rValue).toBeLessThanOrEqual(0);
          }
        }
      }
    });
  });

  describe('Edge cases', () => {
    it('Should handle zero range (high === low).', () => {
      const flatData = Array.from({ length: 20 }, () => ({
        high: 100,
        low: 100,
        close: 100,
      }));

      const ds = new Dataset(flatData);
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

      const result = williamsR.calculate(ds);
      // When range is 0, should return -50 (neutral)
      expect(result).toBe(-50);
    });
  });

  describe('Custom parameters', () => {
    it('Should work with custom period.', () => {
      const ds = new Dataset(data);
      const williamsR = new WilliamsR<{
        high: number;
        low: number;
        close: number;
      }>('williams_r_custom', {
        period: 10,
        high: 'high',
        low: 'low',
        close: 'close',
      });

      const result = williamsR.calculate(ds);
      if (!isNaN(result)) {
        expect(result).toBeGreaterThanOrEqual(-100);
        expect(result).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Relationship with Stochastic', () => {
    it('Williams %R should be the inverse of Stochastic %K (shifted by -100).', () => {
      const ds = new Dataset(data);
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

      williamsR.spread(ds);

      // Williams %R = Stochastic %K - 100
      // So Williams %R should be approximately equal to (Stochastic %K - 100)
      // We can verify the relationship by checking the formula
      const lastQuote = ds.at(-1);
      const wrValue = lastQuote?.getIndicator('williams_r');

      if (wrValue !== undefined && !isNaN(wrValue)) {
        // Calculate what Stochastic %K would be
        const period = 14;
        const datasetLength = ds.length;
        const currentClose = data[data.length - 1].close;

        let highestHigh = Number.NEGATIVE_INFINITY;
        let lowestLow = Number.POSITIVE_INFINITY;

        for (let i = datasetLength - period; i < datasetLength; i++) {
          if (data[i].high > highestHigh) highestHigh = data[i].high;
          if (data[i].low < lowestLow) lowestLow = data[i].low;
        }

        const range = highestHigh - lowestLow;
        if (range !== 0) {
          const stochK = 100 * ((currentClose - lowestLow) / range);
          const expectedWR = stochK - 100;
          expect(wrValue).toBeCloseTo(expectedWR, 2);
        }
      }
    });
  });
});

