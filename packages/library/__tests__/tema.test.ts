import { Dataset } from '@quantomate/core';
import { TEMA } from '../src';

describe('TEMA', () => {
  const data = [1, 2, 3, 4, 5, 6, 7];

  it('should calculate TEMA correctly', () => {
    const tema = new TEMA('tema3', { period: 3 });
    const ds = new Dataset(data);

    // Period 3. Length 7.
    // Index 6 is valid (3*3 - 3 = 6).
    // TEMA should be 7 (zero lag for linear trend).

    const result = tema.calculate(ds);
    expect(result).toBeCloseTo(7, 4);
  });

  it('should work with spread()', () => {
    const tema = new TEMA('tema3', { period: 3 });
    const ds = new Dataset(data);

    tema.spread(ds);

    // Valid from index 6
    expect(ds.at(0)?.getIndicator('tema3')).toBeNaN();
    expect(ds.at(5)?.getIndicator('tema3')).toBeNaN();
    expect(ds.at(6)?.getIndicator('tema3')).toBeCloseTo(7, 4);
  });

  it('should work incrementally when adding new quotes', () => {
    const tema = new TEMA('tema3', { period: 3 });
    const ds = new Dataset([1, 2, 3, 4, 5, 6, 7]);

    ds.apply(tema);

    // Add 8
    ds.add(8);
    // TEMA should be 8.

    const lastValue = ds.at(-1)?.getIndicator('tema3');
    expect(lastValue).toBeCloseTo(8, 4);
  });
});
