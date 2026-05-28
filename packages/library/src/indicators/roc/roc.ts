import { Indicator, Dataset, Quote } from '@quantomate/core';

interface IIndicatorParamsROC<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
}

export class ROC<T = number> extends Indicator<IIndicatorParamsROC<T>, T> {
  constructor(name = 'ROC', params: IIndicatorParamsROC<T>) {
    super(
      name,
      function (this: ROC<T>, dataset: Dataset<T>) {
        const { attribute, period = 12 } = params;
        const datasetLength = dataset.length;

        if (datasetLength <= period) {
          return NaN;
        }

        const currentValue = dataset.valueAt(-1, attribute as string);
        const pastValue = dataset.valueAt(datasetLength - 1 - period, attribute as string);

        if (pastValue === 0) {
          return 0; // Avoid division by zero
        }

        return ((currentValue - pastValue) / pastValue) * 100;
      },
      {
        params,
      }
    );

    this.withIncremental((prevROC: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
        const { attribute, period = 12 } = params;
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

        if (pastValue === 0) {
            return 0;
        }

        return ((currentValue - pastValue) / pastValue) * 100;
    });
  }
}
