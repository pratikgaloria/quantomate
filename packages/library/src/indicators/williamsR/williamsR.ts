import { Indicator, Dataset } from '@quantomate/core';

interface IIndicatorParamsWilliamsR<T> {
  high?: T extends object ? keyof T : string;
  low?: T extends object ? keyof T : string;
  close?: T extends object ? keyof T : string;
  period?: number;
}

/**
 * Calculates Williams %R
 * Formula: %R = -100 × (Highest High - Close) / (Highest High - Lowest Low)
 * Values range from -100 to 0
 */
export class WilliamsR<T = number> extends Indicator<
  IIndicatorParamsWilliamsR<T>,
  T
> {
  constructor(name = 'WilliamsR', params: IIndicatorParamsWilliamsR<T>) {
    super(
      name,
      function (this: WilliamsR<T>, dataset: Dataset<T>) {
        const { high, low, close, period = 14 } = params;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
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

        for (let i = datasetLength - period; i < datasetLength; i++) {
          const highValue = Number(
            high ? dataset.valueAt(i, high as string) : dataset.valueAt(i)
          );
          const lowValue = Number(
            low ? dataset.valueAt(i, low as string) : dataset.valueAt(i)
          );

          if (highValue > highestHigh) {
            highestHigh = highValue;
          }
          if (lowValue < lowestLow) {
            lowestLow = lowValue;
          }
        }

        // Calculate %R
        const range = highestHigh - lowestLow;
        if (range === 0) {
          return -50; // If range is 0, return neutral value
        }

        return -100 * ((highestHigh - currentClose) / range);
      },
      {
        params,
      }
    );
  }
}

