import { Dataset, Backtest } from '@quantomate/core';
import { PivotTrendStrategy, GoldenCrossStrategy, RSIMeanReversionStrategy, BollingerBandsStrategy, MACDStrategy, OhiainStrategy, StrongPullback, BearPutSpreadStrategy, LongStraddleStrategy, LongStrangleStrategy } from '@quantomate/library';
import { fetchStockData, StockData } from './stockDataFetcher';

interface BacktestRequest {
  strategyId: string;
  parameters: Record<string, any>;
  stock: {
    symbol: string;
    startDate: string;
    endDate: string;
    interval?: string;
  };
  config: {
    capital: number;
  };
}

export async function runBacktest(request: BacktestRequest) {
  const { strategyId, parameters, stock, config } = request;

  const interval = stock.interval || '1d';

  // Fetch data with warmup period
  const warmupDays = interval === '1d' ? 100 : 30;
  const warmupStartDate = getWarmupDate(stock.startDate, warmupDays);

  const stockData = await fetchStockData(
    stock.symbol,
    warmupStartDate,
    stock.endDate,
    interval
  );

  if (stockData.length === 0) {
    throw new Error('No stock data available for the specified period');
  }

  const dataset = new Dataset(stockData, { id: interval });

  const secondaryDatasets: Dataset<StockData>[] = [];
  if (strategyId === 'strong-pullback') {
    if (interval !== '1d') {
      const dailyWarmupStartDate = getWarmupDate(stock.startDate, 100);
      const dailyData = await fetchStockData(
        stock.symbol,
        dailyWarmupStartDate,
        stock.endDate,
        '1d'
      );
      if (dailyData.length > 0) {
        const dailyDataset = new Dataset(dailyData, { id: 'daily' });
        StrongPullback.prepareDaily(dailyDataset, parameters.dailyEmaPeriod || 50);
        secondaryDatasets.push(dailyDataset as any);
      }
    } else {
      StrongPullback.prepareDaily(dataset, parameters.dailyEmaPeriod || 50);
      const dailyDataset = new Dataset(stockData, { id: 'daily' });
      StrongPullback.prepareDaily(dailyDataset, parameters.dailyEmaPeriod || 50);
      secondaryDatasets.push(dailyDataset as any);
    }
  }

  const strategy = createStrategy(strategyId, parameters);

  const fullReport = backtestStrategy(dataset, strategy, secondaryDatasets, config, parameters);

  const startTs = new Date(stock.startDate).getTime();
  const chartData = prepareChartData(dataset, fullReport, strategy.name, startTs);

  const filteredTrades = fullReport.trades.filter(t => {
    const quoteTs = (t.quote.value as any).date.getTime();
    return quoteTs >= startTs;
  });

  // Calculate metrics based on filtered trades
  let profit = 0;
  let loss = 0;
  let numberOfWinningTrades = 0;
  let numberOfLosingTrades = 0;

  filteredTrades.forEach(t => {
    if (t.type === 'exit' && t.exitContext) {
      const pnl = (t.shares || 0) * t.exitContext.priceChange - ((t as any).commission || 0);
      if (pnl > 0) {
        profit += pnl;
        numberOfWinningTrades++;
      } else {
        loss += Math.abs(pnl);
        numberOfLosingTrades++;
      }
    }
  });

  const totalCompletedExits = numberOfWinningTrades + numberOfLosingTrades;
  const winningRate = totalCompletedExits > 0 ? numberOfWinningTrades / totalCompletedExits : 0;

  const stopLossExits = filteredTrades.filter(t => t.type === 'exit' && t.exitReason === 'stop-loss').length;
  const takeProfitExits = filteredTrades.filter(t => t.type === 'exit' && t.exitReason === 'take-profit').length;
  const strategyExits = filteredTrades.filter(t => t.type === 'exit' && t.exitReason === 'strategy').length;

  return {
    report: {
      initialCapital: fullReport.initialCapital,
      finalCapital: fullReport.finalCapital,
      returns: fullReport.returns,
      returnsPercentage: fullReport.returnsPercentage,
      numberOfTrades: totalCompletedExits,
      numberOfWinningTrades,
      numberOfLosingTrades,
      winningRate,
      profit,
      loss,
      stopLossExits,
      takeProfitExits,
      strategyExits,
      totalCommissions: (fullReport as any).totalCommissions || 0,
      totalSlippage: (fullReport as any).totalSlippage || 0,
      trades: filteredTrades.map((trade) => ({
        type: trade.type,
        tradedValue: trade.tradedValue,
        date: (trade.quote.value as any).date,
        short: trade.short,
        exitReason: trade.exitReason,
        shares: trade.shares,
        commission: (trade as any).commission,
        slippage: (trade as any).slippage,
      })),
    },
    chartData,
  };
}

function getWarmupDate(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function backtestStrategy(dataset: Dataset<StockData>, strategy: any, secondaryDatasets: Dataset<any>[], config: any, parameters: any) {
  const backtest = new Backtest(dataset, strategy, secondaryDatasets);

  return backtest.run({
    config: {
      capital: config.capital,
      commission: parameters.commission || 0,
      slippage: parameters.slippage || 0,
    },
    onEntry: (quote, index, quotes) => {
      const nextBar = quotes[index + 1];
      return nextBar ? (nextBar.value as StockData).open : (quote.value as StockData).close;
    },
    onExit: (quote, index, quotes) => {
      const nextBar = quotes[index + 1];
      return nextBar ? (nextBar.value as StockData).open : (quote.value as StockData).close;
    },
  });
}

export function createStrategy(strategyId: string, parameters: Record<string, any>) {
  switch (strategyId) {
    case 'golden-cross': {
      const fastPeriod = parameters.fastPeriod || 50;
      const slowPeriod = parameters.slowPeriod || 200;

      return new GoldenCrossStrategy('Golden Cross', {
        fastPeriod,
        slowPeriod,
        source: 'close',
        ...parameters
      });
    }
    case 'pivot-trend': {
      return new PivotTrendStrategy('Pivot Trend', parameters);
    }
    case 'rsi-mean-reversion': {
      return new RSIMeanReversionStrategy('RSI Mean Reversion', parameters);
    }
    case 'bollinger-bands': {
      return new BollingerBandsStrategy('Bollinger Bands', parameters);
    }
    case 'macd': {
      return new MACDStrategy('MACD', parameters);
    }
    case 'ohiain': {
      return new OhiainStrategy('Ohiain', parameters);
    }
    case 'strong-pullback': {
      return new StrongPullback(parameters);
    }
    case 'bear-put-spread': {
      return new BearPutSpreadStrategy('Bear Put Spread', parameters);
    }
    case 'long-straddle': {
      return new LongStraddleStrategy('Long Straddle', parameters);
    }
    case 'long-strangle': {
      return new LongStrangleStrategy('Long Strangle', parameters);
    }
    default:
      throw new Error(`Unknown strategy: ${strategyId}`);
  }
}

function prepareChartData(dataset: any, report: any, strategyName: string, startTs?: number) {
  const prices: any[] = [];
  const equity: any[] = [];
  const trades: any[] = [];

  const capitalByDate = new Map<string, number>();
  let currentCapital = report.initialCapital;
  let position: { shares: number; entryPrice: number; short: boolean } | null = null;

  report.trades.forEach((trade: any) => {
    const value = trade.quote._value as StockData;
    const dateStr = value.date.toString();

    if (trade.type === 'entry') {
      position = {
        shares: trade.shares,
        entryPrice: trade.tradedValue,
        short: !!trade.short,
      };
      capitalByDate.set(dateStr, currentCapital);
    } else if (trade.type === 'exit' && position) {
      const exitValue = position.shares * trade.tradedValue;
      const entryValue = position.shares * position.entryPrice;
      const pnl = position.short ? (entryValue - exitValue) : (exitValue - entryValue);
      currentCapital += pnl;
      capitalByDate.set(dateStr, currentCapital);
      position = null;
    }
  });

  let lastKnownCapital = report.initialCapital;
  position = null;

  for (let i = 0; i < dataset.length; i++) {
    const quote = dataset.at(i);
    const value = quote.value as StockData;
    const dateStr = value.date.toString();
    const quoteTs = value.date.getTime();

    if (capitalByDate.has(dateStr)) {
      lastKnownCapital = capitalByDate.get(dateStr)!;
    }

    const currentTrade = report.trades.find((t: any) => t.quote._value.date.toString() === dateStr);
    if (currentTrade) {
      if (currentTrade.type === 'entry') {
        position = {
          shares: currentTrade.shares,
          entryPrice: currentTrade.tradedValue,
          short: !!currentTrade.short,
        };
      } else if (currentTrade.type === 'exit') {
        position = null;
      }
    }

    if (startTs && quoteTs < startTs) continue;

    prices.push({
      date: value.date,
      open: value.open,
      high: value.high,
      low: value.low,
      close: value.close,
    });

    let displayCapital = lastKnownCapital;
    if (position) {
      const currentValue = position.shares * value.close;
      const entryValue = position.shares * position.entryPrice;
      const unrealizedPnL = position.short ? (entryValue - currentValue) : (currentValue - entryValue);
      displayCapital = lastKnownCapital + unrealizedPnL;
    }

    equity.push({
      date: value.date,
      value: displayCapital,
    });
  }

  report.trades.forEach((trade: any) => {
    const value = trade.quote._value as StockData;
    if (startTs && value.date.getTime() < startTs) return;

    trades.push({
      date: value.date,
      type: trade.type,
      price: trade.tradedValue,
      exitReason: trade.exitReason,
    });
  });

  return { prices, equity, trades };
}
