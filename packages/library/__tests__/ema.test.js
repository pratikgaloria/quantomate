"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@quantomate/core");
const src_1 = require("../src");
describe('EMA', () => {
    const data = [
        22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39,
    ];
    it('should calculate EMA correctly', () => {
        const ema = new src_1.EMA('ema10', { period: 10 });
        const ds = new core_1.Dataset(data);
        const result = ema.calculate(ds);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });
    it('should work with spread() and incremental calculation', () => {
        const ema = new src_1.EMA('ema5', { period: 5 });
        const ds = new core_1.Dataset(data);
        ema.spread(ds);
        const lastValue = ds.at(-1)?.getIndicator('ema5');
        expect(lastValue).toBeDefined();
        expect(typeof lastValue).toBe('number');
        expect(isNaN(lastValue)).toBe(false);
    });
});
