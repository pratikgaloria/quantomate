import { Indicator, Dataset } from '@quantomate/core';
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
        const datasetLength = dataset.length;
        const lastAverageLoss = dataset.at(-2)?.getIndicator(this.name);

        if (lastAverageLoss && datasetLength > period) {
          const lastQuoteValue = dataset.valueAt(-1, attribute as string);
          const secondLastQuoteValue = dataset.valueAt(-2, attribute as string);
          const difference = lastQuoteValue - secondLastQuoteValue;

          const currentLoss = difference < 0 ? -difference : 0;

          return (lastAverageLoss * (period - 1) + currentLoss) / period;
        } else {
          const flattenDataset = dataset.flatten(attribute as string);
          return getAverageLoss(flattenDataset, period) || NaN;
        }
      },
      {
        params,
      }
    );
  }
}
