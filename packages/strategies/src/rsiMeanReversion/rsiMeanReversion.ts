import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { RSI, SMA } from '@quantomate/indicators';

export interface RSIMeanReversionParams {
  rsiPeriod: number;
  oversoldThreshold: number;
  overboughtThreshold: number;
  smaPeriod?: number;
  useTrendFilter: boolean;
  source: string;
  direction?: 'long' | 'short' | 'both';
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
      direction: params.direction || 'both',
      entryWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;

        // Buy when oversold
        if (rsiValue >= oversoldThreshold) return false;

        // Optional trend filter: only buy if price above SMA (uptrend)
        if (useTrendFilter) {
          const smaValue = quote.getIndicator('sma');
          const price = typeof quote.value === 'object' ? (quote.value as any)[source] : quote.value;
          if (smaValue === undefined || isNaN(smaValue) || price < smaValue) return false;
        }

        return true;
      },
      exitWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;

        // Exit long when overbought
        return rsiValue >= overboughtThreshold;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;

        // Short when overbought
        if (rsiValue <= overboughtThreshold) return false;

        // Optional trend filter: only short if price below SMA (downtrend)
        if (useTrendFilter) {
          const smaValue = quote.getIndicator('sma');
          const price = typeof quote.value === 'object' ? (quote.value as any)[source] : quote.value;
          if (smaValue === undefined || isNaN(smaValue) || price > smaValue) return false;
        }

        return true;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;

        // Exit short when oversold
        return rsiValue <= oversoldThreshold;
      }
    });
  }
}
