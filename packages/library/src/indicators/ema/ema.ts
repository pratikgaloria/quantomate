import { Indicator, Dataset, Quote } from '@quantomate/core';
import { SMA } from '..';

interface IIndicatorParamsEMA<T> {
  attribute?: T extends object ? keyof T : string;
  period?: number;
}

export class EMA<T = number> extends Indicator<IIndicatorParamsEMA<T>, T> {
  constructor(name = 'EMA', params: IIndicatorParamsEMA<T>) {
    super(
      name,
      function (this: EMA<T>, dataset: Dataset<T>) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.length;

        if (datasetLength < period) {
          return NaN;
        }

        if (datasetLength === period) {
          // First EMA = SMA
          const sma = new SMA<T>('sma_temp', { attribute, period });
          return sma.calculate(dataset);
        }

        // For datasets > period, this should not be called if incremental is working
        // But provide a fallback that calculates EMA iteratively
        const smoothing = 2 / (period + 1);
        let ema = NaN;
        
        // Calculate initial EMA (SMA of first period values)
        let sum = 0;
        for (let i = 0; i < period; i++) {
          sum += dataset.valueAt(i, attribute as string);
        }
        ema = sum / period;
        
        // Apply EMA formula for remaining values
        for (let i = period; i < datasetLength; i++) {
          const value = dataset.valueAt(i, attribute as string);
          ema = value * smoothing + ema * (1 - smoothing);
        }
        
        return ema;
      },
      {
        params,
      }
    );

    // Add incremental calculation (O(1) update) after super()
    this.withIncremental((prevEMA: number, newQuote: Quote<T>, dataset: Dataset<T>) => {
      const { attribute, period = 5 } = params;
      const smoothing = 2 / (period + 1);
      
      if (dataset.length < period) {
        return NaN;
      }
      
      if (isNaN(prevEMA)) {
        // First EMA, calculate normally
        return this.calculate(dataset);
      }
      
      // Incremental: EMA = value * smoothing + prevEMA * (1 - smoothing)
      const value = typeof newQuote.value === 'object'
        ? (newQuote.value as any)[attribute as string]
        : newQuote.value as number;
      
      return value * smoothing + prevEMA * (1 - smoothing);
    });
  }
}
