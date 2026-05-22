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
            close: parseFloat(parts[4]),
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
    const strategy = new StrongPullback({
        rvolThreshold: 1.0,  // Relaxed to catch data variances
        vwapDistanceAtrRatio: 1.0 // Relaxed for validation
    });

    const backtest = new Backtest(hourlyDataset, strategy, [dailyDataset]);
    const report = backtest.run({
        config: { capital: 100000, commission: 0.00005 }, // 0.005 %
        onEntry: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close,
        onExit: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close
    });

    console.log('\n--- Trade Log (v8 Final) ---');
    report.trades.forEach((t, i) => {
        const d = new Date(t.quote.timestamp);
        console.log(`${(i+1).toString().padStart(2)} | ${t.type.toUpperCase().padEnd(5)} | ${d.toISOString()} | Price: ${t.tradedValue.toFixed(2)} | Profit: ${t.currentCapital.toFixed(0)}`);
    });
}
run();
