import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { EMA, SMA } from '@quantomate/indicators';

export interface GoldenCrossParams {
  fastPeriod: number;
  slowPeriod: number;
  source: string;
}

export class GoldenCrossStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<GoldenCrossParams> = {}) {
    const { fastPeriod = 9, slowPeriod = 20, source = 'close' } = params;

    const fastEMA = new EMA<any>('fastEMA', { period: fastPeriod, attribute: source });
    const slowSMA = new SMA<any>('slowSMA', { period: slowPeriod, attribute: source });

    // Create indicators to track previous values and detect crossovers
    const prevFastEMAIndicator = new Indicator<any, any>(
      'prevFastEMA',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.quotes.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.quotes[currentIndex - 1].getIndicator('fastEMA') ?? NaN;
      }
    );

    const prevSlowSMAIndicator = new Indicator<any, any>(
      'prevSlowSMA',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.quotes.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.quotes[currentIndex - 1].getIndicator('slowSMA') ?? NaN;
      }
    );

    super(name, {
      indicators: [fastEMA, slowSMA, prevFastEMAIndicator, prevSlowSMAIndicator],
      entryWhen: (quote: Quote<any>) => {
        const fastEMAValue = quote.getIndicator('fastEMA');
        const slowSMAValue = quote.getIndicator('slowSMA');
        const prevFastEMA = quote.getIndicator('prevFastEMA');
        const prevSlowSMA = quote.getIndicator('prevSlowSMA');

        if (
          fastEMAValue === undefined ||
          slowSMAValue === undefined ||
          prevFastEMA === undefined ||
          prevSlowSMA === undefined ||
          isNaN(prevFastEMA) ||
          isNaN(prevSlowSMA)
        ) {
          return false;
        }

        // Buy Signal: Fast EMA crosses above Slow SMA
        return prevFastEMA <= prevSlowSMA && fastEMAValue > slowSMAValue;
      },
      exitWhen: (quote: Quote<any>) => {
        const fastEMAValue = quote.getIndicator('fastEMA');
        const slowSMAValue = quote.getIndicator('slowSMA');
        const prevFastEMA = quote.getIndicator('prevFastEMA');
        const prevSlowSMA = quote.getIndicator('prevSlowSMA');

        if (
          fastEMAValue === undefined ||
          slowSMAValue === undefined ||
          prevFastEMA === undefined ||
          prevSlowSMA === undefined ||
          isNaN(prevFastEMA) ||
          isNaN(prevSlowSMA)
        ) {
          return false;
        }

        // Sell Signal: Fast EMA crosses below Slow SMA
        return prevFastEMA >= prevSlowSMA && fastEMAValue < slowSMAValue;
      },
    });
  }
}
