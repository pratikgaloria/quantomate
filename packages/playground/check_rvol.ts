import pkg from '../core/dist/index.js';
const { Dataset } = pkg;
import { StrongPullback } from '../strategies/dist/index.js';
import fs from 'fs';

async function run() {
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

    const hourlyDataset = new Dataset(hourlyData, { id: '1h' });
    const strategy = new StrongPullback({ rvolThreshold: 1.2 });
    hourlyDataset.prepare(strategy, []);

    console.log('--- RVOL Oct 17 ---');
    for(let i=0; i<hourlyDataset.length; i++) {
        const q = hourlyDataset.at(i);
        const d = new Date(q.timestamp);
        if (d.toISOString().startsWith('2025-10-17')) {
             console.log(`${d.toISOString()} | P: ${q.value.close} | EMA20: ${q.getIndicator('EMA20')?.toFixed(2)} | RVOL: ${q.getIndicator('RVOL')?.toFixed(2)}`);
        }
    }
}
run();
