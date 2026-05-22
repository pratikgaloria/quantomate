import pkg from '../core/dist/index.js';
const { Dataset } = pkg;
import { SMA } from '../indicators/dist/index.js';
import fs from 'fs';

async function run() {
    const hourlyCsv = fs.readFileSync('nvda_1h.csv', 'utf8').split('\n').filter(l => l.includes(',')).slice(1);
    const hourlyData = hourlyCsv.map(line => {
        const parts = line.split(',');
        return {
            timestamp: new Date(parts[0].trim()).getTime(),
            volume: parseFloat(parts[5])
        };
    }).filter(d => !isNaN(d.timestamp));

    const ds = new Dataset(hourlyData);
    ds.apply(new SMA('volSMA', { period: 100, attribute: 'volume' })); // Approx 15 days

    console.log('--- Simple RVOL(100) Oct 17 ---');
    for(let i=0; i<ds.length; i++) {
        const q = ds.at(i);
        const d = new Date(q.timestamp);
        if (d.toISOString().startsWith('2025-10-17')) {
             const rvol = q.value.volume / q.getIndicator('volSMA');
             console.log(`${d.toISOString()} | RVOL: ${rvol.toFixed(2)}`);
        }
    }
}
run();
