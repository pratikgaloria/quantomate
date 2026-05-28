import { Dataset } from '@quantomate/core';
import { DEMA } from '../src';

describe('DEMA', () => {
  const data = [1, 2, 3, 4, 5];

  it('should calculate DEMA correctly', () => {
    const dema = new DEMA('dema3', { period: 3 });
    const ds = new Dataset(data);

    // Period 3. Length 5.
    // Index 4 is valid.
    // DEMA should be 5 (zero lag for linear trend).

    const result = dema.calculate(ds);
    expect(result).toBeCloseTo(5, 4);
  });

  it('should work with spread()', () => {
    const dema = new DEMA('dema3', { period: 3 });
    const ds = new Dataset(data);

    dema.spread(ds);

    // Valid from index 4 (2*period - 2 = 4)
    expect(ds.at(0)?.getIndicator('dema3')).toBeNaN();
    expect(ds.at(1)?.getIndicator('dema3')).toBeNaN();
    expect(ds.at(2)?.getIndicator('dema3')).toBeNaN();
    expect(ds.at(3)?.getIndicator('dema3')).toBeNaN();
    expect(ds.at(4)?.getIndicator('dema3')).toBeCloseTo(5, 4);
  });

  it('should work incrementally when adding new quotes', () => {
    const dema = new DEMA('dema3', { period: 3 });
    const ds = new Dataset([1, 2, 3, 4, 5]);

    ds.apply(dema);

    // Add 6
    ds.add(6);
    // DEMA should be 6.

    const lastValue = ds.at(-1)?.getIndicator('dema3');
    expect(lastValue).toBeCloseTo(6, 4);
  });
});
