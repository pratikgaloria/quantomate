import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { RSI, SMA } from '@quantomate/indicators';

export interface RSIMeanReversionParams {
  rsiPeriod: number;
  oversoldThreshold: number;
  overboughtThreshold: number;
  smaPeriod?: number;
  useTrendFilter: boolean;
  source: string;
}

export class RSIMeanReversionStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<RSIMeanReversionParams> = {}) {
    const {
      rsiPeriod = 14,
      oversoldThreshold = 30,
      overboughtThreshold = 70,
      smaPeriod = 50,
      useTrendFilter = false,
      source = 'close',
    } = params;

    const rsi = new RSI<any>('rsi', { period: rsiPeriod, attribute: source });
    const indicators: any[] = [rsi];
    
    if (useTrendFilter) {
      const sma = new SMA<any>('sma', { period: smaPeriod, attribute: source });
      indicators.push(sma);
    }

    super(name, {
      indicators,
      entryWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        
        if (rsiValue === undefined) return false;
        
        // Buy when oversold
        if (rsiValue >= oversoldThreshold) return false;
        
        // Optional trend filter: only buy if price above SMA
        if (useTrendFilter) {
          const smaValue = quote.getIndicator('sma');
          const price = quote.value[source];
          if (smaValue === undefined || price < smaValue) return false;
        }
        
        return true;
      },
      exitWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        
        if (rsiValue === undefined) return false;
        
        // Sell when overbought
        return rsiValue >= overboughtThreshold;
      },
    });
  }
}
