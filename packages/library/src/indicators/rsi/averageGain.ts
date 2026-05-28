import { Indicator, Dataset, Quote } from '@quantomate/core';
import { getAverageGain } from '../utils';

interface IIndicatorParamsAverageGain<T> {
  attribute?: T extends object ? keyof T : string;
  period: number;
}

export class AverageGain<T = number> extends Indicator<
  IIndicatorParamsAverageGain<T>,
  T
> {
  constructor(name = 'AverageGain', params: IIndicatorParamsAverageGain<T>) {
    super(
      name,
      function (this: AverageGain<T>, dataset: Dataset<T>) {
        const { attribute, period } = params;
        const flattenDataset = dataset.flatten(attribute as string);
        return getAverageGain(flattenDataset, period) || NaN;
      },
      {
        params,
      }
    );

    // Add incremental calculation
    this.withIncremental((prevAvgGain: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
      const { attribute, period } = params;
      
      if (dataset.length <= period || isNaN(prevAvgGain)) {
        return this.calculate(dataset);
      }

      const lastQuoteValue = typeof newQuote.value === 'object'
        ? (newQuote.value as any)[attribute as string]
        : newQuote.value as number;
      const secondLastQuoteValue = dataset.valueAt(-2, attribute as string);
      const difference = lastQuoteValue - secondLastQuoteValue;
      const currentGain = difference > 0 ? difference : 0;

      return (prevAvgGain * (period - 1) + currentGain) / period;
    });
  }
}
