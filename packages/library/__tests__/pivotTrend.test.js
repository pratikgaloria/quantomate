"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@quantomate/core");
const src_1 = require("../src");
describe('PivotTrend indicator', () => {
    const data = [
        { high: 110, low: 100, close: 105 },
        { high: 115, low: 108, close: 112 },
        { high: 120, low: 110, close: 118 },
        { high: 118, low: 112, close: 115 },
    ];
    it('returns NaN when dataset length < 2', () => {
        const ds = new core_1.Dataset([data[0]]);
        const pt = new src_1.PivotTrend('pt', { high: 'high', low: 'low', close: 'close' });
        expect(Number.isNaN(pt.calculate(ds))).toBe(true);
    });
    it('computes pivot R S and returns 1 when close > R', () => {
        const ds = new core_1.Dataset(data.slice(0, 2));
        const pt = new src_1.PivotTrend('pt', { high: 'high', low: 'low', close: 'close' });
        const result = pt.calculate(ds);
        const prevHigh = 110, prevLow = 100, prevClose = 105;
        const pivot = (prevHigh + prevLow + prevClose) / 3;
        const R = 2 * pivot - prevLow;
        const currentClose = 112;
        expect(currentClose > R).toBe(true);
        expect(result).toBe(src_1.PIVOT_TREND_UP);
    });
    it('returns -1 when close < S', () => {
        const d = [
            { high: 120, low: 110, close: 115 },
            { high: 118, low: 112, close: 105 },
        ];
        const ds = new core_1.Dataset(d);
        const pt = new src_1.PivotTrend('pt', { high: 'high', low: 'low', close: 'close' });
        const result = pt.calculate(ds);
        expect(result).toBe(src_1.PIVOT_TREND_DOWN);
    });
    it('returns 0 when close between S and R', () => {
        const d = [
            { high: 100, low: 90, close: 95 },
            { high: 102, low: 98, close: 100 },
        ];
        const ds = new core_1.Dataset(d);
        const pt = new src_1.PivotTrend('pt', { high: 'high', low: 'low', close: 'close' });
        const result = pt.calculate(ds);
        expect(result).toBe(src_1.PIVOT_TREND_NEUTRAL);
    });
    it('spreads over dataset', () => {
        const ds = new core_1.Dataset(data);
        const pt = new src_1.PivotTrend('pivotTrend', { high: 'high', low: 'low', close: 'close' });
        pt.spread(ds);
        expect(ds.quotes.length).toBe(4);
        expect(Number.isNaN(ds.at(0)?.getIndicator('pivotTrend'))).toBe(true); // first bar has no prev
        const v1 = ds.at(1)?.getIndicator('pivotTrend');
        expect(v1 === src_1.PIVOT_TREND_UP || v1 === src_1.PIVOT_TREND_DOWN || v1 === src_1.PIVOT_TREND_NEUTRAL).toBe(true);
    });
});
