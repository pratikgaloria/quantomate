import { Bar, BarSeries, StrategyContext, Strategy } from '@quantomate/core';
import { fetchPriceData } from './priceDataService';
import { createStrategy, getWarmupDate } from './strategyFactory';
import { getIndicatorsForStrategy } from './indicatorFactory';
import { runSimulation } from './simulation';
import { prepareChartData } from './chartDataBuilder';
import { calculateSharpeRatio } from './sharpeRatio';
export { createStrategy, getWarmupDate, getIndicatorsForStrategy };

interface BacktestRequest {
  strategyId: string; parameters: Record<string, any>;
  stock: { symbol: string; startDate: string; endDate: string; interval?: string; };
  config?: { capital?: number; };
}

export async function runBacktest(request: BacktestRequest) {
  const { strategyId, parameters, stock, config } = request;
  const interval = stock.interval || '1d';

  // Adjust dates and fetch main timeframe data
  const { data: stockData, resolvedStartDate, resolvedEndDate } = await fetchPriceData({
    symbol: stock.symbol,
    interval,
    startDate: stock.startDate,
    endDate: stock.endDate,
    warmupDays: interval === '1d' ? 100 : 30,
  });

  stock.startDate = resolvedStartDate;
  stock.endDate = resolvedEndDate;

  if (stockData.length === 0) throw new Error('No stock data available for the specified period');

  const series = new BarSeries(stockData.map((d) => ({
    open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume, timestamp: d.date.getTime(),
  })));

  const strategy = createStrategy(strategyId, parameters) as Strategy;

  const secondarySeriesMap = new Map<string, BarSeries>();
  if (strategy.getRequiredSecondaryIntervals) {
    const neededIntervals = strategy.getRequiredSecondaryIntervals(interval);
    for (const secInterval of neededIntervals) {
      const { data: secData } = await fetchPriceData({
        symbol: stock.symbol,
        interval: secInterval,
        startDate: stock.startDate,
        endDate: stock.endDate,
        warmupDays: 100,
      });
      if (secData.length > 0) {
        const secSeries = new BarSeries(secData.map((d) => ({
          open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume, timestamp: d.date.getTime(),
        })));
        secondarySeriesMap.set(secInterval, secSeries);
        if (secInterval === '1d' || secInterval === '1wk') {
          secondarySeriesMap.set('daily', secSeries);
        }
      }
    }
  }

  const dailySeries = secondarySeriesMap.get('1d') || secondarySeriesMap.get('1wk');
  const { indicatorSeriesMap, secondarySeriesMap: factorySecMap } = getIndicatorsForStrategy(strategyId, series, parameters, dailySeries);
  const combinedSecMap = new Map<string, BarSeries>([...secondarySeriesMap, ...factorySecMap]);

  const context: StrategyContext = {
    getIndicatorSeries: (name) => indicatorSeriesMap.get(name),
    getSecondaryBarSeries: (id) => combinedSecMap.get(id),
  };

  const startTs = new Date(stock.startDate).getTime();
  const fullReport = runSimulation(series, strategy, context, config?.capital, parameters.commission || 0, parameters.slippage || 0, parameters, startTs);
  const chartData = prepareChartData(stockData, fullReport, strategy.name, startTs);
  const sharpeRatio = calculateSharpeRatio(chartData.equity);

  const filteredTrades = fullReport.trades.filter(t => t.date.getTime() >= startTs);
  let profit = 0, loss = 0, winning = 0, losing = 0;
  filteredTrades.forEach(t => {
    if (t.type === 'exit' && t.exitContext) {
      const pnl = t.shares * t.exitContext.priceChange - (t.commission || 0);
      if (pnl > 0) { profit += pnl; winning++; }
      else { loss += Math.abs(pnl); losing++; }
    }
  });

  const exits = winning + losing;
  return {
    report: {
      initialCapital: fullReport.initialCapital, finalCapital: fullReport.finalCapital,
      returns: fullReport.returns, returnsPercentage: fullReport.returnsPercentage,
      numberOfTrades: exits, numberOfWinningTrades: winning, numberOfLosingTrades: losing,
      winningRate: exits > 0 ? winning / exits : 0, profit, loss,
      stopLossExits: fullReport.stopLossExits, takeProfitExits: fullReport.takeProfitExits, strategyExits: fullReport.strategyExits,
      totalCommissions: fullReport.totalCommissions, totalSlippage: fullReport.totalSlippage,
      sharpeRatio,
      trades: filteredTrades.map((t) => ({
        type: t.type, tradedValue: t.tradedValue, date: t.date, short: t.short,
        exitReason: t.exitReason, shares: t.shares, commission: t.commission, slippage: t.slippage,
      })),
    },
    chartData,
  };
}
