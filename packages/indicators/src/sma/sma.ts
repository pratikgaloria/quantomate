import { Indicator, Dataset } from '@quantomate/core';

interface IIndicatorParamsSMA<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
}

export class SMA<T = number> extends Indicator<IIndicatorParamsSMA<T>, T> {
  constructor(name = 'SMA', params: IIndicatorParamsSMA<T>) {
    super(
      name,
      function (this: SMA<T>, dataset: Dataset<T>) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.length;

        const lastSMA = dataset.at(-2)?.getIndicator(this.name);

        if (lastSMA !== undefined && datasetLength > period) {
          const firstAttributeValue = dataset.valueAt(-1 - period, attribute as string);
          const lastAttributeValue = dataset.valueAt(-1, attribute as string);
          const change = lastAttributeValue - firstAttributeValue;

          return (lastSMA * period + change) / period;
        } else {
          if (datasetLength < period) {
            return dataset.valueAt(-1, attribute as string);
          } else {
            let total = 0;
            for (let i = datasetLength - period; i < datasetLength; i++) {
              total += dataset.valueAt(i, attribute as string);
            }

            return total / period;
          }
        }
      },
      {
        params,
      }
    );
  }
}
