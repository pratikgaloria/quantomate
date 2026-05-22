import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { EMA, SMA } from '@quantomate/indicators';

export interface GoldenCrossParams {
  fastPeriod: number;
  slowPeriod: number;
  source: string;
  direction?: 'long' | 'short' | 'both';
}

export class GoldenCrossStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<GoldenCrossParams> = {}) {
    const { fastPeriod = 9, slowPeriod = 20, source = 'close' } = params;

    const fastSMA = new SMA<any>('fastSMA', { period: fastPeriod, attribute: source });
    const slowSMA = new SMA<any>('slowSMA', { period: slowPeriod, attribute: source });

    // Create indicators to track previous values and detect crossovers
    const prevFastSMAIndicator = new Indicator<any, any>(
      'prevFastSMA',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('fastSMA') ?? NaN;
      }
    );

    const prevSlowSMAIndicator = new Indicator<any, any>(
      'prevSlowSMA',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('slowSMA') ?? NaN;
      }
    );

    super(name, {
      indicators: [fastSMA, slowSMA, prevFastSMAIndicator, prevSlowSMAIndicator],
      direction: params.direction || 'both',
      entryWhen: (quote: Quote<any>) => {
        const fastSMAValue = quote.getIndicator('fastSMA');
        const slowSMAValue = quote.getIndicator('slowSMA');
        const prevFastSMA = quote.getIndicator('prevFastSMA');
        const prevSlowSMA = quote.getIndicator('prevSlowSMA');

        if (fastSMAValue === undefined || slowSMAValue === undefined || prevFastSMA === undefined || prevSlowSMA === undefined || isNaN(prevFastSMA) || isNaN(prevSlowSMA)) {
          return false;
        }

        // Buy Signal: Fast SMA crosses above Slow SMA
        return prevFastSMA <= prevSlowSMA && fastSMAValue > slowSMAValue;
      },
      exitWhen: (quote: Quote<any>) => {
        const fastSMAValue = quote.getIndicator('fastSMA');
        const slowSMAValue = quote.getIndicator('slowSMA');
        const prevFastSMA = quote.getIndicator('prevFastSMA');
        const prevSlowSMA = quote.getIndicator('prevSlowSMA');

        if (fastSMAValue === undefined || slowSMAValue === undefined || prevFastSMA === undefined || prevSlowSMA === undefined || isNaN(prevFastSMA) || isNaN(prevSlowSMA)) {
          return false;
        }

        // Sell Signal: Fast SMA crosses below Slow SMA
        return prevFastSMA >= prevSlowSMA && fastSMAValue < slowSMAValue;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const fastSMAValue = quote.getIndicator('fastSMA');
        const slowSMAValue = quote.getIndicator('slowSMA');
        const prevFastSMA = quote.getIndicator('prevFastSMA');
        const prevSlowSMA = quote.getIndicator('prevSlowSMA');

        if (fastSMAValue === undefined || slowSMAValue === undefined || prevFastSMA === undefined || prevSlowSMA === undefined || isNaN(prevFastSMA) || isNaN(prevSlowSMA)) {
          return false;
        }

        // Short Signal: Fast SMA crosses below Slow SMA
        return prevFastSMA >= prevSlowSMA && fastSMAValue < slowSMAValue;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const fastSMAValue = quote.getIndicator('fastSMA');
        const slowSMAValue = quote.getIndicator('slowSMA');
        const prevFastSMA = quote.getIndicator('prevFastSMA');
        const prevSlowSMA = quote.getIndicator('prevSlowSMA');

        if (fastSMAValue === undefined || slowSMAValue === undefined || prevFastSMA === undefined || prevSlowSMA === undefined || isNaN(prevFastSMA) || isNaN(prevSlowSMA)) {
          return false;
        }

        // Cover Signal: Fast SMA crosses above Slow SMA
        return prevFastSMA <= prevSlowSMA && fastSMAValue > slowSMAValue;
      }
    });
  }
}
