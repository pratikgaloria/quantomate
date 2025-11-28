#!/usr/bin/env tsx
import YahooFinance from 'yahoo-finance2';
import { Dataset, Backtest } from '@quantomate/core';
import { RSIMeanReversionStrategy } from './src';

const yahooFinance = new YahooFinance();

interface BacktestConfig {
  symbol: string;
  years: number;
  rsiPeriod: number;
  oversoldThreshold: number;
  overboughtThreshold: number;
  smaPeriod: number;
  useTrendFilter: boolean;
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
    rsiPeriod: 14,
    oversoldThreshold: 30,
    overboughtThreshold: 70,
    smaPeriod: 50,
    useTrendFilter: false,
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
      case '--rsi-period':
        config.rsiPeriod = parseInt(value, 10);
        break;
      case '--oversold':
        config.oversoldThreshold = parseInt(value, 10);
        break;
      case '--overbought':
        config.overboughtThreshold = parseInt(value, 10);
        break;
      case '--sma-period':
        config.smaPeriod = parseInt(value, 10);
        break;
      case '--use-trend-filter':
        config.useTrendFilter = value === 'true';
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
RSI Mean Reversion Backtest CLI

Usage: npx tsx backtest-rsi.ts [options]

Options:
  -s, --symbol <SYMBOL>           Stock symbol (default: NVDA)
  -y, --years <YEARS>             Number of years to backtest (default: 3)
  --rsi-period <PERIOD>           RSI period (default: 14)
  --oversold <THRESHOLD>          Oversold threshold (default: 30)
  --overbought <THRESHOLD>        Overbought threshold (default: 70)
  --sma-period <PERIOD>           SMA period for trend filter (default: 50)
  --use-trend-filter <true|false> Use SMA trend filter (default: false)
  --source <ATTR>                 Price attribute to use (default: close)
  -c, --capital <AMOUNT>          Initial capital (default: 10000)
  -h, --help                      Show this help message

Examples:
  npx tsx backtest-rsi.ts --symbol AAPL --years 5
  npx tsx backtest-rsi.ts -s TSLA -y 2 --oversold 25 --overbought 75
  npx tsx backtest-rsi.ts --symbol MSFT --use-trend-filter true
  `);
}

async function runBacktest(config: BacktestConfig) {
  console.log(`\n=== RSI Mean Reversion Backtest ===`);
  console.log(`Symbol: ${config.symbol}`);
  console.log(`Period: ${config.years} years`);
  console.log(`Strategy: RSI(${config.rsiPeriod}) < ${config.oversoldThreshold} (buy) / > ${config.overboughtThreshold} (sell)`);
  if (config.useTrendFilter) {
    console.log(`Trend Filter: SMA(${config.smaPeriod})`);
  }
  console.log(`Initial Capital: $${config.initialCapital.toLocaleString()}\n`);

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - config.years);

  try {
    console.log('Fetching historical data...\n');

    // Fetch historical data from Yahoo Finance
    const queryOptions = { period1: startDate, period2: endDate, interval: '1d' as const };
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

    // Create RSI Mean Reversion strategy
    const strategy = new RSIMeanReversionStrategy('rsi-mean-reversion', {
      rsiPeriod: config.rsiPeriod,
      oversoldThreshold: config.oversoldThreshold,
      overboughtThreshold: config.overboughtThreshold,
      smaPeriod: config.smaPeriod,
      useTrendFilter: config.useTrendFilter,
      source: config.source,
    });

    console.log('Running backtest...\n');

    // Create Backtest instance
    const backtest = new Backtest(dataset, strategy);

    // Run backtest with runner configuration
    const report = backtest.run({
      config: { 
        capital: config.initialCapital,
        name: `${config.symbol} RSI Mean Reversion Backtest`
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
    console.log(`Return %: ${report.returnsPercentage.toFixed(2)}%`);
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
