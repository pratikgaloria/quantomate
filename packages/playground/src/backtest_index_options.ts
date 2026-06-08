import { Dataset, Backtest } from '@quantomate/core';
import { YahooFinanceProvider } from '@quantomate/data';
import { IndexOptionMomentumStrategy, IndexOptionRsiReversionStrategy } from '@quantomate/library';

async function runBacktestForSymbolAndInterval(
  provider: YahooFinanceProvider,
  symbol: string,
  symbolName: string,
  interval: string,
  startDate: Date,
  endDate: Date
) {
  console.log(`\n==================================================`);
  console.log(`Fetching ${interval} data for ${symbolName} (${symbol})`);
  console.log(`Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  console.log(`==================================================`);

  let data;
  try {
    data = await provider.getHistoricalData(symbol, startDate, endDate, interval);
  } catch (error: any) {
    console.error(`Error fetching historical data: ${error.message}`);
    return;
  }

  if (!data || data.length === 0) {
    console.warn(`No historical data returned for ${symbol}`);
    return;
  }

  console.log(`Fetched ${data.length} candles.`);

  // Map historical prices into the correct structure for core Dataset
  const quotes = data.map((q) => ({
    date: q.date,
    open: q.open,
    high: q.high,
    low: q.low,
    close: q.close,
    volume: q.volume,
  }));

  // Create strategies
  const momentumStrategy = new IndexOptionMomentumStrategy('IndexOptionMomentum', {
    fastPeriod: 9,
    slowPeriod: 20,
    source: 'close'
  });

  const rsiStrategy = new IndexOptionRsiReversionStrategy('IndexOptionRsiReversion', {
    rsiPeriod: 14,
    oversoldThreshold: 30,
    overboughtThreshold: 70,
    source: 'close'
  });

  const strategies = [
    { name: 'EMA Crossover (IndexOptionMomentum)', instance: momentumStrategy },
    { name: 'RSI Reversion (IndexOptionRsiReversion)', instance: rsiStrategy }
  ];

  for (const strat of strategies) {
    console.log(`\nRunning Backtest: ${strat.name} on ${symbolName} (${interval})`);
    
    // Create new Dataset instance for each run because prepare() mutates columns
    const dataset = new Dataset(quotes, { timestampField: 'date' });
    const backtest = new Backtest(dataset, strat.instance);

    try {
      const report = backtest.run({
        config: {
          capital: 100000, // 100,000 INR starting capital
          entryPriceField: 'close',
          slippage: 0.0005, // 0.05% slippage mapping typical execution cost
        },
        onEntry: (q, i, quotes) => {
          // Entry price is next quote open for realistic fill, or current close
          const nextQuote = quotes[i + 1];
          return nextQuote ? (nextQuote.value as any).open : (q.value as any).close;
        },
        onExit: (q, i, quotes) => {
          const nextQuote = quotes[i + 1];
          return nextQuote ? (nextQuote.value as any).open : (q.value as any).close;
        }
      });

      const summary = report.summary();
      const risk = report.getRiskMetrics();

      console.log(`  Initial Capital:   INR ${summary.initialCapital.toFixed(2)}`);
      console.log(`  Final Capital:     INR ${summary.finalCapital.toFixed(2)}`);
      console.log(`  Net Return:        INR ${(summary.finalCapital - summary.initialCapital).toFixed(2)} (${summary.returnsPercentage.toFixed(2)}%)`);
      console.log(`  Total Trades:      ${summary.totalTrades}`);
      console.log(`  Winning Rate:      ${(summary.winningRate * 100).toFixed(2)}%`);
      console.log(`  Commissions:       INR ${summary.totalCommissions.toFixed(2)}`);
      console.log(`  Slippage Cost:     INR ${summary.totalSlippage.toFixed(2)}`);
      console.log(`  Strategy Exits:    ${risk.strategyExits}`);
    } catch (e: any) {
      console.error(`  Backtest execution failed: ${e.message}`);
    }
  }
}

async function main() {
  console.log('=== Start Options Backtesting Playground ===');
  
  const provider = new YahooFinanceProvider();
  const today = new Date();

  // 1. Daily (1d) timeframe over the last 2 years
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(today.getFullYear() - 2);

  // 2. Intraday (15m) timeframe over the last 30 days (Yahoo Finance allows 15m up to 60 days, but 29 days is safe)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 29);

  // Tickers on Yahoo Finance
  const targets = [
    { symbol: '^NSEI', name: 'Nifty 50' },
    { symbol: '^NSEBANK', name: 'Nifty Bank' }
  ];

  for (const target of targets) {
    // 1d timeframe
    await runBacktestForSymbolAndInterval(
      provider,
      target.symbol,
      target.name,
      '1d',
      twoYearsAgo,
      today
    );

    // 15m timeframe
    await runBacktestForSymbolAndInterval(
      provider,
      target.symbol,
      target.name,
      '15m',
      thirtyDaysAgo,
      today
    );
  }

  console.log('\n=== Options Backtesting Playground Completed ===');
}

main().catch(console.error);
