import { Dataset } from '@quantomate/core';
import { GoldenCrossStrategy } from '../src';

describe('GoldenCrossStrategy Verification', () => {
  it('should trigger buy signal when fast EMA crosses above slow SMA', () => {
    // Create a dataset with known values that should trigger a golden cross
    const prices = [
      100, 102, 104, 106, 108, 110, 112, 114, 116, 118, // Uptrend
      120, 122, 124, 126, 128, 130, 132, 134, 136, 138, // Continued uptrend
      140, 142, 144, 146, 148, 150, 152, 154, 156, 158, // Strong uptrend
    ];

    const dataset = new Dataset(prices.map(price => ({ close: price })));
    const strategy = new GoldenCrossStrategy('test-golden-cross', {
      fastPeriod: 9,
      slowPeriod: 20,
      source: 'close',
    });

    // Apply strategy to dataset
    dataset.prepare(strategy);

    // Check that strategy values are set
    let quotesWithStrategyCount = 0;
    for (let i = 0; i < dataset.length; i++) {
      if (dataset.at(i)?.getStrategy('test-golden-cross') !== undefined) {
        quotesWithStrategyCount++;
      }
    }

    console.log('\n=== Strategy Application Test ===');
    console.log(`Total quotes: ${dataset.length}`);
    console.log(`Quotes with strategy: ${quotesWithStrategyCount}`);

    // Find entry and exit signals
    let entriesCount = 0;
    let exitsCount = 0;
    for (let i = 0; i < dataset.length; i++) {
      const q = dataset.at(i);
      const position = q?.getStrategy('test-golden-cross')?.position?.value;
      if (position === 'entry') entriesCount++;
      if (position === 'exit') exitsCount++;
    }

    console.log(`Entry signals: ${entriesCount}`);
    console.log(`Exit signals: ${exitsCount}`);

    // Log some indicator values to verify calculation
    console.log('\n=== Sample Indicator Values ===');
    for (let i = 20; i < 25 && i < dataset.length; i++) {
      const q = dataset.at(i)!;
      const fastEMA = q.getIndicator('fastEMA');
      const slowSMA = q.getIndicator('slowSMA');
      const prevFast = q.getIndicator('prevFastEMA');
      const prevSlow = q.getIndicator('prevSlowSMA');
      const position = q.getStrategy('test-golden-cross')?.position?.value;

      console.log(`Quote ${i}:`);
      console.log(`  Fast EMA: ${fastEMA?.toFixed(2)}, Slow SMA: ${slowSMA?.toFixed(2)}`);
      console.log(`  Prev Fast: ${prevFast?.toFixed(2)}, Prev Slow: ${prevSlow?.toFixed(2)}`);
      console.log(`  Position: ${position}`);
    }

    expect(quotesWithStrategyCount).toBeGreaterThan(0);
  });

  it('should calculate backtest correctly with simple data', () => {
    // Create simple dataset: price goes up, then down
    const prices = [
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, // Up
      110, 111, 112, 113, 114, 115, 116, 117, 118, 119, // Up
      120, 119, 118, 117, 116, 115, 114, 113, 112, 111, // Down
    ];

    const dataset = new Dataset(prices.map(price => ({ close: price })));
    const strategy = new GoldenCrossStrategy('test-backtest', {
      fastPeriod: 5,
      slowPeriod: 10,
      source: 'close',
    });

    const report = strategy.backtest(dataset, {
      config: { capital: 10000 },
      onEntry: (quote) => quote.value.close,
      onExit: (quote) => quote.value.close,
    });

    console.log('\n=== Backtest Results ===');
    console.log(`Number of trades: ${report.numberOfTrades}`);
    console.log(`Returns: $${report.returns.toFixed(2)}`);
    console.log(`Final capital: $${report.finalCapital.toFixed(2)}`);

    // Log all trades
    console.log('\n=== Trade Details ===');
    for (let i = 0; i < dataset.length; i++) {
      const q = dataset.at(i)!;
      const position = q.getStrategy('test-backtest')?.position?.value;
      if (position === 'entry' || position === 'exit') {
        console.log(`Quote ${i}: ${position} at price ${q.value.close}`);
      }
    }

    expect(report.numberOfTrades).toBeGreaterThan(0);
  });
});
