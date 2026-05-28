import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { BB } from '../../indicators';

export interface BollingerBandsParams {
  period: number;
  multiplier: number;
  source: string;
  direction?: 'long' | 'short' | 'both';
}

export class BollingerBandsStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<BollingerBandsParams> = {}) {
    const { period = 20, multiplier = 2, source = 'close', direction = 'both' } = params;

    const bbUpper = new BB('bbUpper', {
      period,
      multiplier,
      band: 'upper',
      attribute: source,
    });
    const bbLower = new BB('bbLower', {
      period,
      multiplier,
      band: 'lower',
      attribute: source,
    });

    // Create indicators to track previous values
    const prevBBUpper = new Indicator<any, any>(
      'prevBBUpper',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('bbUpper') ?? NaN;
      }
    );

    const prevBBLower = new Indicator<any, any>(
      'prevBBLower',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('bbLower') ?? NaN;
      }
    );

    const prevPrice = new Indicator<any, any>(
      'prevPrice',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.valueAt(currentIndex - 1, source);
      }
    );

    super(name, {
      indicators: [bbUpper, bbLower, prevBBUpper, prevBBLower, prevPrice],
      direction,
      entryWhen: (quote: Quote<any>) => {
        const lower = quote.getIndicator('bbLower');
        const price =
          typeof quote.value === 'object'
            ? (quote.value as any)[source]
            : quote.value;

        const prevLower = quote.getIndicator('prevBBLower');
        const prevP = quote.getIndicator('prevPrice');

        if (
          lower === undefined ||
          price === undefined ||
          prevLower === undefined ||
          prevP === undefined ||
          isNaN(prevLower) ||
          isNaN(prevP)
        ) {
          return false;
        }

        // Buy Signal: Price crosses below Lower Band
        // meaning previous price was above or equal, current is below
        return prevP >= prevLower && price < lower;
      },
      exitWhen: (quote: Quote<any>) => {
        const upper = quote.getIndicator('bbUpper');
        const price =
          typeof quote.value === 'object'
            ? (quote.value as any)[source]
            : quote.value;

        const prevUpper = quote.getIndicator('prevBBUpper');
        const prevP = quote.getIndicator('prevPrice');

        if (
          upper === undefined ||
          price === undefined ||
          prevUpper === undefined ||
          prevP === undefined ||
          isNaN(prevUpper) ||
          isNaN(prevP)
        ) {
          return false;
        }

        // Sell Signal: Price crosses above Upper Band
        // meaning previous price was below or equal, current is above
        return prevP <= prevUpper && price > upper;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const upper = quote.getIndicator('bbUpper');
        const price = typeof quote.value === 'object' ? (quote.value as any)[source] : quote.value;
        const prevUpper = quote.getIndicator('prevBBUpper');
        const prevP = quote.getIndicator('prevPrice');

        if (upper === undefined || price === undefined || prevUpper === undefined || prevP === undefined || isNaN(prevUpper) || isNaN(prevP)) {
          return false;
        }

        // Short Signal: Price crosses above Upper Band
        return prevP <= prevUpper && price > upper;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const lower = quote.getIndicator('bbLower');
        const price = typeof quote.value === 'object' ? (quote.value as any)[source] : quote.value;
        const prevLower = quote.getIndicator('prevBBLower');
        const prevP = quote.getIndicator('prevPrice');

        if (lower === undefined || price === undefined || prevLower === undefined || prevP === undefined || isNaN(prevLower) || isNaN(prevP)) {
          return false;
        }

        // Cover Signal: Price crosses below Lower Band
        return prevP >= prevLower && price < lower;
      }
    });
  }
}
