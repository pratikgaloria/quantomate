import {
  Strategy,
  Quote,
  Indicator,
  Dataset,
  TradePosition,
  StrategyValue,
} from '@quantomate/core';
import { EMA, ATR } from '@quantomate/indicators';

export interface OhiainParams {
  periodEMA9: number;
  periodEMA21: number;
  periodEMA50: number;
  periodATR: number;
  source: string;
}

export interface OhiainPositionOptions {
  stopLossPrice?: number;
  takeProfitPrice?: number;
}

export class OhiainStrategy extends Strategy<OhiainParams, any, OhiainPositionOptions> {
  constructor(name: string, params: Partial<OhiainParams> = {}) {
    const {
      periodEMA9 = 9,
      periodEMA21 = 21,
      periodEMA50 = 50,
      periodATR = 14,
      source = 'close',
    } = params;

    const ema9 = new EMA<any>('ema9', { period: periodEMA9, attribute: source });
    const ema21 = new EMA<any>('ema21', { period: periodEMA21, attribute: source });
    const ema50 = new EMA<any>('ema50', { period: periodEMA50, attribute: source });
    const atr = new ATR<any>('atr', { period: periodATR });

    const prevHigh = new Indicator<any, any>(
      'prevHigh',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.valueAt(currentIndex - 1, 'high');
      }
    );

    const prevClose = new Indicator<any, any>(
      'prevClose',
      (dataset: Dataset<any>) => {
        const currentIndex = dataset.length - 1;
        if (currentIndex < 1) return NaN;
        return dataset.valueAt(currentIndex - 1, source);
      }
    );

    super(name, {
      indicators: [ema9, ema21, ema50, atr, prevHigh, prevClose],
      entryWhen: (quote: Quote<any>) => {
        const ema9Val = quote.getIndicator('ema9');
        const ema21Val = quote.getIndicator('ema21');
        const ema50Val = quote.getIndicator('ema50');
        const atrVal = quote.getIndicator('atr');
        const prevH = quote.getIndicator('prevHigh');
        const prevC = quote.getIndicator('prevClose');

        const currentClose = typeof quote.value === 'object' ? (quote.value as any)[source] : quote.value;

        if (
          ema9Val === undefined ||
          ema21Val === undefined ||
          ema50Val === undefined ||
          atrVal === undefined ||
          prevH === undefined ||
          prevC === undefined ||
          isNaN(ema9Val) ||
          isNaN(ema21Val) ||
          isNaN(ema50Val) ||
          isNaN(atrVal) ||
          isNaN(prevH) ||
          isNaN(prevC)
        ) {
          return false;
        }

        // 1. Trend: Close > EMA50
        if (currentClose <= ema50Val) return false;

        // 2. Extension Check: Close < EMA50 + 4 * ATR
        if (currentClose >= ema50Val + 4 * atrVal) return false;

        // 3. Entry Triggers

        // A. Breakout trigger: Close > PrevHigh
        if (currentClose > prevH) {
            // Ensure we are not extended from 9 EMA too much (e.g. within 2 ATR)
            if (currentClose < ema9Val + 2 * atrVal) {
                return true;
            }
        }

        // B. Pullback trigger: Close > EMA9 AND Low < EMA9 (Touch and bounce)
        const currentLow = typeof quote.value === 'object' ? (quote.value as any)['low'] : currentClose;
        if (currentLow < ema9Val && currentClose > ema9Val && ema9Val > ema21Val) {
             return true;
        }

        return false;
      },
      exitWhen: (quote: Quote<any>) => {
        // Trailing Stop: Close below EMA21
        const ema21Val = quote.getIndicator('ema21');
        const currentClose = typeof quote.value === 'object' ? (quote.value as any)[source] : quote.value;

        if (ema21Val !== undefined && !isNaN(ema21Val) && currentClose < ema21Val) {
            return true;
        }
        return false;
      },
      stopLossWhen: (quote: Quote<any>, position: TradePosition<any>) => {
        const options = position.options as OhiainPositionOptions | undefined;
        // Check dynamic stop loss first
        if (options && options.stopLossPrice !== undefined) {
            const currentLow = typeof quote.value === 'object' ? (quote.value as any)['low'] : quote.value;
            if (currentLow < options.stopLossPrice) {
                return true;
            }
        }
        return false;
      },
      takeProfitWhen: (quote: Quote<any>, position: TradePosition<any>) => {
        const options = position.options as OhiainPositionOptions | undefined;
        // Check dynamic take profit first
        if (options && options.takeProfitPrice !== undefined) {
             const currentHigh = typeof quote.value === 'object' ? (quote.value as any)['high'] : quote.value;
             if (currentHigh >= options.takeProfitPrice) {
                 return true;
             }
        }
        return false;
      }
    });
  }

  // Override apply to inject risk management parameters on entry
  apply(
    quote: Quote<any>,
    position: TradePosition<OhiainPositionOptions> = new TradePosition('idle')
  ) {
    const result = super.apply(quote, position);

    // If we just entered (transition from idle/hold to entry)
    if (result.position.value === 'entry' && position.value !== 'entry') {
        const currentLow = typeof quote.value === 'object' ? (quote.value as any)['low'] : quote.value;
        const currentClose = typeof quote.value === 'object' ? (quote.value as any)['close'] : quote.value;

        // Stop Loss = Low of the entry candle
        const stopLossPrice = currentLow;

        // Risk = Entry Price (Close) - Stop Loss
        const risk = currentClose - stopLossPrice;

        // Take Profit = Entry Price + 2 * Risk (2R)
        // If risk is 0 or negative (shouldn't happen with proper data), ignore TP
        let takeProfitPrice = undefined;
        if (risk > 0) {
            takeProfitPrice = currentClose + 2 * risk;
        }

        const newPos = new TradePosition('entry', {
            ...result.position.options,
            stopLossPrice,
            takeProfitPrice
        });

        return new StrategyValue(newPos);
    }

    return result;
  }
}
