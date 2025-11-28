import { Indicator, Dataset, Quote } from '@quantomate/core';

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

        if (datasetLength < period) {
          return dataset.valueAt(-1, attribute as string);
        }

        // Full calculation: sum last N values
        let total = 0;
        for (let i = datasetLength - period; i < datasetLength; i++) {
          total += dataset.valueAt(i, attribute as string);
        }
        return total / period;
      },
      {
        params,
      }
    );

    // Add incremental calculation (O(1) update) after super()
    this.withIncremental((prevSMA: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
      const { attribute, period = 5 } = params;
      
      if (dataset.length < period) {
        return dataset.valueAt(-1, attribute as string);
      }
      
      if (dataset.length === period) {
        // First full SMA, calculate normally
        return this.calculate(dataset);
      }
      
      // Incremental: remove oldest, add newest
      const oldestValue = dataset.valueAt(-period - 1, attribute as string);
      const newestValue = typeof newQuote.value === 'object' 
        ? (newQuote.value as any)[attribute as string]
        : newQuote.value as number;
      
      return prevSMA + (newestValue - oldestValue) / period;
    });
  }
}
