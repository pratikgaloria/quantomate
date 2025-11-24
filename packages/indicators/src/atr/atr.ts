import { Indicator, Dataset } from '@quantomate/core';
import { SMA } from '../sma/sma';

interface IIndicatorParamsATR<T> {
  high?: T extends object ? keyof T : string;
  low?: T extends object ? keyof T : string;
  close?: T extends object ? keyof T : string;
  period?: number;
}

/**
 * Calculates True Range for a given quote
 * True Range = max(High-Low, |High-PrevClose|, |Low-PrevClose|)
 */
function calculateTrueRange<T>(
  dataset: Dataset<T>,
  index: number,
  high?: T extends object ? keyof T : string,
  low?: T extends object ? keyof T : string,
  close?: T extends object ? keyof T : string
): number {
  const currentHigh = Number(
    high ? dataset.valueAt(index, high as string) : dataset.valueAt(index)
  );
  const currentLow = Number(
    low ? dataset.valueAt(index, low as string) : dataset.valueAt(index)
  );
  const currentClose = Number(
    close ? dataset.valueAt(index, close as string) : dataset.valueAt(index)
  );

  // If it's the first quote, True Range is just High - Low
  if (index === 0) {
    return currentHigh - currentLow;
  }

  const prevClose = Number(
    close
      ? dataset.valueAt(index - 1, close as string)
      : dataset.valueAt(index - 1)
  );

  const hl = currentHigh - currentLow;
  const hc = Math.abs(currentHigh - prevClose);
  const lc = Math.abs(currentLow - prevClose);

  return Math.max(hl, hc, lc);
}

export class ATR<T = number> extends Indicator<IIndicatorParamsATR<T>, T> {
  constructor(name = 'ATR', params: IIndicatorParamsATR<T>) {
    super(
      name,
      function (this: ATR<T>, dataset: Dataset<T>) {
        const { high, low, close, period = 14 } = params;
        const datasetLength = dataset.length;

        if (datasetLength < 2) {
          // Need at least 2 quotes to calculate True Range
          return NaN;
        }

        // Check if we have previous ATR value for incremental calculation
        const lastATR = dataset.at(-2)?.getIndicator(this.name);
        const lastTrueRange = dataset.at(-1)?.getIndicator(`${this.name}_tr`);

        // If we have previous ATR and True Range, use incremental calculation
        if (
          lastATR !== undefined &&
          !isNaN(lastATR) &&
          lastTrueRange !== undefined &&
          !isNaN(lastTrueRange) &&
          datasetLength > period
        ) {
          // Get the oldest True Range that's being dropped
          const oldestIndex = datasetLength - period;
          const oldestTrueRange = dataset
            .at(oldestIndex)
            ?.getIndicator(`${this.name}_tr`);

          if (oldestTrueRange !== undefined && !isNaN(oldestTrueRange)) {
            // Incremental calculation: new ATR = (old ATR * period - oldest TR + newest TR) / period
            return (lastATR * period - oldestTrueRange + lastTrueRange) / period;
          }
        }

        // Fallback: calculate True Range for all quotes and then calculate ATR
        if (datasetLength < period + 1) {
          // Not enough data for full period, calculate average of available True Ranges
          let sumTR = 0;
          let count = 0;

          for (let i = 1; i < datasetLength; i++) {
            const tr = calculateTrueRange(dataset, i, high, low, close);
            sumTR += tr;
            count++;
          }

          return count > 0 ? sumTR / count : NaN;
        }

        // Calculate True Range for the last 'period' quotes
        let sumTR = 0;
        const startIndex = Math.max(1, datasetLength - period);

        for (let i = startIndex; i < datasetLength; i++) {
          const tr = calculateTrueRange(dataset, i, high, low, close);
          sumTR += tr;
        }

        return sumTR / period;
      },
      {
        params,
        beforeCalculate: (dataset: Dataset<T>) => {
          // Calculate and store True Range values for incremental calculation
          const trIndicatorName = `${this.name}_tr`;
          const trIndicator = dataset.indicators.find(
            (ind) => ind.name === trIndicatorName
          );

          if (!trIndicator) {
            // Calculate True Range for all quotes
            dataset.quotes.forEach((quote, index) => {
              if (index > 0) {
                // True Range requires previous close
                const tr = calculateTrueRange(
                  dataset,
                  index,
                  params.high,
                  params.low,
                  params.close
                );
                quote.setIndicator(trIndicatorName, tr);
              } else {
                // First quote: True Range is High - Low
                const high = Number(
                  params.high
                    ? quote.value[params.high as string]
                    : quote.value
                );
                const low = Number(
                  params.low ? quote.value[params.low as string] : quote.value
                );
                quote.setIndicator(trIndicatorName, high - low);
              }
            });
          }
        },
      }
    );
  }
}

