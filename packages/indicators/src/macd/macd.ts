import { Dataset, Indicator } from '@quantomate/core';
import { EMA } from '../';

interface IIndicatorParamsMACD<T> {
  attribute?: T extends object ? keyof T : string;
}

export class MACD<T> extends Indicator<IIndicatorParamsMACD<T>, T> {
  constructor(name = 'MACD', params: IIndicatorParamsMACD<T>) {
    super(
      name,
      function (this: MACD<T>, dataset: Dataset<T>) {
        const datasetLength = dataset.length;

        if (datasetLength === 1) {
          return 0;
        }

        return (
          dataset.quotes[datasetLength - 1].getIndicator('ema12') -
          dataset.quotes[datasetLength - 1].getIndicator('ema26')
        );
      },
      {
        params,
        beforeCalculate: (dataset: Dataset<T>) => {
          const ema12 = new EMA<T>('ema12', {
            period: 12,
            attribute: params.attribute,
          });
          const ema26 = new EMA<T>('ema26', {
            period: 26,
            attribute: params.attribute,
          });

          dataset.apply(ema12, ema26);
        },
      }
    );
  }
}
