import { Dataset, Backtest } from "@quantomate/core";
import { BollingerBandsStrategy, MACDStrategy, PivotTrendStrategy } from "@quantomate/library";
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
  
  console.log("\n--- Running Bollinger Bands Strategy ---");
  const bbStrategy = new BollingerBandsStrategy('Bollinger Bands', {
    period: 20,
    multiplier: 2,
    direction: 'long'
  });
  const bbBacktest = new Backtest<any, DQuote, any>(dataset, bbStrategy);
  const bbReport = bbBacktest.run({
    config: { capital: 100000, entryPriceField: 'close' },
    onEntry: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close,
    onExit: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close
  });
  const filteredBb = bbReport.trades.filter(t => (t.quote.value as any).date.getTime() >= startTs);
  console.log(`Bollinger Bands Total Trades (all): ${bbReport.trades.length}`);
  console.log(`Bollinger Bands Filtered Trades (>= startTs): ${filteredBb.length}`);

  console.log("\n--- Running MACD Strategy ---");
  const macdStrategy = new MACDStrategy('MACD', {
    signalPeriod: 9,
    direction: 'long'
  });
  const macdBacktest = new Backtest<any, DQuote, any>(dataset, macdStrategy);
  const macdReport = macdBacktest.run({
    config: { capital: 100000, entryPriceField: 'close' },
    onEntry: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close,
    onExit: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close
  });
  const filteredMacd = macdReport.trades.filter(t => (t.quote.value as any).date.getTime() >= startTs);
  console.log(`MACD Total Trades (all): ${macdReport.trades.length}`);
  console.log(`MACD Filtered Trades (>= startTs): ${filteredMacd.length}`);

  console.log("\n--- Running Pivot Trend Strategy ---");
  const pivotStrategy = new PivotTrendStrategy('Pivot Trend', {
    direction: 'both'
  });
  const pivotBacktest = new Backtest<any, DQuote, any>(dataset, pivotStrategy);
  const pivotReport = pivotBacktest.run({
    config: { capital: 100000, entryPriceField: 'close' },
    onEntry: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close,
    onExit: (q, i, quotes) => quotes[i + 1] ? quotes[i + 1].value.open : q.value.close
  });
  const filteredPivot = pivotReport.trades.filter(t => (t.quote.value as any).date.getTime() >= startTs);
  console.log(`Pivot Trend Total Trades (all): ${pivotReport.trades.length}`);
  console.log(`Pivot Trend Filtered Trades (>= startTs): ${filteredPivot.length}`);
}

run().catch(console.error);
