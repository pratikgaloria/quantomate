import * as fs from 'fs';
import * as path from 'path';
import { Bar, BarSeries } from '@quantomate/core';
import { fetchStockData } from './stockDataFetcher';
import { createStrategy, getIndicatorsForStrategy } from './backtestRunner';

export interface ScanResult {
  symbol: string;
  hasSignal: boolean;
  signalDate?: Date;
  entryPrice?: number;
  currentPrice?: number;
  movePercentage?: number;
  direction?: 'long' | 'short';
  barsSinceSignal?: number;
  lastClose?: number;
  error?: string;
}

export async function runScan(strategyId: string, parameters: Record<string, any>): Promise<ScanResult[]> {
  const symbolsPath = path.resolve(__dirname, '../../symbols.json');
  const symbols: string[] = JSON.parse(fs.readFileSync(symbolsPath, 'utf-8'));

  const scanResults: ScanResult[] = [];

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // ~100 days ago

  const strategy = createStrategy(strategyId, parameters);

  const scanPromises = symbols.map(async (symbol) => {
    try {
      const stockData = await fetchStockData(symbol, startDate, endDate, '1d');
      if (stockData.length === 0) {
        return { symbol, hasSignal: false, error: 'No data found' };
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

      const { indicatorSeriesMap, secondarySeriesMap } = getIndicatorsForStrategy(
        strategyId,
        series,
        parameters,
        strategyId === 'strong-pullback' ? series : undefined
      );

      const context = {
        getIndicatorSeries: (name: string) => indicatorSeriesMap.get(name),
        getSecondaryBarSeries: (id: string) => secondarySeriesMap.get(id),
      };

      let status: 'idle' | 'long' | 'short' = 'idle';
      let lastSignalIndex = -1;
      let lastSignalDirection: 'long' | 'short' = 'long';

      for (let i = 0; i < series.length; i++) {
        const signal = strategy.evaluate(series, i, context);

        if (status === 'idle') {
          if (signal.action === 'entry') {
            const isShort = signal.direction === 'short';
            status = isShort ? 'short' : 'long';
            lastSignalIndex = i;
            lastSignalDirection = isShort ? 'short' : 'long';
          }
        } else {
          if (signal.action === 'exit') {
            status = 'idle';
          }
        }
      }

      const currentPrice = series.at(-1)!.close;

      if (lastSignalIndex !== -1) {
        const lastSignalBar = series.at(lastSignalIndex)!;
        const entryPrice = strategyId === 'pivot-trend' ? lastSignalBar.open : lastSignalBar.close;
        const isShort = lastSignalDirection === 'short';

        // P&L Calculation: (Current / Entry - 1) for Long, (1 - Current / Entry) for Short
        const movePercentage = isShort 
          ? (1 - (currentPrice / entryPrice)) * 100
          : ((currentPrice / entryPrice) - 1) * 100;
        
        const barsSinceSignal = series.length - 1 - lastSignalIndex;

        return {
          symbol,
          hasSignal: true,
          signalDate: new Date(lastSignalBar.timestamp),
          direction: lastSignalDirection,
          entryPrice,
          currentPrice,
          movePercentage,
          barsSinceSignal,
          lastClose: currentPrice
        };
      }

      return {
        symbol,
        hasSignal: false,
        lastClose: currentPrice
      };
    } catch (error: any) {
      console.error(`Error scanning ${symbol}:`, error);
      return { symbol, hasSignal: false, error: error.message };
    }
  });

  return Promise.all(scanPromises);
}

