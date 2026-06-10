import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { EMA } from '../../indicators';

export interface CoveredCallParams {
  fastPeriod: number;
  slowPeriod: number;
  source: string;
  strikeOffset: number;
}

export class CoveredCallStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<CoveredCallParams> = {}) {
    const { fastPeriod = 9, slowPeriod = 20, source = 'close', strikeOffset = 1 } = params;

    const fastEMA = new EMA<any>('fastEMA', { period: fastPeriod, attribute: source });
    const slowEMA = new EMA<any>('slowEMA', { period: slowPeriod, attribute: source });

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
      indicators: [fastEMA, slowEMA, prevFastEMAIndicator, prevSlowEMAIndicator],
      direction: 'long',
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'offset',
        strikeOffset: strikeOffset,
        expiryMode: 'nearest'
      },
      entryWhen: (quote: Quote<any>) => {
        const fast = quote.getIndicator('fastEMA');
        const slow = quote.getIndicator('slowEMA');
        const prevFast = quote.getIndicator('prevFastEMA');
        const prevSlow = quote.getIndicator('prevSlowEMA');

        if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
          return false;
        }

        return prevFast <= prevSlow && fast > slow;
      },
      exitWhen: (quote: Quote<any>) => {
        const fast = quote.getIndicator('fastEMA');
        const slow = quote.getIndicator('slowEMA');
        const prevFast = quote.getIndicator('prevFastEMA');
        const prevSlow = quote.getIndicator('prevSlowEMA');

        if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
          return false;
        }

        return prevFast >= prevSlow && fast < slow;
      }
    });
  }
}
