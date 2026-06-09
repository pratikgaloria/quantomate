import { Dataset, Backtest } from "@quantomate/core";
import { GoldenCrossStrategy, RSIMeanReversionStrategy } from "@quantomate/library";
import { DataService } from "@quantomate/data";

type DQuote = {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

function getWarmupDate(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

async function checkSymbol(symbol: string) {
  const startDateStr = '2025-06-06';
  const endDateStr = '2026-06-09';
  const interval = '1d';
  
  const warmupDays = 100;
  const warmupStartDateStr = getWarmupDate(startDateStr, warmupDays);
  
  const data = await DataService.getHistoricalData(symbol, undefined, interval);
  
  const start = new Date(warmupStartDateStr);
  const end = new Date(endDateStr);
  
  const filteredData = data
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    })
    .map(item => ({
      date: new Date(item.date),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const dataset = new Dataset<DQuote>(filteredData, { timestampField: 'date' });
  const startTs = new Date(startDateStr).getTime();
  
  console.log(`\n=================== ${symbol} ===================`);
  
  // Golden Cross
  const gcStrategy = new GoldenCrossStrategy('Golden Cross', {
    fastPeriod: 50,
    slowPeriod: 200,
    direction: 'long'
  });
  const gcBacktest = new Backtest<any, DQuote, any>(dataset, gcStrategy);
  const gcReport = gcBacktest.run({
    config: { capital: 100000, entryPriceField: 'close' },
    onEntry: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close,
    onExit: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close
  });
  const filteredGc = gcReport.trades.filter(t => (t.quote.value as any).date.getTime() >= startTs);
  console.log(`Golden Cross Filtered Trades (>= startTs): ${filteredGc.length}`);
  
  // RSI Mean Reversion
  const rsiStrategy = new RSIMeanReversionStrategy('RSI Mean Reversion', {
    rsiPeriod: 14,
    oversoldThreshold: 30,
    overboughtThreshold: 70,
    direction: 'long',
    useTrendFilter: false
  });
  const rsiBacktest = new Backtest<any, DQuote, any>(dataset, rsiStrategy);
  const rsiReport = rsiBacktest.run({
    config: { capital: 100000, entryPriceField: 'close' },
    onEntry: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close,
    onExit: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close
  });
  const filteredRsi = rsiReport.trades.filter(t => (t.quote.value as any).date.getTime() >= startTs);
  console.log(`RSI Mean Reversion Filtered Trades (>= startTs): ${filteredRsi.length}`);
}

async function run() {
  await checkSymbol('AAPL');
  await checkSymbol('MSFT');
  await checkSymbol('TSLA');
}

run().catch(console.error);
