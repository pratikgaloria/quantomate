import { Indicator, Dataset } from '@quantomate/core';
import { SMA } from '../sma/sma';

interface IIndicatorParamsCCI<T> {
  high?: T extends object ? keyof T : string;
  low?: T extends object ? keyof T : string;
  close?: T extends object ? keyof T : string;
  period?: number;
}

/**
 * Calculates Typical Price
 * Typical Price = (High + Low + Close) / 3
 */
function calculateTypicalPrice<T>(
  dataset: Dataset<T>,
  index: number,
  high?: T extends object ? keyof T : string,
  low?: T extends object ? keyof T : string,
  close?: T extends object ? keyof T : string
): number {
  const highValue = Number(
    high ? dataset.valueAt(index, high as string) : dataset.valueAt(index)
  );
  const lowValue = Number(
    low ? dataset.valueAt(index, low as string) : dataset.valueAt(index)
  );
  const closeValue = Number(
    close ? dataset.valueAt(index, close as string) : dataset.valueAt(index)
  );

  return (highValue + lowValue + closeValue) / 3;
}

/**
 * Calculates Mean Deviation
 * Mean Deviation = average of |Typical Price - SMA of Typical Price|
 */
function calculateMeanDeviation<T>(
  dataset: Dataset<T>,
  period: number,
  smaValue: number,
  high?: T extends object ? keyof T : string,
  low?: T extends object ? keyof T : string,
  close?: T extends object ? keyof T : string
): number {
  const datasetLength = dataset.length;
  let sumDeviation = 0;

  for (let i = datasetLength - period; i < datasetLength; i++) {
    const typicalPrice = calculateTypicalPrice(
      dataset,
      i,
      high,
      low,
      close
    );
    sumDeviation += Math.abs(typicalPrice - smaValue);
  }

  return sumDeviation / period;
}

export class CCI<T = number> extends Indicator<IIndicatorParamsCCI<T>, T> {
  constructor(name = 'CCI', params: IIndicatorParamsCCI<T>) {
    super(
      name,
      function (this: CCI<T>, dataset: Dataset<T>) {
        const { high, low, close, period = 20 } = params;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
          return NaN;
        }

        // Calculate Typical Price for current quote
        const currentTypicalPrice = calculateTypicalPrice(
          dataset,
          datasetLength - 1,
          high,
          low,
          close
        );

        // Calculate SMA of Typical Price
        // We'll use a helper function to calculate SMA of typical prices
        let sumTypicalPrice = 0;
        for (let i = datasetLength - period; i < datasetLength; i++) {
          sumTypicalPrice += calculateTypicalPrice(dataset, i, high, low, close);
        }
        const smaTypicalPrice = sumTypicalPrice / period;

        // Calculate Mean Deviation
        const meanDeviation = calculateMeanDeviation(
          dataset,
          period,
          smaTypicalPrice,
          high,
          low,
          close
        );

        // Calculate CCI
        // CCI = (Typical Price - SMA of Typical Price) / (0.015 × Mean Deviation)
        if (meanDeviation === 0) {
          return 0; // Avoid division by zero
        }

        return (
          (currentTypicalPrice - smaTypicalPrice) / (0.015 * meanDeviation)
        );
      },
      {
        params,
      }
    );
  }
}

