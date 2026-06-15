import { Strategy, Quote, Indicator, Dataset } from '@quantomate/core';
import { BB, RVOL } from '../../indicators';

export interface VsaClimacticOptionParams {
  bbPeriod: number;
  bbStdDev: number;
  rvolThreshold: number;
  bodyMultiplier: number;
  source: string;
}

export class VsaClimacticOptionStrategy extends Strategy<any, any> {
  constructor(name: string, params: Partial<VsaClimacticOptionParams> = {}) {
    const {
      bbPeriod = 20,
      bbStdDev = 2.0,
      rvolThreshold = 2.0,
      bodyMultiplier = 0.8,
      source = 'close'
    } = params;

    const bbUpper = new BB<any>('bbUpper', { period: bbPeriod, multiplier: bbStdDev, band: 'upper', attribute: source });
    const bbMiddle = new BB<any>('bbMiddle', { period: bbPeriod, multiplier: bbStdDev, band: 'middle', attribute: source });
    const bbLower = new BB<any>('bbLower', { period: bbPeriod, multiplier: bbStdDev, band: 'lower', attribute: source });
    const rvol = new RVOL<any>('rvol');

    const avgBodySizeIndicator = new Indicator<any, any>(
      'avgBodySize',
      (dataset: Dataset<any>) => {
        const len = dataset.length;
        if (len < bbPeriod) return NaN;
        let sum = 0;
        for (let i = len - bbPeriod; i < len; i++) {
          const o = dataset.valueAt(i, 'open');
          const c = dataset.valueAt(i, 'close');
          if (o === undefined || c === undefined || isNaN(o) || isNaN(c)) continue;
          sum += Math.abs(c - o);
        }
        return sum / bbPeriod;
      }
    );

    super(name, {
      indicators: [bbUpper, bbMiddle, bbLower, rvol, avgBodySizeIndicator],
      direction: 'both',
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'atm',
        expiryMode: 'nearest'
      },
      entryWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const open = typeof quote.value === 'object' ? (quote.value as any).open : Number(quote.value);
        if (close === undefined || open === undefined || isNaN(close) || isNaN(open)) return false;

        const lowerBand = quote.getIndicator('bbLower');
        const rvolVal = quote.getIndicator('rvol');
        const avgBody = quote.getIndicator('avgBodySize');

        if (
          lowerBand === undefined || isNaN(lowerBand) ||
          rvolVal === undefined || isNaN(rvolVal) ||
          avgBody === undefined || isNaN(avgBody)
        ) {
          return false;
        }

        const bodySize = Math.abs(close - open);
        return close <= lowerBand && rvolVal >= rvolThreshold && bodySize < bodyMultiplier * avgBody;
      },
      exitWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const middleBand = quote.getIndicator('bbMiddle');
        if (middleBand === undefined || isNaN(middleBand)) return false;

        return close >= middleBand;
      },
      entryShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const open = typeof quote.value === 'object' ? (quote.value as any).open : Number(quote.value);
        if (close === undefined || open === undefined || isNaN(close) || isNaN(open)) return false;

        const upperBand = quote.getIndicator('bbUpper');
        const rvolVal = quote.getIndicator('rvol');
        const avgBody = quote.getIndicator('avgBodySize');

        if (
          upperBand === undefined || isNaN(upperBand) ||
          rvolVal === undefined || isNaN(rvolVal) ||
          avgBody === undefined || isNaN(avgBody)
        ) {
          return false;
        }

        const bodySize = Math.abs(close - open);
        return close >= upperBand && rvolVal >= rvolThreshold && bodySize < bodyMultiplier * avgBody;
      },
      exitShortWhen: (quote: Quote<any>) => {
        const close = typeof quote.value === 'object' ? (quote.value as any).close : Number(quote.value);
        const middleBand = quote.getIndicator('bbMiddle');
        if (middleBand === undefined || isNaN(middleBand)) return false;

        return close <= middleBand;
      }
    });
  }
}
