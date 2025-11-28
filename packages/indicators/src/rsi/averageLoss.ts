import { Indicator, Dataset, Quote } from '@quantomate/core';
import { getAverageLoss } from '../utils';

interface IIndicatorParamsAverageLoss<T> {
  attribute?: T extends object ? keyof T : string;
  period: number;
}

export class AverageLoss<T = number> extends Indicator<
  IIndicatorParamsAverageLoss<T>,
  T
> {
  constructor(name = 'AverageLoss', params: IIndicatorParamsAverageLoss<T>) {
    super(
      name,
      function (this: AverageLoss<T>, dataset: Dataset<T>) {
        const { attribute, period } = params;
        const flattenDataset = dataset.flatten(attribute as string);
        return getAverageLoss(flattenDataset, period) || NaN;
      },
      {
        params,
      }
    );

    // Add incremental calculation
    this.withIncremental((prevAvgLoss: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
      const { attribute, period } = params;
      
      if (dataset.length <= period || isNaN(prevAvgLoss)) {
        return this.calculate(dataset);
      }

      const lastQuoteValue = typeof newQuote.value === 'object'
        ? (newQuote.value as any)[attribute as string]
        : newQuote.value as number;
      const secondLastQuoteValue = dataset.valueAt(-2, attribute as string);
      const difference = lastQuoteValue - secondLastQuoteValue;
      const currentLoss = difference < 0 ? -difference : 0;

      return (prevAvgLoss * (period - 1) + currentLoss) / period;
    });
  }
}
