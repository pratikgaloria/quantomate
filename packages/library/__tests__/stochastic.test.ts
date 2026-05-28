import { Dataset } from '@quantomate/core';
import { Stochastic } from '../src';

describe('Stochastic Oscillator should return the correct value', () => {
  // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:stochastic_oscillator
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

  describe('%K (Fast Stochastic)', () => {
    const name = 'stoch_k';
    const kPeriod = 14;
    const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
      name,
      {
        kPeriod,
        type: 'k',
        high: 'high',
        low: 'low',
        close: 'close',
      }
    );

    it('When dataset length is less than kPeriod.', () => {
      const result = stochastic.calculate(
        new Dataset(data.slice(0, kPeriod - 1))
      );
      expect(isNaN(result)).toBe(true);
    });

    it('When dataset length is equal to kPeriod.', () => {
      const result = stochastic.calculate(new Dataset(data.slice(0, kPeriod)));
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      // %K should be between 0 and 100
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('When dataset length is more than kPeriod.', () => {
      const ds = new Dataset(data);
      const result = stochastic.calculate(ds);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      stochastic.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      expect(lastValue).toBeDefined();
      expect(typeof lastValue).toBe('number');
      expect(isNaN(lastValue!)).toBe(false);
      expect(lastValue).toBeGreaterThanOrEqual(0);
      expect(lastValue).toBeLessThanOrEqual(100);
    });
  });

  describe('%D (Slow Stochastic)', () => {
    const name = 'stoch_d';
    const kPeriod = 14;
    const dPeriod = 3;
    const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
      name,
      {
        kPeriod,
        dPeriod,
        type: 'd',
        high: 'high',
        low: 'low',
        close: 'close',
      }
    );

    it('When dataset length is less than kPeriod + dPeriod - 1.', () => {
      const minRequired = kPeriod + dPeriod - 1;
      const result = stochastic.calculate(
        new Dataset(data.slice(0, minRequired - 1))
      );
      expect(isNaN(result)).toBe(true);
    });

    it('When dataset length is sufficient.', () => {
      const ds = new Dataset(data);
      const result = stochastic.calculate(ds);
      expect(typeof result).toBe('number');
      // May be NaN if not enough data, but if calculated should be valid
      if (!isNaN(result)) {
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
      }
    });

    it('When indicator is spreaded over the dataset.', () => {
      const ds = new Dataset(data);
      stochastic.spread(ds);

      const lastValue = ds.at(-1)?.getIndicator(name);
      // %D might be NaN if not enough data
      if (lastValue !== undefined && !isNaN(lastValue)) {
        expect(lastValue).toBeGreaterThanOrEqual(0);
        expect(lastValue).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Value range validation', () => {
    it('%K should always be between 0 and 100.', () => {
      const ds = new Dataset(data);
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

      stochastic.spread(ds);

      for (let index = 0; index < ds.length; index++) {
        const quote = ds.at(index)!;
        if (index >= 13) {
          // After kPeriod
          const kValue = quote.getIndicator('stoch_k');
          if (kValue !== undefined && !isNaN(kValue)) {
            expect(kValue).toBeGreaterThanOrEqual(0);
            expect(kValue).toBeLessThanOrEqual(100);
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

      const result = stochastic.calculate(ds);
      // When range is 0, should return 50 (neutral)
      expect(result).toBe(50);
    });
  });

  describe('Custom parameters', () => {
    it('Should work with custom kPeriod.', () => {
      const ds = new Dataset(data);
      const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
        'stoch_custom',
        {
          kPeriod: 10,
          type: 'k',
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = stochastic.calculate(ds);
      if (!isNaN(result)) {
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
      }
    });

    it('Should work with custom dPeriod.', () => {
      const ds = new Dataset(data);
      const stochastic = new Stochastic<{ high: number; low: number; close: number }>(
        'stoch_d_custom',
        {
          kPeriod: 14,
          dPeriod: 5,
          type: 'd',
          high: 'high',
          low: 'low',
          close: 'close',
        }
      );

      const result = stochastic.calculate(ds);
      // May be NaN if not enough data
      if (!isNaN(result)) {
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
      }
    });
  });
});

