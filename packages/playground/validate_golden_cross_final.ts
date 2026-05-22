import pkg from '../core/dist/index.js';
const { Dataset, Backtest } = pkg;
import { GoldenCrossStrategy } from '../strategies/dist/index.js';
import fs from 'fs';

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
    const strategy = new GoldenCrossStrategy('Golden Cross', {
        fastPeriod: 50,
        slowPeriod: 200,
        direction: 'long'
    });

    const backtest = new Backtest(dataset, strategy);
    const report = backtest.run({
        config: { capital: 100000 },
        onEntry: (quote, index, quotes) => quotes[index + 1] ? (quotes[index + 1].value as any).open : (quote.value as any).close,
        onExit: (quote, index, quotes) => quotes[index + 1] ? (quotes[index + 1].value as any).open : (quote.value as any).close
    });

    console.log("--- Verified Golden Cross Strategy ---");
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
