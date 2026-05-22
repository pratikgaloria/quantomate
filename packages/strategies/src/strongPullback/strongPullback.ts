import { Strategy, Quote, StrategyContext, TradePosition } from '@quantomate/core';
import { EMA, VWAP, RVOL, ATR, Slope } from '@quantomate/indicators';

export interface StrongPullbackParams {
    emaPeriod?: number;
    dailyEmaPeriod?: number;
    rvolPeriod?: number;
    atrPeriod?: number;
    atrMultiplier?: number;
    rvolThreshold?: number;
    vwapDistanceAtrRatio?: number;
    tp1_R?: number;
    tp2_R?: number;
    tp1_pct?: number;
    direction?: 'long' | 'short' | 'both';
    attribute?: string;
    high?: string;
    low?: string;
    volume?: string;
}

/**
 * Strong Pullback Strategy
 * 
 * Multi-timeframe strategy that looks for intraday pullbacks in a strong higher-timeframe trend.
 */
export class StrongPullback extends Strategy<StrongPullbackParams, any> {
    private params: StrongPullbackParams;
    constructor(params: StrongPullbackParams = {}) {
        const {
            emaPeriod = 20,
            dailyEmaPeriod = 50,
            rvolPeriod = 20,
            atrPeriod = 14,
            rvolThreshold = 1.2,
            vwapDistanceAtrRatio = 0.5,
            direction = 'both',
            attribute = 'close',
            high = 'high',
            low = 'low',
            volume = 'volume'
        } = params;

        const ema20 = new EMA('EMA20', { period: emaPeriod, attribute });
        const vwap = new VWAP('VWAP', { attribute: 'hlc3', volume });
        const rvol = new RVOL('RVOL', { period: rvolPeriod, volume });
        const atr = new ATR('ATR', { period: atrPeriod, high, low, close: attribute });

        super('StrongPullback', {
            indicators: [ema20, vwap, rvol, atr],
            direction,
            entryWhen: (quote: Quote<any>, context: StrategyContext<any>) => {
                // 1. Higher Timeframe Bias (Daily)
                // Use lookahead-free daily quote
                const dailyQuote = context.getQuoteBefore('daily');
                if (!dailyQuote) return false;

                const dClose = typeof dailyQuote.value === 'object' ? dailyQuote.value.close : dailyQuote.value;
                const dEma50 = dailyQuote.getIndicator('EMA50');
                if (dEma50 === undefined) return false;
                if (dClose <= dEma50) return false;

                // 2. Intraday Trend Detection
                const currentPrice = typeof quote.value === 'object' ? quote.value.close : quote.value;
                const currentVwap = quote.getIndicator('VWAP');
                const currentEma20 = quote.getIndicator('EMA20');

                if (currentVwap === undefined || currentEma20 === undefined) return false;

                // Intraday trend filter
                if (currentPrice <= currentVwap || currentEma20 <= currentVwap) return false;

                // 3. Entry Conditions
                const currentRvol = quote.getIndicator('RVOL');
                const currentAtr = quote.getIndicator('ATR');

                if (currentRvol === undefined || currentAtr === undefined) return false;

                // Volume spike
                if (currentRvol <= rvolThreshold) return false;

                // Distance to VWAP
                if (Math.abs(currentPrice - currentVwap) > vwapDistanceAtrRatio * currentAtr) return false;

                // 4. Trigger: Reclaim EMA20 (Crossover)
                const prevPrimary = context.previousPrimaryQuote;
                if (!prevPrimary) return false;

                const prevPrice = typeof prevPrimary.value === 'object' ? prevPrimary.value.close : prevPrimary.value;
                const prevEma20 = prevPrimary.getIndicator('EMA20');

                if (prevEma20 === undefined) return false;

                // True crossover: (Price was below EMA20) AND (Price is now above EMA20)
                return prevPrice <= prevEma20 && currentPrice > currentEma20;
            },
            entryShortWhen: (quote: Quote<any>, context: StrategyContext<any>) => {
                // 1. Higher Timeframe Bias (Daily)
                const dailyQuote = context.getQuoteBefore('daily');
                if (!dailyQuote) return false;

                const dClose = typeof dailyQuote.value === 'object' ? dailyQuote.value.close : dailyQuote.value;
                const dEma50 = dailyQuote.getIndicator('EMA50');
                if (dEma50 === undefined) return false;
                if (dClose >= dEma50) return false;

                // 2. Intraday Trend Detection
                const currentPrice = typeof quote.value === 'object' ? quote.value.close : quote.value;
                const currentVwap = quote.getIndicator('VWAP');
                const currentEma20 = quote.getIndicator('EMA20');

                if (currentVwap === undefined || currentEma20 === undefined) return false;
                if (currentPrice >= currentVwap || currentEma20 >= currentVwap) return false;

                // 3. Entry Conditions
                const currentRvol = quote.getIndicator('RVOL');
                const currentAtr = quote.getIndicator('ATR');
                if (currentRvol === undefined || currentAtr === undefined) return false;
                if (currentRvol <= rvolThreshold) return false;
                if (Math.abs(currentPrice - currentVwap) > vwapDistanceAtrRatio * currentAtr) return false;

                // 4. Trigger: Pullback and Reclaim EMA20 (Cross-under)
                const prevPrimary = context.previousPrimaryQuote;
                if (!prevPrimary) return false;
                const prevPrice = typeof prevPrimary.value === 'object' ? prevPrimary.value.close : prevPrimary.value;
                const prevEma20 = prevPrimary.getIndicator('EMA20');
                if (prevEma20 === undefined) return false;

                return prevPrice >= prevEma20 && currentPrice < currentEma20;
            }
        });

        this.params = params;
    }

    /**
     * Prepares a higher-timeframe dataset (daily) with indicators needed for this strategy.
     */
    static prepareDaily(dailyDataset: any, dailyEmaPeriod = 50, attribute = 'close') {
        dailyDataset.apply(new EMA('EMA50', { period: dailyEmaPeriod, attribute }));
        dailyDataset.apply(new Slope('EMA50_Slope', { attribute: 'EMA50' }));
    }

    /**
     * Overriding apply to handle the complex trade management (Multi-target TP)
     */
    apply(quote: Quote<any>, position: TradePosition<any>, context: StrategyContext<any>) {
        const result = super.apply(quote, position, context);

        const {
            atrMultiplier = 1.0,
            tp1_R = 1.0,
            tp2_R = 2.0,
            tp1_pct = 50
        } = this.params;

        // Trade Management: Check for SL and TPs only if we are holding or just entered
        if (result.position.value === 'hold' || result.position.value === 'entry') {
            const currentPrice = typeof quote.value === 'object' ? (quote.value.close || quote.value.open) : quote.value;

            // The backtest engine will populate 'entryPrice' in position.options once we are in 'hold' mode.
            // If it's not there yet (the entry bar itself), we use the current price as a placeholder.
            let stopLoss = position.options?.stopLoss;
            let tp1 = position.options?.tp1;
            let tp2 = position.options?.tp2;
            let tp1Reached = position.options?.tp1Reached || false;

            if (stopLoss === undefined) {
                // Initialize SL/TPs
                const entryPrice = position.options?.entryPrice || currentPrice;
                const currentAtr = quote.getIndicator('ATR');
                const r = currentAtr * atrMultiplier;
                const isShort = result.position.options?.short;

                if (isShort) {
                    stopLoss = entryPrice + r;
                    tp1 = entryPrice - (r * tp1_R);
                    tp2 = entryPrice - (r * tp2_R);
                } else {
                    stopLoss = entryPrice - r;
                    tp1 = entryPrice + (r * tp1_R);
                    tp2 = entryPrice + (r * tp2_R);
                }

                // Update the result so these are stored in the position
                result.position = new TradePosition(result.position.value, {
                    ...result.position.options,
                    stopLoss,
                    tp1,
                    tp2,
                    r,
                    tp1Reached,
                });
            }

            // If we are in 'hold' mode, check for exits
            if (result.position.value === 'hold') {
                const isShort = position.options?.short;

                if (isShort) {
                    // Short Exits
                    // 1. Stop Loss Check
                    if (currentPrice >= stopLoss) {
                        return {
                            position: new TradePosition('exit', {
                                ...result.position.options,
                                exitReason: 'stop-loss',
                                exitRatio: 1.0,
                            }),
                        };
                    }

                    // 2. Take Profit 1 Check
                    if (!tp1Reached && currentPrice <= tp1) {
                        return {
                            position: new TradePosition('exit', {
                                ...result.position.options,
                                exitReason: 'take-profit',
                                exitRatio: tp1_pct / 100,
                                tp1Reached: true,
                            }),
                        };
                    }

                    // 3. Take Profit 2 Check
                    if (tp1Reached && currentPrice <= tp2) {
                        return {
                            position: new TradePosition('exit', {
                                ...result.position.options,
                                exitReason: 'take-profit',
                                exitRatio: 1.0,
                            }),
                        };
                    }
                } else {
                    // Long Exits
                    // 1. Stop Loss Check
                    if (currentPrice <= stopLoss) {
                        return {
                            position: new TradePosition('exit', {
                                ...result.position.options,
                                exitReason: 'stop-loss',
                                exitRatio: 1.0,
                            }),
                        };
                    }

                    // 2. Take Profit 1 Check
                    if (!tp1Reached && currentPrice >= tp1) {
                        return {
                            position: new TradePosition('exit', {
                                ...result.position.options,
                                exitReason: 'take-profit',
                                exitRatio: tp1_pct / 100,
                                tp1Reached: true,
                            }),
                        };
                    }

                    // 3. Take Profit 2 Check
                    if (tp1Reached && currentPrice >= tp2) {
                        return {
                            position: new TradePosition('exit', {
                                ...result.position.options,
                                exitReason: 'take-profit',
                                exitRatio: 1.0,
                            }),
                        };
                    }
                }
            }
        }

        return result;
    }
}
