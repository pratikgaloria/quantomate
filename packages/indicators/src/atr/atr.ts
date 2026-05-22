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

        if (datasetLength < period) {
          return NaN;
        }

        const currentTR = calculateTrueRange(dataset, datasetLength - 1, high, low, close);
        const lastATR = dataset.at(-2)?.getIndicator(this.name);

        if (lastATR !== undefined && !isNaN(lastATR)) {
          // Wilder's Smoothing / RMA formula
          return (lastATR * (period - 1) + currentTR) / period;
        }

        // Initial calculation: SMA of first 'period' True Ranges
        let sumTR = 0;
        for (let i = 0; i < period; i++) {
          sumTR += calculateTrueRange(dataset, i, high, low, close);
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
            // Calculate True Range for all quotes
            for (let i = 0; i < dataset.length; i++) {
              const quote = dataset.at(i)!;

              if (i > 0) {
                // True Range requires previous close
                const tr = calculateTrueRange(
                  dataset,
                  i,
                  params.high,
                  params.low,
                  params.close
                );
                quote.setIndicator(trIndicatorName, tr);
              } else {
                // First quote: True Range is High - Low
                const high = Number(
                  params.high
                    ? (quote.value as any)[params.high as string]
                    : quote.value
                );
                const low = Number(
                  params.low ? (quote.value as any)[params.low as string] : quote.value
                );
                quote.setIndicator(trIndicatorName, high - low);
              }

              dataset.mutateAt(i, quote);
            }
          }
        },
      }
    );
  }
}

