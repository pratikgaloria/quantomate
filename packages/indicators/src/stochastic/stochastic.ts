import { Indicator, Dataset } from '@quantomate/core';

type StochasticType = 'k' | 'd';

interface IIndicatorParamsStochastic<T> {
  high?: T extends object ? keyof T : string;
  low?: T extends object ? keyof T : string;
  close?: T extends object ? keyof T : string;
  kPeriod?: number;
  dPeriod?: number;
  type?: StochasticType;
}

/**
 * Calculates %K (Stochastic Oscillator)
 */
function calculateStochasticK<T>(
  dataset: Dataset<T>,
  kPeriod: number,
  high?: T extends object ? keyof T : string,
  low?: T extends object ? keyof T : string,
  close?: T extends object ? keyof T : string
): number {
  const datasetLength = dataset.length;

  if (datasetLength < kPeriod) {
    return NaN;
  }

  // Get current close price
  const currentClose = Number(
    close
      ? dataset.valueAt(-1, close as string)
      : dataset.valueAt(-1)
  );

  // Find highest high and lowest low over the period
  let highestHigh = Number.NEGATIVE_INFINITY;
  let lowestLow = Number.POSITIVE_INFINITY;

  for (let i = datasetLength - kPeriod; i < datasetLength; i++) {
    const highValue = Number(
      high
        ? dataset.valueAt(i, high as string)
        : dataset.valueAt(i)
    );
    const lowValue = Number(
      low
        ? dataset.valueAt(i, low as string)
        : dataset.valueAt(i)
    );

    if (highValue > highestHigh) {
      highestHigh = highValue;
    }
    if (lowValue < lowestLow) {
      lowestLow = lowValue;
    }
  }

  // Calculate %K
  const range = highestHigh - lowestLow;
  if (range === 0) {
    return 50; // If range is 0, return neutral value
  }

  return 100 * ((currentClose - lowestLow) / range);
}

export class Stochastic<T = number> extends Indicator<
  IIndicatorParamsStochastic<T>,
  T
> {
  constructor(name = 'Stochastic', params: IIndicatorParamsStochastic<T>) {
    super(
      name,
      function (this: Stochastic<T>, dataset: Dataset<T>) {
        const {
          high,
          low,
          close,
          kPeriod = 14,
          dPeriod = 3,
          type = 'k',
        } = params;
        const datasetLength = dataset.length;

        if (datasetLength < kPeriod) {
          return NaN;
        }

        // Calculate %K
        const kValue = calculateStochasticK(
          dataset,
          kPeriod,
          high,
          low,
          close
        );

        if (isNaN(kValue)) {
          return NaN;
        }

        // If type is 'k', return %K
        if (type === 'k') {
          return kValue;
        }

        // If type is 'd', calculate %D (SMA of %K)
        // %D is the moving average of %K over dPeriod
        if (type === 'd') {
          const minRequiredLength = kPeriod + dPeriod - 1;
          if (datasetLength < minRequiredLength) {
            return NaN;
          }

          // Check if we have previous %K values stored as indicators
          const kIndicatorName = `${name}_k`;
          const lastK = dataset.at(-2)?.getIndicator(kIndicatorName);

          // If we have previous %K, we can use incremental calculation
          if (lastK !== undefined && !isNaN(lastK) && datasetLength > minRequiredLength) {
            // Get the oldest %K value that's being dropped
            const oldestIndex = datasetLength - dPeriod;
            const oldestK = dataset.at(oldestIndex)?.getIndicator(kIndicatorName);

            if (oldestK !== undefined && !isNaN(oldestK)) {
              // Incremental calculation: new average = (old average * period - oldest + newest) / period
              const previousD = dataset.at(-2)?.getIndicator(name);
              if (previousD !== undefined && !isNaN(previousD)) {
                return (previousD * dPeriod - oldestK + kValue) / dPeriod;
              }
            }
          }

          // Fallback: use %K values from indicators if available, otherwise calculate
          const kValues: number[] = [];
          let allKValuesAvailable = true;

          // Try to get %K values from indicators first
          for (let i = datasetLength - dPeriod; i < datasetLength; i++) {
            const kFromIndicator = dataset.at(i)?.getIndicator(kIndicatorName);
            if (kFromIndicator !== undefined && !isNaN(kFromIndicator)) {
              kValues.push(kFromIndicator);
            } else {
              allKValuesAvailable = false;
              break;
            }
          }

          // If we have all %K values from indicators, use them
          if (allKValuesAvailable && kValues.length === dPeriod) {
            const sum = kValues.reduce((acc, val) => acc + val, 0);
            return sum / dPeriod;
          }

          // Otherwise, calculate %K for the last dPeriod values
          for (let i = datasetLength - dPeriod; i < datasetLength; i++) {
            // Create a sub-dataset up to index i
            // Create a sub-dataset up to index i
            const values: T[] = [];
            for (let j = 0; j <= i; j++) {
              values.push(dataset.valueAt(j) as T);
            }
            const subDataset = new Dataset<T>(values);

            const k = calculateStochasticK(
              subDataset,
              kPeriod,
              high,
              low,
              close
            );

            if (!isNaN(k)) {
              kValues.push(k);
            }
          }

          if (kValues.length === 0) {
            return NaN;
          }

          // Calculate average (SMA) of %K values
          const sum = kValues.reduce((acc, val) => acc + val, 0);
          return sum / kValues.length;
        }

        return kValue;
      },
      {
        params,
        beforeCalculate: (dataset: Dataset<T>) => {
          // If calculating %D, we need %K values to be available
          if (params.type === 'd') {
            const kIndicatorName = `${name}_k`;
            const kIndicator = dataset.indicators.find(
              (ind) => ind.name === kIndicatorName
            );

            if (!kIndicator) {
              // Create and apply %K indicator
              const kStochastic = new Stochastic<T>(kIndicatorName, {
                ...params,
                type: 'k',
              });
              kStochastic.spread(dataset);
            }
          }
        },
      }
    );
  }
}

