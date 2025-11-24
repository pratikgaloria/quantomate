import { Indicator, Dataset } from '@quantomate/core';
import { SMA } from '../sma/sma';

type BollingerBandType = 'upper' | 'middle' | 'lower';

interface IIndicatorParamsBB<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
  multiplier?: number;
  band?: BollingerBandType;
}

/**
 * Calculates standard deviation for a dataset
 */
function calculateStandardDeviation<T>(
  dataset: Dataset<T>,
  period: number,
  mean: number,
  attribute?: string
): number {
  let sumSquaredDiff = 0;
  const datasetLength = dataset.length;

  for (let i = datasetLength - period; i < datasetLength; i++) {
    const value = Number(dataset.valueAt(i, attribute));
    const diff = value - mean;
    sumSquaredDiff += diff * diff;
  }

  return Math.sqrt(sumSquaredDiff / period);
}

/**
 * Calculates all three Bollinger Bands (upper, middle, lower)
 */
function calculateBollingerBands<T>(
  dataset: Dataset<T>,
  period: number,
  multiplier: number,
  attribute?: T extends object ? keyof T : string
): { upper: number; middle: number; lower: number } {
  // Calculate middle band (SMA)
  const sma = new SMA<T>('bb_sma_temp', { period, attribute: attribute as T extends object ? keyof T : string });
  const middle = sma.calculate(dataset);

  const datasetLength = dataset.length;

  if (datasetLength < period) {
    // Not enough data, return middle band for all
    return { upper: middle, middle, lower: middle };
  }

  // Calculate mean for standard deviation (same as SMA)
  let sum = 0;
  for (let i = datasetLength - period; i < datasetLength; i++) {
    sum += Number(dataset.valueAt(i, attribute as string));
  }
  const mean = sum / period;

  // Calculate standard deviation
  const stdDev = calculateStandardDeviation(
    dataset,
    period,
    mean,
    attribute as string
  );

  const upper = middle + multiplier * stdDev;
  const lower = middle - multiplier * stdDev;

  return { upper, middle, lower };
}

export class BB<T = number> extends Indicator<IIndicatorParamsBB<T>, T> {
  constructor(name = 'BB', params: IIndicatorParamsBB<T>) {
    super(
      name,
      function (this: BB<T>, dataset: Dataset<T>) {
        const {
          attribute,
          period = 20,
          multiplier = 2,
          band = 'middle',
        } = params;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
          // Not enough data, return the current value
          const currentValue = Number(dataset.valueAt(-1, attribute as string));
          return currentValue;
        }

        const bands = calculateBollingerBands(
          dataset,
          period,
          multiplier,
          attribute
        );

        return bands[band];
      },
      {
        params,
      }
    );
  }
}

