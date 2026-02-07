import { Dataset } from '@quantomate/core';
import { WMA } from '../src';

describe('WMA', () => {
  const data = [1, 2, 3, 4, 5];

  it('should calculate WMA correctly', () => {
    const wma = new WMA('wma3', { period: 3 });
    const ds = new Dataset(data);

    // Dataset length is 5. Last value is 5.
    // Calculation uses last 3 values: 3, 4, 5.
    // (3*1 + 4*2 + 5*3) / 6 = (3+8+15)/6 = 26/6 = 4.333...

    const result = wma.calculate(ds);
    expect(result).toBeCloseTo(4.3333, 4);
  });

  it('should work with spread() and incremental calculation', () => {
    const wma = new WMA('wma3', { period: 3 });
    const ds = new Dataset(data);

    // Spread calculates for all points
    // i=0 (1): NaN
    // i=1 (2): NaN
    // i=2 (3): (1*1+2*2+3*3)/6 = 14/6 = 2.333...
    // i=3 (4): (2*1+3*2+4*3)/6 = 20/6 = 3.333...
    // i=4 (5): (3*1+4*2+5*3)/6 = 26/6 = 4.333...

    wma.spread(ds);

    expect(ds.at(0)?.getIndicator('wma3')).toBeNaN();
    expect(ds.at(1)?.getIndicator('wma3')).toBeNaN();
    expect(ds.at(2)?.getIndicator('wma3')).toBeCloseTo(2.3333, 4);
    expect(ds.at(3)?.getIndicator('wma3')).toBeCloseTo(3.3333, 4);
    expect(ds.at(4)?.getIndicator('wma3')).toBeCloseTo(4.3333, 4);
  });

  it('should work incrementally when adding new quotes', () => {
    const wma = new WMA('wma3', { period: 3 });
    const ds = new Dataset([1, 2, 3, 4, 5]);

    // Use apply() instead of spread() to register the indicator for future updates
    ds.apply(wma);

    // Add 6
    ds.add(6);
    // New WMA should be (4*1 + 5*2 + 6*3) / 6 = 32/6 = 5.333...

    const lastValue = ds.at(-1)?.getIndicator('wma3');
    expect(lastValue).toBeCloseTo(5.3333, 4);
  });
});
