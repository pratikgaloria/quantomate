import { 
  Bar,
  BarSeries, 
  Series,
  StrategyContext
} from '@quantomate/core';
import {
  SMA,
  EMA,
  RSI,
  MACD,
  MACDSignal,
  PivotTrend,
  BB,
  ATR,
  VWAP,
  RVOL,
  GoldenCrossStrategy,
  PivotTrendStrategy,
  RSIMeanReversionStrategy,
  BollingerBandsStrategy,
  MACDStrategy,
  StrongPullbackStrategy,
  BearPutSpreadStrategy,
  LongStraddleStrategy,
  LongStrangleStrategy,
  IndexOptionMomentumStrategy,
  IndexOptionRsiReversionStrategy
} from '@quantomate/library';
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

interface SimTradeEvent {
  type: 'entry' | 'exit';
  date: Date;
  tradedValue: number;
  shares: number;
  short: boolean;
  currentCapital: number;
  exitReason?: 'stop-loss' | 'take-profit' | 'strategy';
  commission: number;
  slippage: number;
  exitContext?: {
    entryPrice: number;
    exitPrice: number;
    entryDate: Date;
    exitDate: Date;
    holdDuration: number;
    priceChange: number;
    priceChangePercent: number;
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

  const bars: Bar[] = stockData.map((d) => ({
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume,
    timestamp: d.date.getTime(),
  }));
  const series = new BarSeries(bars);

  let dailySeries: BarSeries | undefined;
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
        const dailyBars: Bar[] = dailyData.map((d) => ({
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
          timestamp: d.date.getTime(),
        }));
        dailySeries = new BarSeries(dailyBars);
      }
    } else {
      dailySeries = series;
    }
  }

  const strategy = createStrategy(strategyId, parameters);

  const { indicatorSeriesMap, secondarySeriesMap } = getIndicatorsForStrategy(
    strategyId,
    series,
    parameters,
    dailySeries
  );

  const context: StrategyContext = {
    getIndicatorSeries: (name) => indicatorSeriesMap.get(name),
    getSecondaryBarSeries: (id) => secondarySeriesMap.get(id),
  };

  const commissionRate = parameters.commission || 0;
  const slippageRate = parameters.slippage || 0;

  const fullReport = runSimulation(
    series,
    strategy,
    context,
    config.capital,
    commissionRate,
    slippageRate,
    parameters
  );

  const startTs = new Date(stock.startDate).getTime();
  const chartData = prepareChartData(stockData, fullReport, strategy.name, startTs);

  const filteredTrades = fullReport.trades.filter(t => {
    const quoteTs = t.date.getTime();
    return quoteTs >= startTs;
  });

  // Calculate metrics based on filtered trades
  let profit = 0;
  let loss = 0;
  let numberOfWinningTrades = 0;
  let numberOfLosingTrades = 0;

  filteredTrades.forEach(t => {
    if (t.type === 'exit' && t.exitContext) {
      const pnl = t.shares * t.exitContext.priceChange - (t.commission || 0);
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
      totalCommissions: fullReport.totalCommissions,
      totalSlippage: fullReport.totalSlippage,
      trades: filteredTrades.map((trade) => ({
        type: trade.type,
        tradedValue: trade.tradedValue,
        date: trade.date,
        short: trade.short,
        exitReason: trade.exitReason,
        shares: trade.shares,
        commission: trade.commission,
        slippage: trade.slippage,
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

export function getIndicatorsForStrategy(
  strategyId: string,
  series: BarSeries,
  parameters: Record<string, any>,
  dailySeries?: BarSeries
): { indicatorSeriesMap: Map<string, Series<number>>; secondarySeriesMap: Map<string, BarSeries> } {
  const indicatorSeriesMap = new Map<string, Series<number>>();
  const secondarySeriesMap = new Map<string, BarSeries>();

  if (dailySeries) {
    secondarySeriesMap.set('daily', dailySeries);
  }

  switch (strategyId) {
    case 'golden-cross': {
      const fastPeriod = parameters.fastPeriod || 50;
      const slowPeriod = parameters.slowPeriod || 200;
      indicatorSeriesMap.set('fastSma', new SMA('fastSma', { period: fastPeriod, field: 'close' }).calculate(series));
      indicatorSeriesMap.set('slowSma', new SMA('slowSma', { period: slowPeriod, field: 'close' }).calculate(series));
      break;
    }
    case 'pivot-trend': {
      indicatorSeriesMap.set('pivotTrend', new PivotTrend('pivotTrend').calculate(series));
      break;
    }
    case 'rsi-mean-reversion': {
      const rsiPeriod = parameters.rsiPeriod || 14;
      indicatorSeriesMap.set('rsi', new RSI('rsi', { period: rsiPeriod, field: 'close' }).calculate(series));
      if (parameters.useTrendFilter) {
        const smaPeriod = parameters.smaPeriod || 50;
        indicatorSeriesMap.set('sma', new SMA('sma', { period: smaPeriod, field: 'close' }).calculate(series));
      }
      break;
    }
    case 'bollinger-bands': {
      const period = parameters.period || 20;
      const multiplier = parameters.multiplier || 2.0;
      indicatorSeriesMap.set('bbUpper', new BB('bbUpper', { period, multiplier, band: 'upper' }).calculate(series));
      indicatorSeriesMap.set('bbLower', new BB('bbLower', { period, multiplier, band: 'lower' }).calculate(series));
      break;
    }
    case 'macd': {
      const fastPeriod = parameters.fastPeriod || 12;
      const slowPeriod = parameters.slowPeriod || 26;
      const signalPeriod = parameters.signalPeriod || 9;
      indicatorSeriesMap.set('macd', new MACD('macd', { fastPeriod, slowPeriod, field: 'close' }).calculate(series));
      indicatorSeriesMap.set('macdSignal', new MACDSignal('macdSignal', { fastPeriod, slowPeriod, signalPeriod, field: 'close' }).calculate(series));
      break;
    }
    case 'strong-pullback': {
      const emaPeriod = parameters.emaPeriod || 20;
      const rvolPeriod = parameters.rvolPeriod || 20;
      const atrPeriod = parameters.atrPeriod || 14;
      const dailyEmaPeriod = parameters.dailyEmaPeriod || 50;

      indicatorSeriesMap.set('ema20', new EMA('ema20', { period: emaPeriod, field: 'close' }).calculate(series));
      indicatorSeriesMap.set('vwap', new VWAP('vwap', { field: 'hlc3' }).calculate(series));
      indicatorSeriesMap.set('rvol', new RVOL('rvol', { period: rvolPeriod }).calculate(series));
      indicatorSeriesMap.set('atr', new ATR('atr', { period: atrPeriod }).calculate(series));
      if (dailySeries) {
        indicatorSeriesMap.set('dailyEma50', new EMA('dailyEma50', { period: dailyEmaPeriod, field: 'close' }).calculate(dailySeries));
      }
      break;
    }
    case 'bear-put-spread': {
      const fastPeriod = parameters.fastPeriod || 9;
      const slowPeriod = parameters.slowPeriod || 20;
      const rsiPeriod = parameters.rsiPeriod || 14;
      indicatorSeriesMap.set('fastEma', new EMA('fastEma', { period: fastPeriod, field: 'close' }).calculate(series));
      indicatorSeriesMap.set('slowEma', new EMA('slowEma', { period: slowPeriod, field: 'close' }).calculate(series));
      indicatorSeriesMap.set('rsi', new RSI('rsi', { period: rsiPeriod, field: 'close' }).calculate(series));
      break;
    }
    case 'long-straddle':
    case 'long-strangle': {
      const rsiPeriod = parameters.rsiPeriod || 14;
      indicatorSeriesMap.set('rsi', new RSI('rsi', { period: rsiPeriod, field: 'close' }).calculate(series));
      break;
    }
    case 'index-option-momentum': {
      const fastPeriod = parameters.fastPeriod || 9;
      const slowPeriod = parameters.slowPeriod || 20;
      indicatorSeriesMap.set('fastEma', new EMA('fastEma', { period: fastPeriod, field: 'close' }).calculate(series));
      indicatorSeriesMap.set('slowEma', new EMA('slowEma', { period: slowPeriod, field: 'close' }).calculate(series));
      break;
    }
    case 'index-option-rsi-reversion': {
      const rsiPeriod = parameters.rsiPeriod || 14;
      indicatorSeriesMap.set('rsi', new RSI('rsi', { period: rsiPeriod, field: 'close' }).calculate(series));
      break;
    }
  }

  return { indicatorSeriesMap, secondarySeriesMap };
}

export function createStrategy(strategyId: string, parameters: Record<string, any>) {
  switch (strategyId) {
    case 'golden-cross':
      return new GoldenCrossStrategy('Golden Cross', parameters);
    case 'pivot-trend':
      return new PivotTrendStrategy('Pivot Trend', parameters);
    case 'rsi-mean-reversion':
      return new RSIMeanReversionStrategy('RSI Mean Reversion', parameters);
    case 'bollinger-bands':
      return new BollingerBandsStrategy('Bollinger Bands', parameters);
    case 'macd':
      return new MACDStrategy('MACD', parameters);
    case 'strong-pullback':
      return new StrongPullbackStrategy('Strong Pullback', parameters);
    case 'bear-put-spread':
      return new BearPutSpreadStrategy('Bear Put Spread', parameters);
    case 'long-straddle':
      return new LongStraddleStrategy('Long Straddle', parameters);
    case 'long-strangle':
      return new LongStrangleStrategy('Long Strangle', parameters);
    case 'index-option-momentum':
      return new IndexOptionMomentumStrategy('Index Option Momentum', parameters);
    case 'index-option-rsi-reversion':
      return new IndexOptionRsiReversionStrategy('Index Option RSI Reversion', parameters);
    default:
      throw new Error(`Unknown strategy: ${strategyId}`);
  }
}

function runSimulation(
  series: BarSeries,
  strategy: any,
  context: StrategyContext,
  initialCapital: number,
  commissionRate: number,
  slippageRate: number,
  parameters: Record<string, any>
) {
  let currentCapital = initialCapital;
  let sharesOwned = 0;
  let isShort = false;
  let entryTradedValue = 0;
  let activeEntryDate: Date | null = null;
  let entryBarIndex = -1;

  let stopLossExits = 0;
  let takeProfitExits = 0;
  let strategyExits = 0;
  let totalCommissions = 0;
  let totalSlippage = 0;

  const trades: SimTradeEvent[] = [];

  let status: 'idle' | 'long' | 'short' = 'idle';

  for (let i = 0; i < series.length; i++) {
    const bar = series.at(i)!;
    const signal = strategy.evaluate(series, i, context);

    if (status === 'idle') {
      if (signal.action === 'entry') {
        const execBar = (i + 1 < series.length) ? series.at(i + 1)! : bar;
        const tradedValue = execBar.open;
        const date = new Date(execBar.timestamp);

        isShort = signal.direction === 'short';
        status = isShort ? 'short' : 'long';
        activeEntryDate = date;
        entryBarIndex = i;

        // Apply slippage to entry price
        const slippageFactor = isShort ? (1 - slippageRate) : (1 + slippageRate);
        const effectiveEntryPrice = tradedValue * slippageFactor;
        const slippageCost = Math.abs(effectiveEntryPrice - tradedValue);

        entryTradedValue = effectiveEntryPrice;

        // Calculate shares with all available capital
        const shares = currentCapital / effectiveEntryPrice;
        sharesOwned = shares;

        // Apply commission
        const commissionCost = shares * commissionRate;
        totalCommissions += commissionCost;
        totalSlippage += (shares * slippageCost);

        if (isShort) {
          currentCapital = currentCapital + (shares * effectiveEntryPrice) - commissionCost;
        } else {
          const totalCostPerShare = effectiveEntryPrice + commissionRate;
          const adjustedShares = currentCapital / totalCostPerShare;
          sharesOwned = adjustedShares;
          currentCapital = 0;
        }

        trades.push({
          type: 'entry',
          date,
          tradedValue: effectiveEntryPrice,
          shares: sharesOwned,
          short: isShort,
          currentCapital,
          commission: commissionCost,
          slippage: slippageCost * sharesOwned
        });
      }
    } else {
      // In position: check for exit (either signal or end of series)
      let shouldExit = signal.action === 'exit';
      let exitReason: 'stop-loss' | 'take-profit' | 'strategy' = 'strategy';

      // For StrongPullback, compute SL and TP in the runner to set exitReason
      if (strategy.name === 'StrongPullback') {
        const atrSeries = context.getIndicatorSeries('atr');
        const entryAtr = atrSeries ? (atrSeries.at(entryBarIndex) || 0) : 0;
        const atrMultiplier = parameters.atrMultiplier ?? 1.0;
        const tp1_R = parameters.tp1_R ?? 1.0;

        const stopLoss = !isShort
          ? entryTradedValue - entryAtr * atrMultiplier
          : entryTradedValue + entryAtr * atrMultiplier;

        const tp1 = !isShort
          ? entryTradedValue + entryAtr * atrMultiplier * tp1_R
          : entryTradedValue - entryAtr * atrMultiplier * tp1_R;

        if (!isShort) {
          if (bar.close <= stopLoss) {
            shouldExit = true;
            exitReason = 'stop-loss';
          } else if (bar.close >= tp1) {
            shouldExit = true;
            exitReason = 'take-profit';
          }
        } else {
          if (bar.close >= stopLoss) {
            shouldExit = true;
            exitReason = 'stop-loss';
          } else if (bar.close <= tp1) {
            shouldExit = true;
            exitReason = 'take-profit';
          }
        }
      }

      const isLastBar = i === series.length - 1;
      if (shouldExit || isLastBar) {
        if (isLastBar && !shouldExit) {
          exitReason = 'strategy';
        }

        if (exitReason === 'stop-loss') {
          stopLossExits++;
        } else if (exitReason === 'take-profit') {
          takeProfitExits++;
        } else {
          strategyExits++;
        }

        const execBar = (i + 1 < series.length) ? series.at(i + 1)! : bar;
        const tradedValue = execBar.open;
        const date = new Date(execBar.timestamp);

        // Apply slippage to exit price
        const slippageFactor = isShort ? (1 + slippageRate) : (1 - slippageRate);
        const effectiveExitPrice = tradedValue * slippageFactor;
        const slippageCost = Math.abs(effectiveExitPrice - tradedValue);

        // Apply commission
        const commissionCost = sharesOwned * commissionRate;
        totalCommissions += commissionCost;
        totalSlippage += (sharesOwned * slippageCost);

        const holdDuration = date.getTime() - activeEntryDate!.getTime();
        const priceChange = isShort ? entryTradedValue - effectiveExitPrice : effectiveExitPrice - entryTradedValue;
        const priceChangePercent = (priceChange / entryTradedValue) * 100;

        const exitContext = {
          entryPrice: entryTradedValue,
          exitPrice: effectiveExitPrice,
          entryDate: activeEntryDate!,
          exitDate: date,
          holdDuration,
          priceChange,
          priceChangePercent,
        };

        if (isShort) {
          const proceeds = (sharesOwned * effectiveExitPrice) + commissionCost;
          currentCapital = currentCapital - proceeds;
        } else {
          const saleProceeds = (sharesOwned * effectiveExitPrice) - commissionCost;
          currentCapital += saleProceeds;
        }

        trades.push({
          type: 'exit',
          date,
          tradedValue: effectiveExitPrice,
          shares: sharesOwned,
          short: isShort,
          currentCapital,
          exitReason,
          exitContext,
          commission: commissionCost,
          slippage: slippageCost * sharesOwned
        });

        sharesOwned = 0;
        status = 'idle';
      }
    }
  }

  const returns = currentCapital - initialCapital;
  const returnsPercentage = (returns / initialCapital) * 100;

  return {
    initialCapital,
    finalCapital: currentCapital,
    returns,
    returnsPercentage,
    stopLossExits,
    takeProfitExits,
    strategyExits,
    totalCommissions,
    totalSlippage,
    trades
  };
}

function prepareChartData(stockData: StockData[], report: any, strategyName: string, startTs?: number) {
  const prices: any[] = [];
  const equity: any[] = [];
  const trades: any[] = [];

  const capitalByDate = new Map<string, number>();
  let currentCapital = report.initialCapital;
  let position: { shares: number; entryPrice: number; short: boolean } | null = null;

  report.trades.forEach((trade: any) => {
    const dateStr = trade.date.toString();

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

  for (let i = 0; i < stockData.length; i++) {
    const value = stockData[i];
    const dateStr = value.date.toString();
    const quoteTs = value.date.getTime();

    if (capitalByDate.has(dateStr)) {
      lastKnownCapital = capitalByDate.get(dateStr)!;
    }

    const currentTrade = report.trades.find((t: any) => t.date.toString() === dateStr);
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
    if (startTs && trade.date.getTime() < startTs) return;

    trades.push({
      date: trade.date,
      type: trade.type,
      price: trade.tradedValue,
      exitReason: trade.exitReason,
    });
  });

  return { prices, equity, trades };
}
