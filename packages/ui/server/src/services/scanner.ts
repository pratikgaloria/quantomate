import * as fs from 'fs';
import * as path from 'path';
import { Dataset } from '@quantomate/core';
import { fetchStockData } from './stockDataFetcher';
import { createStrategy } from './backtestRunner';

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

      const dataset = new Dataset(stockData);
      const lastSignalQuote = strategy.scan(dataset);
      const currentQuote = dataset.at(-1)!;
      const currentPrice = (currentQuote.value as any).close;

      if (lastSignalQuote) {
        const signalValue = lastSignalQuote.value as any;
        const strategyValue = lastSignalQuote.getStrategy(strategy.name);
        if (!strategyValue) {
           return { symbol, hasSignal: false, lastClose: currentPrice };
        }

        const isShort = strategyValue.position.options?.short || false;
        const entryPrice = strategyId === 'pivot-trend' ? signalValue.open : signalValue.close;
        
        // P&L Calculation: (Current / Entry - 1) for Long, (1 - Current / Entry) for Short
        const movePercentage = isShort 
          ? (1 - (currentPrice / entryPrice)) * 100
          : ((currentPrice / entryPrice) - 1) * 100;
        
        // Calculate bars since signal
        let barsSinceSignal = 0;
        const signalTime = (lastSignalQuote.value as any).date.getTime();
        for (let i = dataset.length - 1; i >= 0; i--) {
          const quote = dataset.at(i);
          if (quote && (quote.value as any).date.getTime() === signalTime) {
            barsSinceSignal = dataset.length - 1 - i;
            break;
          }
        }

        return {
          symbol,
          hasSignal: true,
          signalDate: signalValue.date,
          direction: (isShort ? 'short' : 'long') as any,
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
