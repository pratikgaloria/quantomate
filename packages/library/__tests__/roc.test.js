"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@quantomate/core");
const src_1 = require("../src");
describe('ROC', () => {
    const data = [10, 11, 12, 13, 14];
    it('should calculate ROC correctly', () => {
        const roc = new src_1.ROC('roc2', { period: 2 });
        const ds = new core_1.Dataset(data);
        // Dataset length 5. Last value 14.
        // Past value (index 5-1-2 = 2) is 12.
        // ROC = (14-12)/12 * 100 = 2/12 * 100 = 16.6666...
        const result = roc.calculate(ds);
        expect(result).toBeCloseTo(16.6667, 4);
    });
    it('should work with spread()', () => {
        const roc = new src_1.ROC('roc2', { period: 2 });
        const ds = new core_1.Dataset(data);
        // i=0,1: NaN
        // i=2: (12-10)/10*100 = 20
        // i=3: (13-11)/11*100 = 18.1818
        // i=4: 16.6667
        roc.spread(ds);
        expect(ds.at(0)?.getIndicator('roc2')).toBeNaN();
        expect(ds.at(1)?.getIndicator('roc2')).toBeNaN();
        expect(ds.at(2)?.getIndicator('roc2')).toBeCloseTo(20, 4);
        expect(ds.at(3)?.getIndicator('roc2')).toBeCloseTo(18.1818, 4);
        expect(ds.at(4)?.getIndicator('roc2')).toBeCloseTo(16.6667, 4);
    });
    it('should work incrementally when adding new quotes', () => {
        const roc = new src_1.ROC('roc2', { period: 2 });
        const ds = new core_1.Dataset([10, 11, 12, 13, 14]);
        ds.apply(roc);
        // Add 15
        ds.add(15);
        // ROC = (15-13)/13 * 100 = 2/13 * 100 = 15.3846...
        const lastValue = ds.at(-1)?.getIndicator('roc2');
        expect(lastValue).toBeCloseTo(15.3846, 4);
    });
});
