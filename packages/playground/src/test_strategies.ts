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

async function run() {
  const symbol = 'NVDA';
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
  
  console.log("\n--- Running RSI Mean Reversion Strategy ---");
  const rsiStrategy = new RSIMeanReversionStrategy('RSI Mean Reversion', {
    rsiPeriod: 14,
    oversoldThreshold: 30,
    overboughtThreshold: 70,
    direction: 'long',
    useTrendFilter: false
  });
  
  const rsiBacktest = new Backtest<any, DQuote, any>(dataset, rsiStrategy);
  const rsiReport = rsiBacktest.run({
    config: {
      capital: 100000,
      entryPriceField: 'close'
    },
    onEntry: (q, i, quotes) => {
      const nextBar = quotes[i + 1];
      return nextBar ? nextBar.value.open : q.value.close;
    },
    onExit: (q, i, quotes) => {
      const nextBar = quotes[i + 1];
      return nextBar ? nextBar.value.open : q.value.close;
    }
  });
  
  console.log(`RSI Mean Reversion Total Trades (all): ${rsiReport.trades.length}`);
  rsiReport.trades.forEach((t, index) => {
    const dateStr = (t.quote.value as any).date.toISOString().split('T')[0];
    console.log(`Trade ${index + 1}: Type = ${t.type}, Date = ${dateStr}, Price = ${t.tradedValue}`);
  });
}

run().catch(console.error);
