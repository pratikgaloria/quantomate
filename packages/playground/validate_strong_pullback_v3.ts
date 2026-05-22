import pkg from '../core/dist/index.js';
const { Dataset, Backtest } = pkg;
import { StrongPullback } from '../strategies/dist/index.js';
import fs from 'fs';

async function run() {
    const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n').filter(l => l.includes(',')).slice(1);
    const dailyData = dailyCsv.map(line => {
        const parts = line.split(',');
        return {
            timestamp: new Date(parts[0]).getTime(),
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
            timestamp: new Date(parts[0]).getTime(),
            open: parseFloat(parts[1]),
            high: parseFloat(parts[2]),
            low: parseFloat(parts[3]),
            close: parseFloat(parts[4]),
            volume: parseFloat(parts[5])
        };
    }).filter(d => !isNaN(d.timestamp));

    const dailyDataset = new Dataset(dailyData, { id: 'daily' });
    StrongPullback.prepareDaily(dailyDataset, 50);

    const dataset = new Dataset(hourlyData, { id: '1h' });
    const strategy = new StrongPullback({
        emaPeriod: 20,
        dailyEmaPeriod: 50,
        rvolPeriod: 20,
        atrPeriod: 14,
        rvolThreshold: 1.2
    });

    dataset.prepare(strategy, [dailyDataset]);
    
    console.log('Daily count:', dailyData.length);
    console.log('Hourly count:', hourlyData.length);

    console.log('\n--- Debugging Signals ---');
    for(let i=0; i<dataset.length; i++) {
        const q = dataset.at(i);
        const dq = dailyDataset.syncBefore(q.timestamp);
        
        const price = q.value.close;
        const dEma50 = dq?.getIndicator('EMA50');
        const vwap = q.getIndicator('VWAP');
        const rvol = q.getIndicator('RVOL');
        const ema20 = q.getIndicator('EMA20');

        // Logic check
        const htfBias = dq && price > dEma50 && dq.getIndicator('EMA50_Slope') > 0;
        const intradayTrend = price > vwap && ema20 > vwap;
        const entryCond = rvol > 1.2 && Math.abs(price - vwap) < 0.5 * q.getIndicator('ATR');

        if (htfBias && intradayTrend && entryCond) {
             console.log(`MATCH at ${new Date(q.timestamp).toISOString()}: P=${price.toFixed(2)} dEMA=${dEma50.toFixed(2)} VWAP=${vwap.toFixed(2)} RVOL=${rvol.toFixed(2)}`);
        }
    }

    const backtest = new Backtest(dataset, strategy, [dailyDataset]);
    const report = backtest.run({
        config: { capital: 100000, slippage: 0 },
        onEntry: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close,
        onExit: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close
    });

    console.log('\n--- Final Results ---');
    console.log('Trade Count:', report.trades.length);
}

run().catch(console.error);
