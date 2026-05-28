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

        if (datasetLength < 26) {
          return NaN;
        }

        const fastEMA = dataset.at(datasetLength - 1)?.getIndicator('ema12');
        const slowEMA = dataset.at(datasetLength - 1)?.getIndicator('ema26');

        if (fastEMA === undefined || slowEMA === undefined || isNaN(fastEMA) || isNaN(slowEMA)) {
          return NaN;
        }

        return fastEMA - slowEMA;
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
