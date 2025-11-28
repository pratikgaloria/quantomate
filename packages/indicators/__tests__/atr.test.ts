import { Dataset } from '@quantomate/core';
import { ATR } from '../src';

describe('ATR (Average True Range) should return the correct value', () => {
  // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:average_true_range_atr
  // Sample data with high, low, close
  const data = [
    { high: 48.7, low: 47.79, close: 48.16 },
    { high: 48.72, low: 48.14, close: 48.61 },
    { high: 48.9, low: 48.39, close: 48.75 },
    { high: 48.87, low: 48.37, close: 48.63 },
    { high: 48.82, low: 48.24, close: 48.74 },
    { high: 49.05, low: 48.64, close: 49.03 },
    { high: 49.2, low: 48.94, close: 49.07 },
    { high: 49.35, low: 48.86, close: 49.32 },
    { high: 49.92, low: 49.5, close: 49.91 },
    { high: 50.19, low: 49.87, close: 50.13 },
    { high: 50.12, low: 49.2, close: 49.53 },
    { high: 49.66, low: 48.9, close: 49.5 },
    { high: 49.88, low: 49.43, close: 49.75 },
    { high: 50.19, low: 49.73, close: 50.03 },
    { high: 50.36, low: 49.26, close: 50.31 },
    { high: 50.57, low: 50.09, close: 50.52 },
    { high: 50.65, low: 50.3, close: 50.41 },
    { high: 50.43, low: 49.21, close: 49.34 },
    { high: 49.63, low: 48.98, close: 49.37 },
    { high: 50.33, low: 49.61, close: 50.23 },
  ];

  describe('Basic ATR calculation', () => {
    const name = 'atr';
    const period = 14;
    const atr = new ATR<{ high: number; low: number; close: number }>(name, {
      period,
      high: 'high',
      low: 'low',
      close: 'close',
    });

    it('When dataset length is less than 2.', () => {
      const result = atr.calculate(new Dataset([data[0]]));
      expect(isNaN(result)).toBe(true);
    });

    it('When dataset length is 2.', () => {
      const result = atr.calculate(new Dataset(data.slice(0, 2)));
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      expect(result).toBeGreaterThan(0);
    });

    it('When dataset length is less than period + 1.', () => {
      const result = atr.calculate(new Dataset(data.slice(0, period)));
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      expect(result).toBeGreaterThan(0);
    });

    it('When dataset length is more than period + 1.', () => {
      const ds = new Dataset(data);
      const result = atr.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      expect(result).toBeGreaterThan(0);
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      atr.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue!)).toBe(false);
      expect(lastValue).toBeGreaterThan(0);
    });
  });

  describe('True Range calculation', () => {
    it('First quote True Range should be High - Low.', () => {
      const ds = new Dataset(data);
      const atr = new ATR<{ high: number; low: number; close: number }>(
        'atr',
        {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      atr.spread(ds);

      // First quote's True Range should be stored
      const firstTR = ds.at(0)?.getIndicator('atr_tr');
      expect(firstTR).toBe(data[0].high - data[0].low);
    });

    it('True Range should be max of (High-Low, |High-PrevClose|, |Low-PrevClose|).', () => {
      const ds = new Dataset(data.slice(0, 5));
      const atr = new ATR<{ high: number; low: number; close: number }>(
        'atr',
        {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      atr.spread(ds);

      // Check True Range for second quote
      const secondTR = ds.at(1)?.getIndicator('atr_tr');
      const hl = data[1].high - data[1].low;
      const hc = Math.abs(data[1].high - data[0].close);
      const lc = Math.abs(data[1].low - data[0].close);
      const expectedTR = Math.max(hl, hc, lc);

      expect(secondTR).toBeCloseTo(expectedTR, 2);
    });
  });

  describe('Value validation', () => {
    it('ATR should always be positive.', () => {
      const ds = new Dataset(data);
      const atr = new ATR<{ high: number; low: number; close: number }>(
        'atr',
        {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      atr.spread(ds);

      for (let index = 0; index < ds.length; index++) {
        const quote = ds.at(index)!;
        if (index >= 1) {
          // After first quote
          const atrValue = quote.getIndicator('atr');
          if (atrValue !== undefined && !isNaN(atrValue)) {
            expect(atrValue).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  describe('Custom parameters', () => {
    it('Should work with custom period.', () => {
      const ds = new Dataset(data);
      const atr = new ATR<{ high: number; low: number; close: number }>(
        'atr_custom',
        {
          period: 10,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = atr.calculate(ds);
      expect(typeof result).toBe('number');
      if (!isNaN(result)) {
        expect(result).toBeGreaterThan(0);
      }
    });
  });

  describe('Edge cases', () => {
    it('Should handle flat prices (no volatility).', () => {
      const flatData = Array.from({ length: 20 }, () => ({
        high: 100,
        low: 100,
        close: 100,
      }));

      const ds = new Dataset(flatData);
      const atr = new ATR<{ high: number; low: number; close: number }>(
        'atr',
        {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = atr.calculate(ds);
      // ATR should be 0 when there's no volatility
      expect(result).toBe(0);
    });

    it('Should handle single quote dataset.', () => {
      const ds = new Dataset([data[0]]);
      const atr = new ATR<{ high: number; low: number; close: number }>(
        'atr',
        {
          period: 14,
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = atr.calculate(ds);
      expect(isNaN(result)).toBe(true);
    });
  });
});

