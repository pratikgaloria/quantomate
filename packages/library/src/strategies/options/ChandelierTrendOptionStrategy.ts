import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { ChandelierExit, RVOL } from '../../indicators';

export interface ChandelierTrendOptionParams {
  period: number;
  multiplier: number;
  rvolThreshold: number;
}

export class ChandelierTrendOptionStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<ChandelierTrendOptionParams> = {}) {
    const {
      period = 22,
      multiplier = 3.0,
      rvolThreshold = 2.0
    } = params;

    const chandelierLong = new ChandelierExit<any>('chandelierLong', { period, multiplier, line: 'long' });
    const chandelierShort = new ChandelierExit<any>('chandelierShort', { period, multiplier, line: 'short' });
    const rvol = new RVOL<any>('rvol');

    const prevCloseIndicator = new Indicator<any, any>(
      'prevClose',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.valueAt(currentIndex - 1, 'close') ?? NaN;
      }
    );

    const prevChandelierLongIndicator = new Indicator<any, any>(
      'prevChandelierLong',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('chandelierLong') ?? NaN;
      }
    );

    const prevChandelierShortIndicator = new Indicator<any, any>(
      'prevChandelierShort',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('chandelierShort') ?? NaN;
      }
    );

    super(name, {
      indicators: [
        chandelierLong,
        chandelierShort,
        rvol,
        prevCloseIndicator,
        prevChandelierLongIndicator,
        prevChandelierShortIndicator
      ],
      direction: 'both',
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'atm',
        expiryMode: 'nearest'
      },
      entryWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        if (close === undefined || isNaN(close)) return false;

        const chanShort = quote.getIndicator('chandelierShort');
        const rvolVal = quote.getIndicator('rvol');
        const prevClose = quote.getIndicator('prevClose');
        const prevChanShort = quote.getIndicator('prevChandelierShort');

        if (
          chanShort === undefined || isNaN(chanShort) ||
          rvolVal === undefined || isNaN(rvolVal) ||
          prevClose === undefined || isNaN(prevClose) ||
          prevChanShort === undefined || isNaN(prevChanShort)
        ) {
          return false;
        }

        return prevClose <= prevChanShort && close > chanShort && rvolVal >= rvolThreshold;
      },
      exitWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const chanLong = quote.getIndicator('chandelierLong');
        if (chanLong === undefined || isNaN(chanLong)) return false;

        return close < chanLong;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        if (close === undefined || isNaN(close)) return false;

        const chanLong = quote.getIndicator('chandelierLong');
        const rvolVal = quote.getIndicator('rvol');
        const prevClose = quote.getIndicator('prevClose');
        const prevChanLong = quote.getIndicator('prevChandelierLong');

        if (
          chanLong === undefined || isNaN(chanLong) ||
          rvolVal === undefined || isNaN(rvolVal) ||
          prevClose === undefined || isNaN(prevClose) ||
          prevChanLong === undefined || isNaN(prevChanLong)
        ) {
          return false;
        }

        return prevClose >= prevChanLong && close < chanLong && rvolVal >= rvolThreshold;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const chanShort = quote.getIndicator('chandelierShort');
        if (chanShort === undefined || isNaN(chanShort)) return false;

        return close > chanShort;
      }
    });
  }
}
