import { Dataset } from '@quantomate/core';
import { BB } from '../src';

describe('BB (Bollinger Bands)', () => {
  const data = [
    22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15,
    22.39, 22.38, 22.61, 23.36, 24.05, 23.75, 23.83, 23.95, 23.63, 23.82, 23.87,
    23.65, 23.19, 23.10, 23.33, 22.68, 23.10, 22.40, 22.17,
  ];

  it('should calculate all bands correctly and maintain relationships', () => {
    const ds = new Dataset(data);
    const period = 20;
    const multiplier = 2;

    const upperBB = new BB('bb_upper', { period, multiplier, band: 'upper' });
    const middleBB = new BB('bb_middle', { period, multiplier, band: 'middle' });
    const lowerBB = new BB('bb_lower', { period, multiplier, band: 'lower' });

    const upper = upperBB.calculate(ds);
    const middle = middleBB.calculate(ds);
    const lower = lowerBB.calculate(ds);

    // Verify all are numbers
    expect(typeof upper).toBe('number');
    expect(typeof middle).toBe('number');
    expect(typeof lower).toBe('number');

    // Verify relationships: upper > middle > lower
    expect(upper).toBeGreaterThan(middle);
    expect(middle).toBeGreaterThan(lower);
  });

  it('should work with spread()', () => {
    const ds = new Dataset(data);
    const bb = new BB('bb_middle', { period: 20, multiplier: 2, band: 'middle' });
    bb.spread(ds);

    const lastValue = ds.at(-1)?.getIndicator('bb_middle');
    expect(lastValue).toBeDefined();
    expect(typeof lastValue).toBe('number');
  });
});
