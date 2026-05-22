import pkg from '../core/dist/index.js';
const { Dataset } = pkg;
import { StrongPullback } from '../strategies/dist/index.js';
import fs from 'fs';

async function run() {
    const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n').filter(l => l.includes(',')).slice(1);
    const dailyData = dailyCsv.map(line => {
        const parts = line.split(',');
        return {
            timestamp: new Date(parts[0]).getTime(),
            close: parseFloat(parts[4]),
        };
    }).filter(d => !isNaN(d.timestamp));

    const hourlyCsv = fs.readFileSync('nvda_1h.csv', 'utf8').split('\n').filter(l => l.includes(',')).slice(1);
    const hourlyData = hourlyCsv.map(line => {
        const parts = line.split(',');
        return {
            timestamp: new Date(parts[0]).getTime(),
            close: parseFloat(parts[4]),
            volume: parseFloat(parts[5]),
            high: parseFloat(parts[2]),
            low: parseFloat(parts[3]),
        };
    }).filter(d => !isNaN(d.timestamp));

    const dailyDataset = new Dataset(dailyData, { id: 'daily' });
    StrongPullback.prepareDaily(dailyDataset, 50);

    const hourlyDataset = new Dataset(hourlyData, { id: '1h' });
    const strategy = new StrongPullback({ rvolThreshold: 1.2 });
    hourlyDataset.prepare(strategy, [dailyDataset]);

    let dEmaPositive = 0;
    let rvolHigh = 0;
    let intradayUptrend = 0;

    for (let i = 0; i < hourlyDataset.length; i++) {
        const q = hourlyDataset.at(i);
        const dq = dailyDataset.syncBefore(q.timestamp);
        
        if (dq && q.value.close > dq.getIndicator('EMA50')) dEmaPositive++;
        if (q.getIndicator('RVOL') > 1.2) rvolHigh++;
        if (q.value.close > q.getIndicator('VWAP') && q.getIndicator('EMA20') > q.getIndicator('VWAP')) intradayUptrend++;
    }

    console.log('Stats:');
    console.log('Total Hourly Bars:', hourlyDataset.length);
    console.log('Bars with Price > Daily EMA50:', dEmaPositive);
    console.log('Bars with RVOL > 1.2:', rvolHigh);
    console.log('Bars in Intraday Uptrend (Price > VWAP & EMA20 > VWAP):', intradayUptrend);
}

run();
