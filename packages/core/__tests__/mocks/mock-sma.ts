import { Dataset, Indicator } from '../../src';

export interface IIndicatorParamsSMA {
  period?: number;
  attribute?: string;
}

export class SMA<T = number> extends Indicator<IIndicatorParamsSMA, T> {
  constructor(name = 'SMA', params?: IIndicatorParamsSMA) {
    super(
      name,
      function(dataset: Dataset<T>) {
        const period = params?.period ?? 5;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
          return Number(
            params?.attribute
              ? dataset.at(-1)?.value[params.attribute]
              : dataset.at(-1)?.value
          );
        }

        let total = 0;
        for (let i = datasetLength - period; i < datasetLength; i++) {
          total += Number(
            params?.attribute
              ? dataset.at(i)?.value[params.attribute]
              : dataset.at(i)?.value
          );
        }

        return total / period;
      },
      {
        params,
      }
    );
  }
}
