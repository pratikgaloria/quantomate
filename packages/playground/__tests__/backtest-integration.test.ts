import { Dataset, Backtest } from '@quantomate/core';
import { RSIMeanReversionStrategy } from '@quantomate/library';
import { fetchStockData } from '../../ui/server/src/services/stockDataFetcher';
import { DataService, YahooFinanceProvider } from '@quantomate/data';

jest.mock('yahoo-finance2', () => {
  return jest.fn().mockImplementation(() => ({
    quote: jest.fn().mockResolvedValue({
      exchangeTimezoneName: 'Asia/Kolkata'
    })
  }));
}, { virtual: true });

jest.mock('@quantomate/data', () => {
  const original = jest.requireActual('@quantomate/data');
  return {
    ...original,
    YahooFinanceProvider: jest.fn().mockImplementation(() => ({
      getHistoricalData: jest.fn().mockResolvedValue([
        // June 5 (Friday) 1m bars
        { date: new Date('2026-06-05T09:15:00Z'), open: 100, high: 101, low: 99, close: 100, volume: 100 },
        { date: new Date('2026-06-05T15:30:00Z'), open: 100, high: 101, low: 99, close: 100, volume: 100 },
        // June 8 (Monday) 1m bars
        { date: new Date('2026-06-08T09:15:00Z'), open: 100, high: 101, low: 99, close: 100, volume: 100 },
        { date: new Date('2026-06-08T15:30:00Z'), open: 102, high: 103, low: 101, close: 102, volume: 100 },
      ])
    }))
  };
});

describe('Backtest Integration Tests', () => {
  beforeAll(() => {
    DataService.provider = new YahooFinanceProvider();
  });

  it('should include intraday data on the end date and build exit context successfully', async () => {
    const symbol = '^NSEBANK';
    const startDate = '2026-06-08';
    const endDate = '2026-06-08';
    const interval = '1m';

    // 1. Verify fetchStockData includes June 8 data
    const stockData = await fetchStockData(symbol, startDate, endDate, interval);
    
    // We expect the candles on June 8 to be returned
    expect(stockData.length).toBe(2);
    expect(stockData[0].date.toISOString()).toBe('2026-06-08T09:15:00.000Z');
    expect(stockData[1].date.toISOString()).toBe('2026-06-08T15:30:00.000Z');

    // 2. Run a full backtest and verify report metrics are populated correctly
    const customCandles = [
      { date: new Date('2026-06-08T09:15:00Z'), open: 100, high: 100, low: 100, close: 100, volume: 100 },
      { date: new Date('2026-06-08T09:16:00Z'), open: 100, high: 100, low: 100, close: 90, volume: 100 },
      { date: new Date('2026-06-08T09:17:00Z'), open: 90, high: 90, low: 90, close: 90, volume: 100 },
      { date: new Date('2026-06-08T09:18:00Z'), open: 90, high: 120, low: 90, close: 120, volume: 100 },
      { date: new Date('2026-06-08T09:19:00Z'), open: 120, high: 120, low: 120, close: 120, volume: 100 }
    ];

    const dataset = new Dataset(customCandles, { timestampField: 'date' });
    const strategy = new RSIMeanReversionStrategy('RSI Mean Reversion', {
      rsiPeriod: 2,
      oversoldThreshold: 30,
      overboughtThreshold: 70,
      direction: 'long',
      useTrendFilter: false
    });

    const backtest = new Backtest(dataset, strategy);
    const report = backtest.run({
      config: { capital: 10000 },
      onEntry: (q, i, quotes) => quotes[i + 1]?.value.open || q.value.close,
      onExit: (q, i, quotes) => quotes[i + 1]?.value.open || q.value.close
    });

    // Verify trades are populated
    expect(report.numberOfTrades).toBeGreaterThanOrEqual(1);
    
    // Verify that the exit trade has exitContext fully defined
    const exitTrade = report.trades.find(t => t.type === 'exit');
    expect(exitTrade).toBeDefined();
    expect(exitTrade?.exitContext).toBeDefined();
    expect(exitTrade?.exitContext?.entryPrice).toBe(90);
    expect(exitTrade?.exitContext?.exitPrice).toBe(120);
    expect(exitTrade?.exitContext?.priceChange).toBe(30);
    expect(exitTrade?.exitContext?.priceChangePercent).toBe(33.33333333333333);
  });
});
