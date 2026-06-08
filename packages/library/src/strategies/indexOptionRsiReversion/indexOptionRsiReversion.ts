import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { RSI } from '../../indicators';

export interface IndexOptionRsiReversionParams {
  rsiPeriod: number;
  oversoldThreshold: number;
  overboughtThreshold: number;
  source: string;
}

export class IndexOptionRsiReversionStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<IndexOptionRsiReversionParams> = {}) {
    const {
      rsiPeriod = 14,
      oversoldThreshold = 30,
      overboughtThreshold = 70,
      source = 'close',
    } = params;

    const rsi = new RSI<any>('rsi', { period: rsiPeriod, attribute: source });

    super(name, {
      indicators: [rsi],
      direction: 'both',
      entryWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;
        // Buy CE when index is oversold (RSI < 30)
        return rsiValue < oversoldThreshold;
      },
      exitWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;
        // Exit CE when index neutralizes (RSI reaches 50)
        return rsiValue >= 50;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;
        // Buy PE when index is overbought (RSI > 70)
        return rsiValue > overboughtThreshold;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const rsiValue = quote.getIndicator('rsi');
        if (rsiValue === undefined || isNaN(rsiValue)) return false;
        // Exit PE when index neutralizes (RSI drops to 50)
        return rsiValue <= 50;
      }
    });
  }
}
