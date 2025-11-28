import { Dataset } from '@quantomate/core';
import { RSI } from '../src';

describe('RSI', () => {
  const data = [
    44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.42, 45.84, 46.08, 45.89,
    46.03, 45.61, 46.28, 46.28, 46.0, 46.03,
  ];

  it('should calculate RSI correctly', () => {
    const rsi14 = new RSI('rsi14', { period: 14 });
    const ds = new Dataset(data);
    
    const result = rsi14.calculate(ds);
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
    // RSI should be between 0 and 100
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });

  it('should work with spread()', () => {
    const rsi14 = new RSI('rsi14', { period: 14 });
    const ds = new Dataset(data);
    rsi14.spread(ds);
    
    const lastValue = ds.at(-1)?.getIndicator('rsi14');
    expect(lastValue).toBeDefined();
    expect(typeof lastValue).toBe('number');
    expect(lastValue).toBeGreaterThan(0);
    expect(lastValue).toBeLessThan(100);
  });
});
