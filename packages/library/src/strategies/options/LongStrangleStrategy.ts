import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { RSI } from '../../indicators';

export interface LongStrangleParams {
  rsiPeriod: number;
  lowerThreshold: number;
  upperThreshold: number;
  source: string;
  strikeOffset: number;
}

export class LongStrangleStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<LongStrangleParams> = {}) {
    const { rsiPeriod = 14, lowerThreshold = 35, upperThreshold = 65, source = 'close', strikeOffset = 2 } = params;

    const rsi = new RSI<any>('rsi', { period: rsiPeriod, attribute: source });

    super(name, {
      indicators: [rsi],
      direction: 'long',
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'offset',
        strikeOffset: strikeOffset,
        expiryMode: 'nearest'
      },
      entryWhen: (quote: Quote<any>) => {
        const rsiVal = quote.getIndicator('rsi');
        if (rsiVal === undefined || isNaN(rsiVal)) return false;

        return rsiVal < lowerThreshold || rsiVal > upperThreshold;
      },
      exitWhen: (quote: Quote<any>) => {
        const rsiVal = quote.getIndicator('rsi');
        if (rsiVal === undefined || isNaN(rsiVal)) return false;

        return rsiVal >= 45 && rsiVal <= 55;
      }
    });
  }
}
