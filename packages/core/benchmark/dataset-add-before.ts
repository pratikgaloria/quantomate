import { Dataset } from '../src/dataset';
import { Indicator } from '../src/indicator';
import { Quote } from '../src/quote';

// Simple SMA indicator for testing
class SMA extends Indicator<{ period: number }, number> {
  constructor(period: number = 20) {
    super(
      'SMA',
      (dataset: Dataset<number>) => {
        const period = this.params?.period || 20;
        if (dataset.length < period) return NaN;
        
        let sum = 0;
        for (let i = dataset.length - period; i < dataset.length; i++) {
          sum += dataset.valueAt(i) as number;
        }
        return sum / period;
      },
      { params: { period } }
    );
  }
}

// Benchmark Dataset.add() performance
function benchmarkDatasetAdd(dataSize: number, numIndicators: number) {
  console.log(`\n=== Benchmark: ${dataSize} quotes, ${numIndicators} indicators ===`);
  
  const dataset = new Dataset<number>();
  
  // Add indicators
  const indicators: Indicator<any, number>[] = [];
  for (let i = 0; i < numIndicators; i++) {
    indicators.push(new SMA(20 + i));
  }
  
  indicators.forEach(ind => {
    dataset.setIndicator({ name: ind.name, indicator: ind });
  });
  
  // Benchmark adding quotes
  console.time('Dataset.add()');
  
  for (let i = 0; i < dataSize; i++) {
    const quote = new Quote(100 + Math.random() * 10);
    dataset.add(quote);
  }
  
  console.timeEnd('Dataset.add()');
  
  // Calculate average time per quote
  const avgTime = process.hrtime.bigint();
  const quote = new Quote(105);
  const start = process.hrtime.bigint();
  dataset.add(quote);
  const end = process.hrtime.bigint();
  const timePerQuote = Number(end - start) / 1_000_000; // Convert to ms
  
  console.log(`Average time per quote: ${timePerQuote.toFixed(3)}ms`);
  console.log(`Total quotes: ${dataset.length}`);
  
  // Verify indicators are calculated
  const lastQuote = dataset.at(-1);
  console.log(`Last quote indicators:`, Object.keys(lastQuote?.indicators || {}));
  
  return {
    dataSize,
    numIndicators,
    totalTime: timePerQuote * dataSize,
    timePerQuote
  };
}

// Run benchmarks
console.log('📊 BEFORE OPTIMIZATION - Dataset.add() Performance\n');
console.log('This will show O(n²) complexity - time increases quadratically\n');

const results = [
  benchmarkDatasetAdd(100, 2),
  benchmarkDatasetAdd(500, 2),
  benchmarkDatasetAdd(1000, 2),
  benchmarkDatasetAdd(100, 5),
  benchmarkDatasetAdd(500, 5),
];

console.log('\n=== Summary ===');
console.log('Data Size | Indicators | Time per Quote | Total Time');
console.log('----------|------------|----------------|------------');
results.forEach(r => {
  console.log(
    `${r.dataSize.toString().padEnd(9)} | ` +
    `${r.numIndicators.toString().padEnd(10)} | ` +
    `${r.timePerQuote.toFixed(3)}ms${' '.repeat(10)} | ` +
    `${r.totalTime.toFixed(0)}ms`
  );
});

console.log('\n⚠️  Notice: Time per quote INCREASES as dataset grows (O(n²) complexity)');
console.log('Expected: ~0.01ms per quote should stay constant after optimization\n');
