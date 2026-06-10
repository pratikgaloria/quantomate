import { Dataset } from '@quantomate/core';
import { BearPutSpreadStrategy } from '../src';

describe('BearPutSpreadStrategy Verification', () => {
  it('should trigger entry on bearish crossover and exit early when RSI is oversold', () => {
    const strategy = new BearPutSpreadStrategy('test-bps', {
      fastPeriod: 3,
      slowPeriod: 5,
      rsiPeriod: 3,
      rsiOversold: 35,
      useRsiExit: true,
      source: 'close',
      strikeOffset: 2
    });

    // We simulate a price sequence that triggers a bearish crossover, and then drops RSI to oversold levels
    const prices = [100, 101, 102, 103, 104, 95, 90, 85, 80, 78];
    const dataset = new Dataset(prices.map(p => ({ close: p })));

    // Apply strategy to dataset
    dataset.prepare(strategy);

    let entryIndex = -1;
    let exitIndex = -1;

    for (let i = 0; i < dataset.length; i++) {
      const q = dataset.at(i);
      const position = q?.getStrategy('test-bps')?.position?.value;
      if (position === 'entry') {
        entryIndex = i;
      }
      if (position === 'exit' && entryIndex !== -1 && exitIndex === -1) {
        exitIndex = i;
      }
    }

    console.log(`\n=== BearPutSpread Verification Output ===`);
    console.log(`Total quotes: ${dataset.length}`);
    console.log(`Entry Index: ${entryIndex}`);
    console.log(`Exit Index: ${exitIndex}`);

    for (let i = 0; i < dataset.length; i++) {
      const q = dataset.at(i)!;
      const fast = q.getIndicator('fastEMA');
      const slow = q.getIndicator('slowEMA');
      const rsiVal = q.getIndicator('rsi');
      const pos = q.getStrategy('test-bps')?.position?.value;
      console.log(`Bar ${i} [Price: ${q.value.close}] - Fast: ${fast?.toFixed(2)}, Slow: ${slow?.toFixed(2)}, RSI: ${rsiVal?.toFixed(2)} - Position: ${pos}`);
    }

    // Verify signals were triggered
    expect(entryIndex).toBeGreaterThan(-1);
    expect(exitIndex).toBeGreaterThan(entryIndex);

    // Verify early exit reason was because RSI reached oversold
    const exitQuote = dataset.at(exitIndex)!;
    const rsiAtExit = exitQuote.getIndicator('rsi');
    expect(rsiAtExit).toBeLessThanOrEqual(35);
  });
});
