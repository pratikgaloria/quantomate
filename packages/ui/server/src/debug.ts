import { GoldenCrossStrategy } from '@quantomate/library';
import { Dataset } from '@quantomate/core';

console.log('Checking GoldenCrossStrategy...');
const strategy = new GoldenCrossStrategy('test');
console.log('Strategy name:', strategy.name);
console.log('Has scan method:', typeof (strategy as any).scan);

const dataset = new Dataset([{ date: new Date(), close: 100, open: 100, high: 100, low: 100, volume: 100 }]);
try {
    const result = strategy.scan(dataset);
    console.log('Scan call successful, result:', result);
} catch (e) {
    console.error('Scan call failed:', e);
}
