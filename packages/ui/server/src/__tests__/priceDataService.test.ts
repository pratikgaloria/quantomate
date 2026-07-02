import assert from 'node:assert';
import { resolvePeriodDates } from '../services/priceDataService';

function testResolvePeriodDates() {
  console.log('Running testResolvePeriodDates...');

  const today = new Date();
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // 1. Test '1d' period
  {
    const dates = resolvePeriodDates('1d');
    const expectedStart = new Date(today);
    expectedStart.setDate(today.getDate() - 1);
    assert.strictEqual(dates.endDate, fmt(today));
    assert.strictEqual(dates.startDate, fmt(expectedStart));
  }

  // 2. Test '1w' period
  {
    const dates = resolvePeriodDates('1w');
    const expectedStart = new Date(today);
    expectedStart.setDate(today.getDate() - 7);
    assert.strictEqual(dates.endDate, fmt(today));
    assert.strictEqual(dates.startDate, fmt(expectedStart));
  }

  // 3. Test '1m' period
  {
    const dates = resolvePeriodDates('1m');
    const expectedStart = new Date(today);
    expectedStart.setMonth(today.getMonth() - 1);
    assert.strictEqual(dates.endDate, fmt(today));
    assert.strictEqual(dates.startDate, fmt(expectedStart));
  }

  // 4. Test case insensitivity and mapping
  {
    const dates = resolvePeriodDates('1WK');
    const expectedStart = new Date(today);
    expectedStart.setDate(today.getDate() - 7);
    assert.strictEqual(dates.startDate, fmt(expectedStart));
  }

  console.log('testResolvePeriodDates passed!');
}

async function main() {
  try {
    testResolvePeriodDates();
    console.log('All priceDataService tests completed successfully!');
  } catch (err: any) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

main();
