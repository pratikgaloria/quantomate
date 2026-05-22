import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { MACD } from '@quantomate/indicators';

export interface MACDParams {
  signalPeriod: number;
  source: string;
  direction?: 'long' | 'short' | 'both';
}

export class MACDStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<MACDParams> = {}) {
    const {
      signalPeriod = 9,
      source = 'close',
      direction = 'both',
    } = params;

    const macd = new MACD<any>('macd', { attribute: source });

    const signalLine = new Indicator<any, any>(
      'signalLine',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 0) return NaN;

        const macdValue = dataset.at(currentIndex)?.getIndicator('macd');
        if (macdValue === undefined || isNaN(macdValue)) return NaN;

        const period = signalPeriod;
        const smoothing = 2 / (period + 1);

        const prevSignal = dataset
          .at(currentIndex - 1)
          ?.getIndicator('signalLine');

        if (prevSignal === undefined || isNaN(prevSignal)) {
          // Initial calculation using SMA: need enough valid MACD values
          let validMacdValues: number[] = [];
          for (let k = 0; k <= currentIndex; k++) {
            const val = dataset.at(k)?.getIndicator('macd');
            if (val !== undefined && !isNaN(val)) {
              validMacdValues.push(val);
            }
          }

          if (validMacdValues.length < period) return NaN;

          if (validMacdValues.length === period) {
            let sum = 0;
            for (const v of validMacdValues) sum += v;
            return sum / period;
          }

          // Fallback: if we somehow missed the first signal, calculate SMA of last period
          let sum = 0;
          let count = 0;
          for (let k = 0; k < period; k++) {
            const val = dataset.at(currentIndex - k)?.getIndicator('macd');
            if (val !== undefined && !isNaN(val)) {
              sum += val;
              count++;
            }
          }
          return count === period ? sum / period : NaN;
        }

        return (macdValue - prevSignal) * smoothing + prevSignal;
      }
    );

    const prevMacd = new Indicator<any, any>(
      'prevMacd',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('macd') ?? NaN;
      }
    );

    const prevSignal = new Indicator<any, any>(
      'prevSignal',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('signalLine') ?? NaN;
      }
    );

    super(name, {
      indicators: [macd, signalLine, prevMacd, prevSignal],
      direction,
      entryWhen: (quote: Quote<any>) => {
        const macdValue = quote.getIndicator('macd');
        const signalValue = quote.getIndicator('signalLine');
        const prevM = quote.getIndicator('prevMacd');
        const prevS = quote.getIndicator('prevSignal');

        if (macdValue === undefined || signalValue === undefined || prevM === undefined || prevS === undefined || isNaN(prevM) || isNaN(prevS)) {
          return false;
        }

        // Buy Signal: MACD crosses above Signal Line
        return prevM <= prevS && macdValue > signalValue;
      },
      exitWhen: (quote: Quote<any>) => {
        const macdValue = quote.getIndicator('macd');
        const signalValue = quote.getIndicator('signalLine');
        const prevM = quote.getIndicator('prevMacd');
        const prevS = quote.getIndicator('prevSignal');

        if (macdValue === undefined || signalValue === undefined || prevM === undefined || prevS === undefined || isNaN(prevM) || isNaN(prevS)) {
          return false;
        }

        // Sell Signal: MACD crosses below Signal Line
        return prevM >= prevS && macdValue < signalValue;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const macdValue = quote.getIndicator('macd');
        const signalValue = quote.getIndicator('signalLine');
        const prevM = quote.getIndicator('prevMacd');
        const prevS = quote.getIndicator('prevSignal');

        if (macdValue === undefined || signalValue === undefined || prevM === undefined || prevS === undefined || isNaN(prevM) || isNaN(prevS)) {
          return false;
        }

        // Short Signal: MACD crosses below Signal Line
        return prevM >= prevS && macdValue < signalValue;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const macdValue = quote.getIndicator('macd');
        const signalValue = quote.getIndicator('signalLine');
        const prevM = quote.getIndicator('prevMacd');
        const prevS = quote.getIndicator('prevSignal');

        if (macdValue === undefined || signalValue === undefined || prevM === undefined || prevS === undefined || isNaN(prevM) || isNaN(prevS)) {
          return false;
        }

        // Cover Signal: MACD crosses above Signal Line
        return prevM <= prevS && macdValue > signalValue;
      }
    });
  }
}
