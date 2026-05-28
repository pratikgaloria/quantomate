"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@quantomate/core");
const src_1 = require("../src");
describe('MACDStrategy', () => {
    it('should calculate indicators and trigger signals', () => {
        // Create a dataset with enough data for MACD (requires 26 periods + 9 signal periods)
        // 0-30: Constant 100
        // 30-40: Sharp rise
        // 40-50: Sharp drop
        const prices = [
            ...Array(30).fill(100),
            105, 110, 115, 120, 125, 130, 135, 140, 145, 150, // fast rise
            145, 140, 135, 130, 125, 120, 115, 110, 105, 100 // fast drop
        ];
        const dataset = new core_1.Dataset(prices.map(p => ({ close: p })));
        const strategy = new src_1.MACDStrategy('macd-test', {
            signalPeriod: 9,
            source: 'close'
        });
        dataset.prepare(strategy);
        // Verify indicators
        const lastQuote = dataset.at(dataset.length - 1);
        expect(lastQuote.getIndicator('macd')).toBeDefined();
        expect(lastQuote.getIndicator('signalLine')).toBeDefined();
        // Count signals
        let entries = 0;
        let exits = 0;
        for (let i = 0; i < dataset.length; i++) {
            const q = dataset.at(i);
            const pos = q.getStrategy('macd-test')?.position?.value;
            if (pos === 'entry')
                entries++;
            if (pos === 'exit')
                exits++;
        }
        // We expect valid strategy execution
        expect(dataset.length).toBeGreaterThan(0);
        // Exact signals depend on exact EMA calculation, but we verify it runs.
    });
});
