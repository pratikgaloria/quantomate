import dotenv from 'dotenv';
import path from 'path';

// Load environment configurations from workspace root .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../../.env'), override: true });

import { runBacktest } from './services/backtestRunner';

async function test() {
  try {
    // Sunday, June 28, 2026. Market was closed.
    const startDateStr = '2026-06-28';
    const endDateStr = '2026-06-28';

    console.log(`Running backtest for NVDA on Sunday: ${startDateStr}`);

    const result = await runBacktest({
      strategyId: 'pivot-trend',
      parameters: {
        direction: 'both',
        useTrendFilter: false,
        trendFilterInterval: '1d'
      },
      stock: {
        symbol: 'NVDA',
        startDate: startDateStr,
        endDate: endDateStr,
        interval: '1m'
      },
      config: {
        capital: 100000
      }
    });

    console.log('Backtest Completed successfully!');
    console.log('Number of trades:', result.report.numberOfTrades);
    console.log('Result returns percentage:', result.report.returnsPercentage);
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

test();
