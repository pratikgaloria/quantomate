import pkg from '../core/dist/index.js';
const { Dataset } = pkg;
import { StrongPullback } from '../strategies/dist/index.js';
import fs from 'fs';

const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n').filter(l => l.includes(',')).slice(1);
const dailyData = dailyCsv.map(partsStr => {
    const parts = partsStr.split(',');
    return {
        timestamp: new Date(parts[0]).getTime(),
        close: parseFloat(parts[4]),
    };
}).filter(d => !isNaN(d.timestamp));

const ds = new Dataset(dailyData);
StrongPullback.prepareDaily(ds, 50);

const lastIdx = ds.length - 1;
const lastQuote = ds.at(lastIdx);
console.log(`Last Daily Quote: ${new Date(lastQuote.timestamp).toISOString()}`);
console.log(`Close: ${lastQuote.value.close}, EMA50: ${lastQuote.getIndicator('EMA50')}`);
