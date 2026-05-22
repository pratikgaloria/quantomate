import pkg from '../core/dist/index.js';
const { Dataset, Backtest, TradePosition } = pkg;
import { SMA } from '../indicators/dist/index.js';
import { Strategy, Quote } from '../core/dist/index.js';
import fs from 'fs';

class GoldenCrossSMA extends Strategy<any, any> {
    constructor(fast = 50, slow = 200) {
        const smaFast = new SMA('smaFast', { period: fast, attribute: 'close' });
        const smaSlow = new SMA('smaSlow', { period: slow, attribute: 'close' });
        
        super('GoldenCrossSMA', {
            indicators: [smaFast, smaSlow],
            entryWhen: (quote, context) => {
                const f = quote.getIndicator('smaFast');
                const s = quote.getIndicator('smaSlow');
                const prev = context.previousPrimaryQuote;
                if (!prev) return false;
                const pf = prev.getIndicator('smaFast');
                const ps = prev.getIndicator('smaSlow');
                if (f === undefined || s === undefined || pf === undefined || ps === undefined || isNaN(f) || isNaN(s) || isNaN(pf) || isNaN(ps)) return false;
                return pf <= ps && f > s;
            },
            exitWhen: (quote, context) => {
                const f = quote.getIndicator('smaFast');
                const s = quote.getIndicator('smaSlow');
                const prev = context.previousPrimaryQuote;
                if (!prev) return false;
                const pf = prev.getIndicator('smaFast');
                const ps = prev.getIndicator('smaSlow');
                if (f === undefined || s === undefined || pf === undefined || ps === undefined || isNaN(f) || isNaN(s) || isNaN(pf) || isNaN(ps)) return false;
                return pf >= ps && f < s;
            }
        });
    }
}

async function run() {
    const dailyPath = 'nvda_stooq.csv';
    const csvData = fs.readFileSync(dailyPath, 'utf8');
    const lines = csvData.split('\n').filter(l => l.trim());
    const data = lines.slice(1).map(line => {
        const [date, open, high, low, close, volume] = line.split(',');
        return {
            date: new Date(date),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume)
        };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());

    const dataset = new Dataset(data);
    const strategy = new GoldenCrossSMA(50, 200);

    const backtest = new Backtest(dataset, strategy);
    const report = backtest.run({
        config: { capital: 100000 },
        onEntry: (quote, index, quotes) => quotes[index + 1] ? (quotes[index + 1].value as any).open : (quote.value as any).close,
        onExit: (quote, index, quotes) => quotes[index + 1] ? (quotes[index + 1].value as any).open : (quote.value as any).close
    });

    console.log("--- SMA-SMA Golden Cross (50/200) ---");
    report.trades.forEach((t, i) => {
        const date = (t.quote.value as any).date.toISOString().split('T')[0];
        if (t.type === 'entry') {
            console.log(`ENTRY | ${date} | Fill: ${t.tradedValue.toFixed(4)}`);
        } else {
            console.log(`EXIT  | ${date} | Fill: ${t.tradedValue.toFixed(4)}`);
        }
    });
}
run();
