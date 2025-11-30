import { Dataset, Strategy, Backtest } from '@quantomate/core';
import { SMA } from '@quantomate/indicators';
import { fetchStockData, StockData } from './stockDataFetcher';

interface BacktestRequest {
  strategyId: string;
  parameters: Record<string, any>;
  stock: {
    symbol: string;
    startDate: string;
    endDate: string;
  };
  config: {
    capital: number;
  };
}

export async function runBacktest(request: BacktestRequest) {
  const { strategyId, parameters, stock, config } = request;

  // Fetch stock data
  const stockData = await fetchStockData(
    stock.symbol,
    stock.startDate,
    stock.endDate
  );

  if (stockData.length === 0) {
    throw new Error('No stock data available for the specified period');
  }

  // Create dataset
  const dataset = new Dataset(stockData);

  // Create strategy based on strategyId
  const strategy = createStrategy(strategyId, parameters);

  // Run backtest
  const backtest = new Backtest(dataset, strategy);
  const report = backtest.run({
    config: {
      capital: config.capital,
    },
    onEntry: (quote) => (quote.value as StockData).close,
    onExit: (quote) => (quote.value as StockData).close,
  });

  // Prepare chart data
  const chartData = prepareChartData(dataset, report, strategy.name);

  return {
    report: {
      initialCapital: report.initialCapital,
      finalCapital: report.finalCapital,
      returns: report.returns,
      returnsPercentage: report.returnsPercentage,
      numberOfTrades: report.numberOfTrades,
      numberOfWinningTrades: report.numberOfWinningTrades,
      numberOfLosingTrades: report.numberOfLosingTrades,
      winningRate: report.winningRate,
      profit: report.profit,
      loss: report.loss,
      stopLossExits: (report as any).stopLossExits || 0,
      takeProfitExits: (report as any).takeProfitExits || 0,
      strategyExits: (report as any).strategyExits || 0,
      trades: report.trades,
    },
    chartData,
  };
}

function createStrategy(strategyId: string, parameters: Record<string, any>) {
  switch (strategyId) {
    case 'golden-cross': {
      const fastPeriod = parameters.fastPeriod || 50;
      const slowPeriod = parameters.slowPeriod || 200;

      const fastSMA = new SMA('fastSMA', { attribute: 'close', period: fastPeriod } as any);
      const slowSMA = new SMA('slowSMA', { attribute: 'close', period: slowPeriod } as any);

      return new Strategy<any, StockData>('Golden Cross', {
        indicators: [fastSMA as any, slowSMA as any],
        entryWhen: (quote) => {
          const fast = quote.getIndicator('fastSMA');
          const slow = quote.getIndicator('slowSMA');
          return fast > slow;
        },
        exitWhen: (quote) => {
          const fast = quote.getIndicator('fastSMA');
          const slow = quote.getIndicator('slowSMA');
          return fast < slow;
        },
      });
    }
    default:
      throw new Error(`Unknown strategy: ${strategyId}`);
  }
}

function prepareChartData(dataset: any, report: any, strategyName: string) {
  const prices: any[] = [];
  const equity: any[] = [];
  const trades: any[] = [];

  // Build a map of dates to capital values from trades
  const capitalByDate = new Map<string, number>();
  let currentCapital = report.initialCapital;
  let position: { shares: number; entryPrice: number } | null = null;

  // Process trades to calculate capital at each trade point
  report.trades.forEach((trade: any) => {
    const value = trade.quote._value as StockData;
    const dateStr = value.date.toString();

    if (trade.type === 'entry') {
      position = {
        shares: trade.shares,
        entryPrice: trade.tradedValue,
      };
      capitalByDate.set(dateStr, currentCapital);
    } else if (trade.type === 'exit' && position) {
      // Calculate P&L
      const exitValue = position.shares * trade.tradedValue;
      const entryValue = position.shares * position.entryPrice;
      const pnl = exitValue - entryValue;
      currentCapital += pnl;
      capitalByDate.set(dateStr, currentCapital);
      position = null;
    }
  });

  // Build equity curve with interpolated values
  let lastKnownCapital = report.initialCapital;
  position = null; // Reset position for second pass
  
  for (let i = 0; i < dataset.length; i++) {
    const quote = dataset.at(i);
    const value = quote.value as StockData;
    const dateStr = value.date.toString();

    prices.push({
      date: value.date,
      open: value.open,
      high: value.high,
      low: value.low,
      close: value.close,
    });

    // Use actual capital if we have it, otherwise use last known
    if (capitalByDate.has(dateStr)) {
      lastKnownCapital = capitalByDate.get(dateStr)!;
    }

    // Track position state for unrealized P&L
    const currentTrade = report.trades.find((t: any) => t.quote._value.date.toString() === dateStr);
    if (currentTrade) {
      if (currentTrade.type === 'entry') {
        position = {
          shares: currentTrade.shares,
          entryPrice: currentTrade.tradedValue,
        };
      } else if (currentTrade.type === 'exit') {
        position = null;
      }
    }

    // If we're in a position, calculate unrealized P&L
    let displayCapital = lastKnownCapital;
    if (position) {
      const currentValue = position.shares * value.close;
      const entryValue = position.shares * position.entryPrice;
      const unrealizedPnL = currentValue - entryValue;
      displayCapital = lastKnownCapital + unrealizedPnL;
    }

    equity.push({
      date: value.date,
      value: displayCapital,
    });
  }

  // Add trade markers
  report.trades.forEach((trade: any) => {
    const value = trade.quote._value as StockData;
    trades.push({
      date: value.date,
      type: trade.type,
      price: trade.tradedValue,
      exitReason: trade.exitReason,
    });
  });

  return { prices, equity, trades };
}
