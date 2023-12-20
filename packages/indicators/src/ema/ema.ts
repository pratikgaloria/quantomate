import { Indicator, Dataset } from '@quantomate/core';
import { SMA } from '..';

interface IIndicatorParamsEMA<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
}

export class EMA<T = number> extends Indicator<IIndicatorParamsEMA<T>, T> {
  constructor(name = 'EMA', params: IIndicatorParamsEMA<T>) {
    super(
      name,
      function (this: EMA<T>, dataset: Dataset<T>) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.length;

        const _smoothing = 2 / (period + 1);
        const lastEMA = dataset.at(-2)?.getIndicator(this.name);

        if (lastEMA && !isNaN(lastEMA) && datasetLength > period) {
          const value = dataset.valueAt(-1, attribute as string);
          return value * _smoothing + lastEMA * (1 - _smoothing);
        } else {
          if (datasetLength === period) {
            const sma = new SMA<T>('sma', { attribute, period });
            return sma.calculate(dataset);
          } else {
            if (datasetLength < period) {
              return NaN;
            } else {
              const dsSliced = new Dataset(dataset.quotes.slice(0, period).map(q => q.value));
              const dsRemaining = new Dataset(dataset.quotes.slice(period).map(q => q.value));
              this.spread(dsSliced);

              dsRemaining.quotes.forEach((q) => dsSliced.add(q));
              this.spread(dsSliced);

              return dsSliced.at(-1)?.getIndicator(this.name);
            }
          }
        }
      },
      {
        params,
      }
    );
  }
}
