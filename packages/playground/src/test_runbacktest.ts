import dotenv from 'dotenv';
dotenv.config({ path: '/home/dev/projects/quantomate-portfolio/.env' });
if (process.env.QUANTOMATE_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.QUANTOMATE_DATABASE_URL;
}

import { runBacktest } from '../../ui/server/src/services/backtestRunner';

async function main() {
  const result = await runBacktest({
    strategyId: 'rsi-mean-reversion',
    parameters: {
      rsiPeriod: 14,
      oversoldThreshold: 30,
      overboughtThreshold: 70,
      direction: 'both',
      useTrendFilter: false
    },
    stock: {
      symbol: '^NSEBANK',
      startDate: '2026-06-08',
      endDate: '2026-06-08',
      interval: '1m'
    },
    config: {
      capital: 100000
    }
  });

  console.log('--- BACKTEST RUNNER REPORT ---');
  console.log(JSON.stringify(result.report, null, 2));
}

main().catch(console.error);
