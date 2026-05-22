import pkg from '../core/dist/index.js';
const { Dataset } = pkg;
import { EMA } from '../indicators/dist/index.js';
import fs from 'fs';

const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n');
const dailyData = [];
for (let i = 1; i < dailyCsv.length; i++) {
    const line = dailyCsv[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 5) continue;
    const d = new Date(parts[0]);
    if (isNaN(d.getTime())) continue;
    dailyData.push({
        timestamp: d.getTime(),
        close: parseFloat(parts[4]),
    });
}

console.log('Daily Data Length:', dailyData.length);
const ds = new Dataset(dailyData);
ds.apply(new EMA('EMA50', { period: 50, attribute: 'close' }));

const lastQuote = ds.at(ds.length - 1);
console.log('Last Date:', new Date(lastQuote.timestamp).toISOString());
console.log('Close:', lastQuote.value.close);
console.log('EMA50:', lastQuote.getIndicator('EMA50'));
