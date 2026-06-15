import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { VWAP, RVOL } from '../../indicators';

export interface VwapRvolOptionParams {
  rvolThreshold: number;
  source: string;
}

export class VwapRvolOptionStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<VwapRvolOptionParams> = {}) {
    const { rvolThreshold = 2.0, source = 'close' } = params;

    const vwap = new VWAP<any>('vwap');
    const rvol = new RVOL<any>('rvol');

    const prevCloseIndicator = new Indicator<any, any>(
      'prevClose',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.valueAt(currentIndex - 1, 'close') ?? NaN;
      }
    );

    const prevVwapIndicator = new Indicator<any, any>(
      'prevVwap',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.at(currentIndex - 1)?.getIndicator('vwap') ?? NaN;
      }
    );

    super(name, {
      indicators: [vwap, rvol, prevCloseIndicator, prevVwapIndicator],
      direction: 'both',
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'atm',
        expiryMode: 'nearest'
      },
      entryWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const vwapVal = quote.getIndicator('vwap');
        const rvolVal = quote.getIndicator('rvol');
        const prevClose = quote.getIndicator('prevClose');
        const prevVwap = quote.getIndicator('prevVwap');

        if (vwapVal === undefined || rvolVal === undefined || prevClose === undefined || prevVwap === undefined || isNaN(prevClose) || isNaN(prevVwap)) {
          return false;
        }

        return prevClose <= prevVwap && close > vwapVal && rvolVal >= rvolThreshold;
      },
      exitWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const vwapVal = quote.getIndicator('vwap');
        if (vwapVal === undefined || isNaN(vwapVal)) return false;

        return close < vwapVal;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const vwapVal = quote.getIndicator('vwap');
        const rvolVal = quote.getIndicator('rvol');
        const prevClose = quote.getIndicator('prevClose');
        const prevVwap = quote.getIndicator('prevVwap');

        if (vwapVal === undefined || rvolVal === undefined || prevClose === undefined || prevVwap === undefined || isNaN(prevClose) || isNaN(prevVwap)) {
          return false;
        }

        return prevClose >= prevVwap && close < vwapVal && rvolVal >= rvolThreshold;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const vwapVal = quote.getIndicator('vwap');
        if (vwapVal === undefined || isNaN(vwapVal)) return false;

        return close > vwapVal;
      }
    });
  }
}
