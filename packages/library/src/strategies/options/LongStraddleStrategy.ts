import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { RSI } from '../../indicators';

export interface LongStraddleParams {
  rsiPeriod: number;
  lowerThreshold: number;
  upperThreshold: number;
  source: string;
}

export class LongStraddleStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<LongStraddleParams> = {}) {
    const { rsiPeriod = 14, lowerThreshold = 35, upperThreshold = 65, source = 'close' } = params;

    const rsi = new RSI<any>('rsi', { period: rsiPeriod, attribute: source });

    super(name, {
      indicators: [rsi],
      direction: 'long', // Straddle is long volatility
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'atm',
        expiryMode: 'nearest'
      },
      entryWhen: (quote: Quote<any>) => {
        const rsiVal = quote.getIndicator('rsi');
        if (rsiVal === undefined || isNaN(rsiVal)) return false;

        // Enter on volatility/trend breakout (RSI outside middle band 35-65)
        return rsiVal < lowerThreshold || rsiVal > upperThreshold;
      },
      exitWhen: (quote: Quote<any>) => {
        const rsiVal = quote.getIndicator('rsi');
        if (rsiVal === undefined || isNaN(rsiVal)) return false;

        // Exit when volatility cools down (RSI returns to balanced zone 45-55)
        return rsiVal >= 45 && rsiVal <= 55;
      }
    });
  }
}
