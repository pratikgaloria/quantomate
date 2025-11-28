#!/usr/bin/env tsx
import YahooFinance from 'yahoo-finance2';
import { Dataset, Backtest } from '@quantomate/core';
import { GoldenCrossStrategy } from './src';

const yahooFinance = new YahooFinance();

interface BacktestConfig {
  symbol: string;
  years: number;
  fastPeriod: number;
  slowPeriod: number;
  source: string;
  initialCapital: number;
}

interface HistoricalQuote {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose?: number;
}

function parseArgs(): BacktestConfig {
  const args = process.argv.slice(2);
  const config: BacktestConfig = {
    symbol: 'NVDA',
    years: 3,
    fastPeriod: 9,
    slowPeriod: 20,
    source: 'close',
    initialCapital: 10000,
  };

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];

    switch (key) {
      case '--symbol':
      case '-s':
        config.symbol = value;
        break;
      case '--years':
      case '-y':
        config.years = parseInt(value, 10);
        break;
      case '--fast':
      case '-f':
        config.fastPeriod = parseInt(value, 10);
        break;
      case '--slow':
      case '-l':
        config.slowPeriod = parseInt(value, 10);
        break;
      case '--source':
        config.source = value;
        break;
      case '--capital':
      case '-c':
        config.initialCapital = parseFloat(value);
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  return config;
}

function printHelp() {
  console.log(`
Golden Cross Backtest CLI

Usage: npx tsx backtest.ts [options]

Options:
  -s, --symbol <SYMBOL>      Stock symbol (default: NVDA)
  -y, --years <YEARS>        Number of years to backtest (default: 3)
  -f, --fast <PERIOD>        Fast EMA period (default: 9)
  -l, --slow <PERIOD>        Slow SMA period (default: 20)
  --source <ATTR>            Price attribute to use (default: close)
  -c, --capital <AMOUNT>     Initial capital (default: 10000)
  -h, --help                 Show this help message

Examples:
  npx tsx backtest.ts --symbol AAPL --years 5
  npx tsx backtest.ts -s TSLA -y 2 -f 12 -l 26
  npx tsx backtest.ts --symbol MSFT --capital 50000
  `);
}

async function runBacktest(config: BacktestConfig) {
  console.log(`\n=== Golden Cross Backtest ===`);
  console.log(`Symbol: ${config.symbol}`);
  console.log(`Period: ${config.years} years`);
  console.log(`Strategy: ${config.fastPeriod} EMA / ${config.slowPeriod} SMA crossover`);
  console.log(`Initial Capital: $${config.initialCapital.toLocaleString()}\n`);

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - config.years);

  try {
    console.log('Fetching historical data...\n');

    // Fetch historical data from Yahoo Finance
    const queryOptions = { period1: startDate, period2: endDate, interval: '1d' };
    const result = await yahooFinance.historical(config.symbol, queryOptions) as HistoricalQuote[];

    console.log(`Fetched ${result.length} data points\n`);

    // Convert to dataset format
    const quotes = result.map((quote) => ({
      date: quote.date,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume,
    }));

    const dataset = new Dataset(quotes);

    // Create Golden Cross strategy
    const strategy = new GoldenCrossStrategy('golden-cross', {
      fastPeriod: config.fastPeriod,
      slowPeriod: config.slowPeriod,
      source: config.source,
    });

    console.log('Running backtest...\n');

    // Create Backtest instance
    const backtest = new Backtest(dataset, strategy);

    // Run backtest with runner configuration
    const report = backtest.run({
      config: { 
        capital: config.initialCapital,
        name: `${config.symbol} Golden Cross Backtest`
      },
      onEntry: (quote) => {
        return quote.value[config.source as keyof typeof quote.value] as number;
      },
      onExit: (quote) => {
        return quote.value[config.source as keyof typeof quote.value] as number;
      },
    });

    // Display results
    console.log('=== Results ===');
    console.log(`Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
    console.log(`Number of Trades: ${report.numberOfTrades}`);
    console.log(`Returns: $${report.returns.toFixed(2)}`);
    console.log(`Final Capital: $${report.finalCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log(`Return %: ${((report.returns / config.initialCapital) * 100).toFixed(2)}%`);
    console.log('');
  } catch (error) {
    console.error('Error running backtest:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    process.exit(1);
  }
}

// Parse arguments and run backtest
const config = parseArgs();
runBacktest(config).catch(console.error);
