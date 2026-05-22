import pkg from '../core/dist/index.js';
const { Dataset } = pkg;
import { SMA } from '../indicators/dist/index.js';
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
    const sma50 = new SMA('sma50', { period: 50 });
    const sma200 = new SMA('sma200', { period: 200 });
    dataset.apply(sma50);
    dataset.apply(sma200);

    console.log("Last 20 bars:");
    for (let i = dataset.length - 20; i < dataset.length; i++) {
        const q = dataset.at(i);
        console.log(`${(q.value as any).date.toISOString().split('T')[0]} | P: ${(q.value as any).close.toFixed(2)} | SMA50: ${q.getIndicator('sma50')?.toFixed(2)} | SMA200: ${q.getIndicator('sma200')?.toFixed(2)}`);
    }
}
run();
