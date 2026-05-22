import pkg from '../core/dist/index.js';
const { Dataset, Backtest } = pkg;
import { StrongPullback } from '../strategies/dist/index.js';
import fs from 'fs';

async function run() {
    const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n').filter(l => l.includes(',')).slice(1);
    const dailyData = dailyCsv.map(line => {
        const parts = line.split(',');
        return {
            timestamp: new Date(parts[0].trim()).getTime(),
            open: parseFloat(parts[1]),
            high: parseFloat(parts[2]),
            low: parseFloat(parts[3]),
            close: parseFloat(parts[4]),
            volume: parseFloat(parts[5])
        };
    }).filter(d => !isNaN(d.timestamp));

    const hourlyCsv = fs.readFileSync('nvda_1h.csv', 'utf8').split('\n').filter(l => l.includes(',')).slice(1);
    const hourlyData = hourlyCsv.map(line => {
        const parts = line.split(',');
        return {
            timestamp: new Date(parts[0].trim()).getTime(),
            open: parseFloat(parts[1]),
            high: parseFloat(parts[2]),
            low: parseFloat(parts[3]),
            close: parseFloat(parts[4]),
            volume: parseFloat(parts[5])
        };
    }).filter(d => !isNaN(d.timestamp));

    const dailyDataset = new Dataset(dailyData, { id: 'daily' });
    StrongPullback.prepareDaily(dailyDataset, 50);

    const hourlyDataset = new Dataset(hourlyData, { id: '1h' });
    const strategy = new StrongPullback({ atrMultiplier: 1.0, rvolThreshold: 1.1 });
    hourlyDataset.prepare(strategy, [dailyDataset]);

    const backtest = new Backtest(hourlyDataset, strategy, [dailyDataset]);
    const report = backtest.run({
        config: { capital: 100000, slippage: 0 },
        onEntry: (q, i, quotes) => {
            const price = quotes[i+1]?.value.open ?? q.value.close;
            console.log(`ENTRY Triggered at ${new Date(q.timestamp).toISOString()}. Price: ${price}`);
            return price;
        },
        onExit: (q, i, quotes) => {
            const price = quotes[i+1]?.value.open ?? q.value.close;
            console.log(`EXIT Triggered at ${new Date(q.timestamp).toISOString()}. Reason: ${q.getStrategy(strategy.name).position.options.exitReason}. Price: ${price}`);
            return price;
        }
    });
}
run();
