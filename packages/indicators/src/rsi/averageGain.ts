import { Indicator, Dataset } from '@quantomate/core';
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
        const datasetLength = dataset.length;
        const lastAverageGain = dataset.at(-2)?.getIndicator(this.name);

        if (lastAverageGain && datasetLength > period) {
          const lastQuoteValue = dataset.valueAt(-1, attribute as string);
          const secondLastQuoteValue = dataset.valueAt(-2, attribute as string);
          const difference = lastQuoteValue - secondLastQuoteValue;

          const currentGain = difference > 0 ? difference : 0;

          return (lastAverageGain * (period - 1) + currentGain) / period;
        } else {
          const flattenDataset = dataset.flatten(attribute as string);
          return getAverageGain(flattenDataset, period) || NaN;
        }
      },
      {
        params,
      }
    );
  }
}
