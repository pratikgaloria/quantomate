import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { MACD } from '@quantomate/indicators';

export interface MACDParams {
  signalPeriod: number;
  source: string;
}

export class MACDStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<MACDParams> = {}) {
    const {
      signalPeriod = 9,
      source = 'close',
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
          // Initial calculation using SMA
          if (currentIndex < period - 1) return NaN;

          if (currentIndex === period - 1) {
            let sum = 0;
            for (let k = 0; k < period; k++) {
              const val =
                dataset.at(currentIndex - k)?.getIndicator('macd') ?? NaN;
              if (isNaN(val)) return NaN;
              sum += val;
            }
            return sum / period;
          }

          // Fallback if we have enough data but no previous signal (should rarely happen in sequential processing)
          // We can try to calculate SMA if we have enough history
          if (currentIndex >= period) {
             let sum = 0;
             for (let k = 0; k < period; k++) {
                 const val = dataset.at(currentIndex - k)?.getIndicator('macd') ?? NaN;
                 if (isNaN(val)) return NaN; // Or skip?
                 sum += val;
             }
             return sum / period;
          }

          return NaN;
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
      entryWhen: (quote: Quote<any>) => {
        const macdValue = quote.getIndicator('macd');
        const signalValue = quote.getIndicator('signalLine');
        const prevM = quote.getIndicator('prevMacd');
        const prevS = quote.getIndicator('prevSignal');

        if (
          macdValue === undefined ||
          signalValue === undefined ||
          prevM === undefined ||
          prevS === undefined ||
          isNaN(prevM) ||
          isNaN(prevS)
        ) {
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

        if (
          macdValue === undefined ||
          signalValue === undefined ||
          prevM === undefined ||
          prevS === undefined ||
          isNaN(prevM) ||
          isNaN(prevS)
        ) {
          return false;
        }

        // Sell Signal: MACD crosses below Signal Line
        return prevM >= prevS && macdValue < signalValue;
      },
    });
  }
}
