import { Indicator, Dataset, Quote } from '@quantomate/core';
import { EMA } from '../ema/ema';

interface IIndicatorParamsDEMA<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
}

export class DEMA<T = number> extends Indicator<IIndicatorParamsDEMA<T>, T> {
  constructor(name = 'DEMA', params: IIndicatorParamsDEMA<T>) {
    super(
      name,
      function (this: DEMA<T>, dataset: Dataset<T>) {
        const { attribute, period = 9 } = params;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
            return NaN;
        }

        const ema1Name = `${name}_ema1`;
        const ema2Name = `${name}_ema2`;

        // Try to get stored values
        const lastEMA1 = dataset.at(-1)?.getIndicator(ema1Name);
        const lastEMA2 = dataset.at(-1)?.getIndicator(ema2Name);

        if (lastEMA1 !== undefined && !isNaN(lastEMA1) && lastEMA2 !== undefined && !isNaN(lastEMA2)) {
             return 2 * lastEMA1 - lastEMA2;
        }

        // Full calculation fallback
        const smoothing = 2 / (period + 1);
        let ema1 = 0;
        let ema2 = 0;

        let sum = 0;
        for (let i = 0; i < period; i++) {
             sum += dataset.valueAt(i, attribute as string);
        }
        ema1 = sum / period;

        const ema1Values: number[] = new Array(datasetLength).fill(NaN);
        ema1Values[period - 1] = ema1;

        for (let i = period; i < datasetLength; i++) {
             const value = dataset.valueAt(i, attribute as string);
             ema1 = value * smoothing + ema1 * (1 - smoothing);
             ema1Values[i] = ema1;
        }

        if (datasetLength < 2 * period - 1) {
             return NaN;
        }

        sum = 0;
        for (let i = 0; i < period; i++) {
             sum += ema1Values[period - 1 + i];
        }
        ema2 = sum / period;

        for (let i = 2 * period - 1; i < datasetLength; i++) {
             const val = ema1Values[i];
             ema2 = val * smoothing + ema2 * (1 - smoothing);
        }

        return 2 * ema1 - ema2;
      },
      {
        params,
        beforeCalculate: (dataset: Dataset<T>) => {
             const { attribute, period = 9 } = params;
             const ema1Name = `${name}_ema1`;
             const ema2Name = `${name}_ema2`;

             if (dataset.indicators.some(i => i.name === ema1Name)) return;

             const ema1 = new EMA<T>(ema1Name, { period, attribute });
             dataset.apply(ema1);

             const smoothing = 2 / (period + 1);
             const startIndexEMA2 = 2 * period - 2;

             let ema2Prev = NaN;

             for (let i = 0; i < dataset.length; i++) {
                  const quote = dataset.at(i)!;
                  const ema1Value = quote.getIndicator(ema1Name);
                  let currentEMA2 = NaN;

                  if (!isNaN(ema1Value)) {
                      if (isNaN(ema2Prev)) {
                          if (i >= startIndexEMA2) {
                              let sum = 0;
                              for (let j = 0; j < period; j++) {
                                   sum += dataset.at(i - j)?.getIndicator(ema1Name) || 0;
                              }
                              ema2Prev = sum / period;
                              currentEMA2 = ema2Prev;
                          }
                      } else {
                          ema2Prev = ema1Value * smoothing + ema2Prev * (1 - smoothing);
                          currentEMA2 = ema2Prev;
                      }
                  }

                  if (!isNaN(currentEMA2)) {
                      quote.setIndicator(ema2Name, currentEMA2);
                      dataset.mutateAt(i, quote);
                  }
             }
        }
      }
    );

    this.withIncremental((prevDEMA: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
        const { attribute, period = 9 } = params;
        const smoothing = 2 / (period + 1);

        const ema1Name = `${name}_ema1`;
        const ema2Name = `${name}_ema2`;

        // Helper to get previous indicator value
        const getPrevIndicator = (indName: string) => {
             const val = dataset.at(-2)?.getIndicator(indName);
             return val !== undefined ? val : NaN;
        };

        const prevEMA1 = getPrevIndicator(ema1Name);
        const prevEMA2 = getPrevIndicator(ema2Name);

        const newValue = typeof newQuote.value === 'object'
            ? (newQuote.value as any)[attribute as string]
            : newQuote.value as number;

        let newEMA1: number;
        let newEMA2: number;

        // Calculate EMA1
        if (isNaN(prevEMA1)) {
            if (dataset.length === period) {
                let sum = 0;
                for (let i = 0; i < period; i++) {
                     sum += dataset.valueAt(i, attribute as string);
                }
                newEMA1 = sum / period;
            } else {
                newEMA1 = NaN;
            }
        } else {
            newEMA1 = newValue * smoothing + prevEMA1 * (1 - smoothing);
        }

        // Store EMA1
        if (!isNaN(newEMA1)) {
            const currentQuote = dataset.at(-1)!;
            currentQuote.setIndicator(ema1Name, newEMA1);
            dataset.mutateAt(dataset.length - 1, currentQuote);
        }

        // Calculate EMA2
        if (isNaN(newEMA1)) {
             newEMA2 = NaN;
        } else {
             if (isNaN(prevEMA2)) {
                 if (dataset.length === 2 * period - 1) {
                      let sum = 0;
                      sum += newEMA1;
                      for (let i = 1; i < period; i++) {
                           sum += dataset.at(dataset.length - 1 - i)?.getIndicator(ema1Name) || 0;
                      }
                      newEMA2 = sum / period;
                 } else {
                      newEMA2 = NaN;
                 }
             } else {
                 newEMA2 = newEMA1 * smoothing + prevEMA2 * (1 - smoothing);
             }
        }

        if (!isNaN(newEMA2)) {
             const currentQuote = dataset.at(-1)!;
             currentQuote.setIndicator(ema2Name, newEMA2);
             dataset.mutateAt(dataset.length - 1, currentQuote);
             return 2 * newEMA1 - newEMA2;
        }

        return NaN;
    });
  }
}
