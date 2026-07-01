import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { runBacktest } from '../../ui/server/src/services/backtestRunner';

describe('Pivot Trend Test Run', () => {
  it('should run backtest for yesterday and today', async () => {
    console.log("Running backtest for yesterday 2026-06-25:");
    try {
      const yestResult = await runBacktest({
        strategyId: 'pivot-trend',
        parameters: {
          direction: 'both'
        },
        stock: {
          symbol: '^NSEI',
          startDate: '2026-06-25',
          endDate: '2026-06-25',
          interval: '1m'
        },
        config: {
          capital: 100000
        }
      });
      console.log(`Yesterday trades count: ${yestResult.report.numberOfTrades}`);
      console.log("Yesterday Trades:", JSON.stringify(yestResult.report.trades, null, 2));
    } catch (err: any) {
      console.error("Yesterday test failed:", err.message);
    }

    console.log("\nRunning backtest for today 2026-06-26:");
    try {
      const todayResult = await runBacktest({
        strategyId: 'pivot-trend',
        parameters: {
          direction: 'both'
        },
        stock: {
          symbol: '^NSEI',
          startDate: '2026-06-26',
          endDate: '2026-06-26',
          interval: '1m'
        },
        config: {
          capital: 100000
        }
      });
      console.log(`Today trades count: ${todayResult.report.numberOfTrades}`);
      console.log("Today Trades:", JSON.stringify(todayResult.report.trades, null, 2));
    } catch (err: any) {
      console.error("Today test failed:", err.message);
    }
  });
});
