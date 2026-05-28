import { Indicator, Dataset, Quote } from '@quantomate/core';

interface IIndicatorParamsMOM<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
}

export class MOM<T = number> extends Indicator<IIndicatorParamsMOM<T>, T> {
  constructor(name = 'MOM', params: IIndicatorParamsMOM<T>) {
    super(
      name,
      function (this: MOM<T>, dataset: Dataset<T>) {
        const { attribute, period = 10 } = params;
        const datasetLength = dataset.length;

        if (datasetLength <= period) {
          return NaN;
        }

        const currentValue = dataset.valueAt(-1, attribute as string);
        const pastValue = dataset.valueAt(datasetLength - 1 - period, attribute as string);

        return currentValue - pastValue;
      },
      {
        params,
      }
    );

    this.withIncremental((prevMOM: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
        const { attribute, period = 10 } = params;
        const datasetLength = dataset.length;

        if (datasetLength <= period) {
            return NaN;
        }

        const currentValue = typeof newQuote.value === 'object'
            ? (newQuote.value as any)[attribute as string]
            : newQuote.value as number;

        // datasetLength is n. Index of new quote is n-1.
        // We want price at (n-1) - period.
        const pastIndex = datasetLength - 1 - period;
        const pastValue = dataset.valueAt(pastIndex, attribute as string);

        return currentValue - pastValue;
    });
  }
}
