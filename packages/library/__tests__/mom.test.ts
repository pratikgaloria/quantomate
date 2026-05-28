import { Dataset } from '@quantomate/core';
import { MOM } from '../src';

describe('MOM', () => {
  const data = [10, 12, 11, 15];

  it('should calculate MOM correctly', () => {
    const mom = new MOM('mom2', { period: 2 });
    const ds = new Dataset(data);

    // Dataset length 4. Last value 15.
    // Past value (index 4-1-2 = 1) is 12.
    // MOM = 15 - 12 = 3.

    const result = mom.calculate(ds);
    expect(result).toBeCloseTo(3, 4);
  });

  it('should work with spread()', () => {
    const mom = new MOM('mom2', { period: 2 });
    const ds = new Dataset(data);

    // i=0,1: NaN
    // i=2: 11 - 10 = 1
    // i=3: 15 - 12 = 3

    mom.spread(ds);

    expect(ds.at(0)?.getIndicator('mom2')).toBeNaN();
    expect(ds.at(1)?.getIndicator('mom2')).toBeNaN();
    expect(ds.at(2)?.getIndicator('mom2')).toBeCloseTo(1, 4);
    expect(ds.at(3)?.getIndicator('mom2')).toBeCloseTo(3, 4);
  });

  it('should work incrementally when adding new quotes', () => {
    const mom = new MOM('mom2', { period: 2 });
    const ds = new Dataset([10, 12, 11, 15]);

    ds.apply(mom);

    // Add 13
    ds.add(13);
    // MOM = 13 - 11 = 2.

    const lastValue = ds.at(-1)?.getIndicator('mom2');
    expect(lastValue).toBeCloseTo(2, 4);
  });
});
