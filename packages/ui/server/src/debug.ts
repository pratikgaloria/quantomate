import { BarSeries, Bar } from '@quantomate/core';
import { GoldenCrossStrategy } from '@quantomate/library';

console.log('Checking GoldenCrossStrategy...');
const strategy = new GoldenCrossStrategy('test');
console.log('Strategy name:', strategy.name);

const bars: Bar[] = [{ timestamp: Date.now(), close: 100, open: 100, high: 100, low: 100, volume: 100 }];
const series = new BarSeries(bars);
try {
    const result = strategy.evaluate(series, 0, {
      getIndicatorSeries: () => undefined,
      getSecondaryBarSeries: () => undefined,
    });
    console.log('Evaluate call successful, result:', result);
} catch (e) {
    console.error('Evaluate call failed:', e);
}

