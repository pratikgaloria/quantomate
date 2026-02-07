import { Indicator, Dataset, Quote } from '@quantomate/core';

interface IIndicatorParamsWMA<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
}

export class WMA<T = number> extends Indicator<IIndicatorParamsWMA<T>, T> {
  constructor(name = 'WMA', params: IIndicatorParamsWMA<T>) {
    super(
      name,
      function (this: WMA<T>, dataset: Dataset<T>) {
        const { attribute, period = 9 } = params;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
          return NaN;
        }

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < period; i++) {
          const weight = i + 1;
          const index = datasetLength - period + i;
          const value = dataset.valueAt(index, attribute as string);

          numerator += value * weight;
          denominator += weight;
        }

        return numerator / denominator;
      },
      {
        params,
      }
    );

    this.withIncremental((prevWMA: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
        const { attribute, period = 9 } = params;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
            return NaN;
        }

        if (isNaN(prevWMA) || datasetLength === period) {
            return this.calculate(dataset);
        }

        // Calculate sum of the previous period prices
        // WMA_new = (Sum_weighted_prev + n * NewValue - Sum_prev) / Denominator
        // where Sum_weighted_prev = prevWMA * Denominator

        const denominator = (period * (period + 1)) / 2;
        const prevWeightedSum = prevWMA * denominator;

        // Calculate sum of prices in the PREVIOUS window (excluding the new quote)
        // The previous window ended at datasetLength - 2
        // It started at datasetLength - period - 1
        let sumPrev = 0;
        for (let i = 0; i < period; i++) {
            const index = datasetLength - period - 1 + i;
            const val = dataset.valueAt(index, attribute as string);
            sumPrev += val;
        }

        const newValue = typeof newQuote.value === 'object'
            ? (newQuote.value as any)[attribute as string]
            : newQuote.value as number;

        const newWeightedSum = prevWeightedSum + period * newValue - sumPrev;

        return newWeightedSum / denominator;
    });
  }
}
