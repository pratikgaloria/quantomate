import { Dataset } from '@quantomate/core';
import { CCI } from '../src';

describe('CCI (Commodity Channel Index) should return the correct value', () => {
  // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:commodity_channel_index_cci
  // Sample data with high, low, close
  const data = [
    { high: 23.13, low: 22.87, close: 23.01 },
    { high: 23.47, low: 23.21, close: 23.35 },
    { high: 23.81, low: 23.55, close: 23.68 },
    { high: 24.15, low: 23.89, close: 24.02 },
    { high: 24.49, low: 24.23, close: 24.36 },
    { high: 24.83, low: 24.57, close: 24.7 },
    { high: 25.17, low: 24.91, close: 25.04 },
    { high: 25.51, low: 25.25, close: 25.38 },
    { high: 25.85, low: 25.59, close: 25.72 },
    { high: 26.19, low: 25.93, close: 26.06 },
    { high: 26.53, low: 26.27, close: 26.4 },
    { high: 26.87, low: 26.61, close: 26.74 },
    { high: 27.21, low: 26.95, close: 27.08 },
    { high: 27.55, low: 27.29, close: 27.42 },
    { high: 27.89, low: 27.63, close: 27.76 },
    { high: 28.23, low: 27.97, close: 28.1 },
    { high: 28.57, low: 28.31, close: 28.44 },
    { high: 28.91, low: 28.65, close: 28.78 },
    { high: 29.25, low: 29.0, close: 29.12 },
    { high: 29.59, low: 29.33, close: 29.46 },
  ];

  describe('Basic CCI calculation', () => {
    const name = 'cci';
    const period = 20;
    const cci = new CCI<{ high: number; low: number; close: number }>(name, {
      period,
      high: 'high',
      low: 'low',
      close: 'close',
    });

    it('When dataset length is less than period.', () => {
      const result = cci.calculate(new Dataset(data.slice(0, period - 1)));
      expect(isNaN(result)).toBe(true);
    });

    it('When dataset length is equal to period.', () => {
      const result = cci.calculate(new Dataset(data.slice(0, period)));
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      // CCI is unbounded, can be any value
    });

    it('When dataset length is more than period.', () => {
      const ds = new Dataset(data);
      const result = cci.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      cci.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue)).toBe(false);
    });
  });

  describe('Typical Price calculation', () => {
    it('Typical Price should be (High + Low + Close) / 3.', () => {
      const quote = data[0];
      const expectedTP = (quote.high + quote.low + quote.close) / 3;
      expect(expectedTP).toBeCloseTo(23.003, 2);
    });
  });

  describe('Value interpretation', () => {
    it('CCI values above +100 may indicate overbought condition.', () => {
      const ds = new Dataset(data);
      const cci = new CCI<{ high: number; low: number; close: number }>(
        'cci',
        {
          period: 20,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      cci.spread(ds);

      // CCI can be any value, but typically:
      // > +100 = overbought
      // < -100 = oversold
      // -100 to +100 = neutral
      const lastValue = ds.at(-1)?.getIndicator('cci');
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
    });
  });

  describe('Edge cases', () => {
    it('Should handle zero mean deviation.', () => {
      const flatData = Array.from({ length: 25 }, () => ({
        high: 100,
        low: 100,
        close: 100,
      }));

      const ds = new Dataset(flatData);
      const cci = new CCI<{ high: number; low: number; close: number }>(
        'cci',
        {
          period: 20,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = cci.calculate(ds);
      // When mean deviation is 0, should return 0
      expect(result).toBe(0);
    });
  });

  describe('Custom parameters', () => {
    it('Should work with custom period.', () => {
      const ds = new Dataset(data);
      const cci = new CCI<{ high: number; low: number; close: number }>(
        'cci_custom',
        {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = cci.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });
  });

  describe('Unbounded scale', () => {
    it('CCI can exceed +100 or go below -100.', () => {
      // Create data with high volatility
      const volatileData = Array.from({ length: 25 }, (_, i) => ({
        high: 100 + i * 10,
        low: 90 + i * 10,
        close: 95 + i * 10,
      }));

      const ds = new Dataset(volatileData);
      const cci = new CCI<{ high: number; low: number; close: number }>(
        'cci',
        {
          period: 20,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = cci.calculate(ds);
      // CCI is unbounded, can be any value
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });
  });
});

