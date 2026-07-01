import { StockData } from './stockDataFetcher';

export function prepareChartData(stockData: StockData[], report: any, strategyName: string, startTs?: number) {
  const prices: any[] = [];
  const equity: any[] = [];
  const trades: any[] = [];

  const capitalByDate = new Map<string, number>();
  let currentCapital = report.initialCapital;
  let position: { shares: number; entryPrice: number; short: boolean } | null = null;

  report.trades.forEach((trade: any) => {
    const dateStr = trade.date.toString();
    if (trade.type === 'entry') {
      position = { shares: trade.shares, entryPrice: trade.tradedValue, short: !!trade.short };
      capitalByDate.set(dateStr, currentCapital);
    } else if (trade.type === 'exit' && position) {
      const exitVal = position.shares * trade.tradedValue;
      const entryVal = position.shares * position.entryPrice;
      currentCapital += position.short ? (entryVal - exitVal) : (exitVal - entryVal);
      capitalByDate.set(dateStr, currentCapital);
      position = null;
    }
  });

  let lastKnownCapital = report.initialCapital;
  position = null;

  for (let i = 0; i < stockData.length; i++) {
    const value = stockData[i];
    const dateStr = value.date.toString();
    const quoteTs = value.date.getTime();

    if (capitalByDate.has(dateStr)) lastKnownCapital = capitalByDate.get(dateStr)!;

    const currentTrade = report.trades.find((t: any) => t.date.toString() === dateStr);
    if (currentTrade) {
      if (currentTrade.type === 'entry') {
        position = { shares: currentTrade.shares, entryPrice: currentTrade.tradedValue, short: !!currentTrade.short };
      } else if (currentTrade.type === 'exit') {
        position = null;
      }
    }

    if (startTs && quoteTs < startTs) continue;

    prices.push({ date: value.date, open: value.open, high: value.high, low: value.low, close: value.close });

    let displayCapital = lastKnownCapital;
    if (position) {
      const currentValue = position.shares * value.close;
      const entryValue = position.shares * position.entryPrice;
      const unrealizedPnL = position.short ? (entryValue - currentValue) : (currentValue - entryValue);
      displayCapital = lastKnownCapital + unrealizedPnL;
    }

    equity.push({ date: value.date, value: displayCapital });
  }

  report.trades.forEach((trade: any) => {
    if (startTs && trade.date.getTime() < startTs) return;
    trades.push({ date: trade.date, type: trade.type, price: trade.tradedValue, exitReason: trade.exitReason });
  });

  return { prices, equity, trades };
}
