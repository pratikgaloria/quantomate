import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { EMA } from '../../indicators';

export interface IndexOptionMomentumParams {
  fastPeriod: number;
  slowPeriod: number;
  source: string;
}

export class IndexOptionMomentumStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<IndexOptionMomentumParams> = {}) {
    const { fastPeriod = 9, slowPeriod = 20, source = 'close' } = params;

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
      direction: 'both',
      entryWhen: (quote: Quote<any>) => {
        const fast = quote.getIndicator('fastEMA');
        const slow = quote.getIndicator('slowEMA');
        const prevFast = quote.getIndicator('prevFastEMA');
        const prevSlow = quote.getIndicator('prevSlowEMA');

        if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
          return false;
        }

        // Bullish crossover (EMA 9 crosses above EMA 20) -> Buy CE
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

        // Exit CE when Fast EMA crosses back below Slow EMA
        return prevFast >= prevSlow && fast < slow;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const fast = quote.getIndicator('fastEMA');
        const slow = quote.getIndicator('slowEMA');
        const prevFast = quote.getIndicator('prevFastEMA');
        const prevSlow = quote.getIndicator('prevSlowEMA');

        if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
          return false;
        }

        // Bearish crossover (EMA 9 crosses below EMA 20) -> Buy PE
        return prevFast >= prevSlow && fast < slow;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const fast = quote.getIndicator('fastEMA');
        const slow = quote.getIndicator('slowEMA');
        const prevFast = quote.getIndicator('prevFastEMA');
        const prevSlow = quote.getIndicator('prevSlowEMA');

        if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
          return false;
        }

        // Exit PE when Fast EMA crosses back above Slow EMA
        return prevFast <= prevSlow && fast > slow;
      }
    });
  }
}
