import { Dataset, Quote, Indicator, Strategy, TradePosition, StrategyValue } from '@quantomate/core';
import { BotQuoteView, ChildDataset } from '../utils/NamespacedDataset';

describe('BotQuoteView', () => {
  it('should delegate basic fields and namespace strategies correctly', () => {
    const rawQuote = new Quote(100, 1500000);
    rawQuote.setIndicator('RSI', 30);
    rawQuote.setStrategy('bot1:MACD', new StrategyValue(new TradePosition('entry')));
    rawQuote.setStrategy('bot2:MACD', new StrategyValue(new TradePosition('exit')));

    const view1 = new BotQuoteView('bot1', rawQuote);
    const view2 = new BotQuoteView('bot2', rawQuote);

    // Value and timestamp delegation
    expect(view1.value).toBe(100);
    expect(view1.timestamp).toBe(1500000);

    // Indicator delegation
    expect(view1.getIndicator('RSI')).toBe(30);

    // Namespaced strategies
    expect(view1.getStrategy('MACD')?.position.value).toBe('entry');
    expect(view2.getStrategy('MACD')?.position.value).toBe('exit');

    // Setting strategy namespaced
    view1.setStrategy('MACD', new StrategyValue(new TradePosition('hold')));
    expect(rawQuote.getStrategy('bot1:MACD')?.position.value).toBe('hold');
    expect(view1.getStrategy('MACD')?.position.value).toBe('hold');
    expect(view2.getStrategy('MACD')?.position.value).toBe('exit');

    // Checking strategies getter filtered correctly
    expect(view1.strategies['MACD']?.position.value).toBe('hold');
    expect(view2.strategies['MACD']?.position.value).toBe('exit');
  });
});

describe('ChildDataset', () => {
  it('should delegate and isolate strategy states properly', () => {
    // 1. Setup parent dataset and basic data
    const parent = new Dataset<number>();
    parent.add(10, 1000);
    parent.add(20, 2000);

    // 2. Setup indicator and strategies
    const mockIndicator = new Indicator<any, number>('SMA', (ds) => {
      const lastVal = ds.valueAt(-1);
      return lastVal * 2;
    });

    const strategy1 = new Strategy('Str1', {
      entryWhen: (quote) => quote.value > 15,
      direction: 'long'
    });

    const strategy2 = new Strategy('Str2', {
      entryWhen: (quote) => quote.value > 25,
      direction: 'long'
    });

    // 3. Create child datasets
    const child1 = new ChildDataset('bot1', parent);
    const child2 = new ChildDataset('bot2', parent);

    // Prepare child1 with strategy1 and child2 with strategy2
    child1.prepare(strategy1);
    child2.prepare(strategy2);

    // Check sizes match parent
    expect(child1.length).toBe(2);
    expect(child2.length).toBe(2);

    // Check strategy isolation for existing data
    // For quote at index 1 (value 20):
    // strategy1 (threshold > 15) should trigger entry
    // strategy2 (threshold > 25) should trigger idle
    expect(child1.at(1)?.getStrategy('Str1')?.position.value).toBe('entry');
    expect(child2.at(1)?.getStrategy('Str2')?.position.value).toBe('idle');

    // 4. Test indicator calculation sharing
    child1.apply(mockIndicator);
    // Indicator is registered on parent via getOrRegisterIndicator
    expect(parent.indicators.some((ind) => ind.name === 'SMA')).toBe(true);
    expect(child1.indicators.some((ind) => ind.name === 'SMA')).toBe(true);
    expect(child2.indicators.some((ind) => ind.name === 'SMA')).toBe(true);

    // Indicators values exist on quotes retrieved from child datasets
    expect(child1.at(0)?.getIndicator('SMA')).toBe(20);
    expect(child2.at(0)?.getIndicator('SMA')).toBe(20);

    // 5. Test adding a quote
    // Adding to child1
    child1.add(30, 3000);

    // Parent length is incremented to 3
    expect(parent.length).toBe(3);
    expect(child1.length).toBe(3);
    expect(child2.length).toBe(3);

    // SMA indicator value is calculated on parent and reflected in child2 as well
    expect(child1.at(2)?.getIndicator('SMA')).toBe(60);
    expect(child2.at(2)?.getIndicator('SMA')).toBe(60);

    // Strategy 1 ran for bot1, value 30 > 15 so it transitioned from entry to hold
    expect(child1.at(2)?.getStrategy('Str1')?.position.value).toBe('hold');

    // Strategy 2 HAS NOT run yet on the new quote for bot2!
    // Since child2.add was not called, bot2 strategy value for index 2 should be undefined or not run
    expect(child2.at(2)?.getStrategy('Str2')).toBeUndefined();

    // Now call child2.add for the same timestamp. It should NOT duplicate parent entry, but run bot2 strategy
    child2.add(30, 3000);
    expect(parent.length).toBe(3); // still 3, no duplicates!
    expect(child2.at(2)?.getStrategy('Str2')?.position.value).toBe('entry'); // 30 > 25, triggers entry

    // 6. Test mutateAt
    const mutatedQuote = new Quote(40, 3000);
    mutatedQuote.setIndicator('SMA', 80);
    mutatedQuote.setStrategy('Str1', new StrategyValue(new TradePosition('exit')));

    child1.mutateAt(2, mutatedQuote);

    // Checks that values and indicators on parent are updated
    expect(parent.valueAt(2)).toBe(40);
    expect(child2.at(2)?.getIndicator('SMA')).toBe(80);

    // Checks that child1's strategy is updated namespaced
    expect(child1.at(2)?.getStrategy('Str1')?.position.value).toBe('exit');
    // But child2's strategy is completely untouched!
    expect(child2.at(2)?.getStrategy('Str2')?.position.value).toBe('entry');
  });
});
