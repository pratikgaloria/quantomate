import { Dataset } from '@quantomate/core';
import { EMA } from '../src';

describe('EMA', () => {
  const data = [
    22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39,
  ];

  it('should calculate EMA correctly', () => {
    const ema = new EMA('ema10', { period: 10 });
    const ds = new Dataset(data);
    
    const result = ema.calculate(ds);
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });

  it('should work with spread() and incremental calculation', () => {
    const ema = new EMA('ema5', { period: 5 });
    const ds = new Dataset(data);
    ema.spread(ds);
    
    const lastValue = ds.at(-1)?.getIndicator('ema5');
    expect(lastValue).toBeDefined();
    expect(typeof lastValue).toBe('number');
    expect(isNaN(lastValue!)).toBe(false);
  });
});
