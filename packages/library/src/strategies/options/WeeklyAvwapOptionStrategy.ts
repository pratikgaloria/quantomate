import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { WeeklyAVWAP, SMA } from '../../indicators';

export interface WeeklyAvwapOptionParams {
  volumeSmaPeriod: number;
}

export class WeeklyAvwapOptionStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<WeeklyAvwapOptionParams> = {}) {
    const { volumeSmaPeriod = 20 } = params;

    const weeklyAvwap = new WeeklyAVWAP<any>('weeklyAvwap');
    const volumeSma = new SMA<any>('volumeSma', { period: volumeSmaPeriod, attribute: 'volume' });

    const prevCloseIndicator = new Indicator<any, any>(
      'prevClose',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.valueAt(currentIndex - 1, 'close') ?? NaN;
      }
    );

    const prevWeeklyAvwapIndicator = new Indicator<any, any>(
      'prevWeeklyAvwap',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('weeklyAvwap') ?? NaN;
      }
    );

    super(name, {
      indicators: [weeklyAvwap, volumeSma, prevCloseIndicator, prevWeeklyAvwapIndicator],
      direction: 'both',
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'atm',
        expiryMode: 'nearest'
      },
      entryWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const volume = typeof quote.value === 'object' ? (quote.value as any).volume : undefined;
        if (close === undefined || volume === undefined || isNaN(close) || isNaN(volume)) return false;

        const avwapVal = quote.getIndicator('weeklyAvwap');
        const volSmaVal = quote.getIndicator('volumeSma');
        const prevClose = quote.getIndicator('prevClose');
        const prevAvwap = quote.getIndicator('prevWeeklyAvwap');

        if (
          avwapVal === undefined || isNaN(avwapVal) ||
          volSmaVal === undefined || isNaN(volSmaVal) ||
          prevClose === undefined || isNaN(prevClose) ||
          prevAvwap === undefined || isNaN(prevAvwap)
        ) {
          return false;
        }

        return prevClose <= prevAvwap && close > avwapVal && volume > volSmaVal;
      },
      exitWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const avwapVal = quote.getIndicator('weeklyAvwap');
        if (avwapVal === undefined || isNaN(avwapVal)) return false;

        return close < avwapVal;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const volume = typeof quote.value === 'object' ? (quote.value as any).volume : undefined;
        if (close === undefined || volume === undefined || isNaN(close) || isNaN(volume)) return false;

        const avwapVal = quote.getIndicator('weeklyAvwap');
        const volSmaVal = quote.getIndicator('volumeSma');
        const prevClose = quote.getIndicator('prevClose');
        const prevAvwap = quote.getIndicator('prevWeeklyAvwap');

        if (
          avwapVal === undefined || isNaN(avwapVal) ||
          volSmaVal === undefined || isNaN(volSmaVal) ||
          prevClose === undefined || isNaN(prevClose) ||
          prevAvwap === undefined || isNaN(prevAvwap)
        ) {
          return false;
        }

        return prevClose >= prevAvwap && close < avwapVal && volume > volSmaVal;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const avwapVal = quote.getIndicator('weeklyAvwap');
        if (avwapVal === undefined || isNaN(avwapVal)) return false;

        return close > avwapVal;
      }
    });
  }
}
