import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { EMA, RSI } from '../../indicators';

export interface BearPutSpreadParams {
  fastPeriod: number;
  slowPeriod: number;
  rsiPeriod: number;
  rsiOversold: number;
  useRsiExit: boolean;
  source: string;
  strikeOffset: number;
}

export class BearPutSpreadStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<BearPutSpreadParams> = {}) {
    const {
      fastPeriod = 9,
      slowPeriod = 20,
      rsiPeriod = 14,
      rsiOversold = 35,
      useRsiExit = true,
      source = 'close',
      strikeOffset = 2
    } = params;

    const fastEMA = new EMA<any>('fastEMA', { period: fastPeriod, attribute: source });
    const slowEMA = new EMA<any>('slowEMA', { period: slowPeriod, attribute: source });
    const rsi = new RSI<any>('rsi', { period: rsiPeriod, attribute: source });

    const prevFastEMAIndicator = new Indicator<any, any>(
      'prevFastEMA',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('fastEMA') ?? NaN;
      }
    );

    const prevSlowEMAIndicator = new Indicator<any, any>(
      'prevSlowEMA',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('slowEMA') ?? NaN;
      }
    );

    super(name, {
      indicators: [fastEMA, slowEMA, rsi, prevFastEMAIndicator, prevSlowEMAIndicator],
      direction: 'short',
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'offset',
        strikeOffset: strikeOffset,
        expiryMode: 'nearest'
      },
      entryShortWhen: (quote: Quote<any>) => {
        const fast = quote.getIndicator('fastEMA');
        const slow = quote.getIndicator('slowEMA');
        const prevFast = quote.getIndicator('prevFastEMA');
        const prevSlow = quote.getIndicator('prevSlowEMA');

        if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
          return false;
        }

        return prevFast >= prevSlow && fast < slow;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const fast = quote.getIndicator('fastEMA');
        const slow = quote.getIndicator('slowEMA');
        const prevFast = quote.getIndicator('prevFastEMA');
        const prevSlow = quote.getIndicator('prevSlowEMA');
        const rsiVal = quote.getIndicator('rsi');

        // Exit early if RSI is oversold
        const shouldExitRsi = useRsiExit && rsiVal !== undefined && !isNaN(rsiVal) && rsiVal <= rsiOversold;
        if (shouldExitRsi) {
          return true;
        }

        if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
          return false;
        }

        return prevFast <= prevSlow && fast > slow;
      }
    });
  }
}
