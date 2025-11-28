import { Dataset } from '@quantomate/core';
import { SMA } from '../src';

describe('SMA', () => {
  const data = [
    22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39,
  ];

  it('should calculate SMA correctly', () => {
    const sma = new SMA('sma10', { period: 10 });
    const ds = new Dataset(data);
    
    const result = sma.calculate(ds);
    expect(result).toBeCloseTo(22.23, 2);
  });

  it('should work with spread() and incremental calculation', () => {
    const sma = new SMA('sma5', { period: 5 });
    const ds = new Dataset(data);
    sma.spread(ds);
    
    const lastValue = ds.at(-1)?.getIndicator('sma5');
    expect(lastValue).toBeDefined();
    expect(typeof lastValue).toBe('number');
    expect(isNaN(lastValue)).toBe(false);
  });
});
