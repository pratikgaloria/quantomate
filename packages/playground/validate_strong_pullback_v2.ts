import pkg from '../core/dist/index.js';
const { Dataset, Backtest, TradePosition } = pkg;
import { StrongPullback } from '../strategies/dist/index.js';
import fs from 'fs';

async function run() {
    const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n').filter(l => l.trim().split(',').length >= 5);
    const dailyData = dailyCsv.slice(1).map(line => {
        const [DateStr, Open, High, Low, Close, Volume] = line.split(',');
        return {
            timestamp: new Date(DateStr).getTime(),
            open: parseFloat(Open),
            high: parseFloat(High),
            low: parseFloat(Low),
            close: parseFloat(Close),
            volume: parseFloat(Volume)
        };
    });

    const hourlyCsv = fs.readFileSync('nvda_1h.csv', 'utf8').split('\n').filter(l => l.trim().split(',').length >= 5);
    const hourlyData = hourlyCsv.slice(1).map(line => {
        const [DateStr, Open, High, Low, Close, Volume] = line.split(',');
        return {
            timestamp: new Date(DateStr).getTime(),
            open: parseFloat(Open),
            high: parseFloat(High),
            low: parseFloat(Low),
            close: parseFloat(Close),
            volume: parseFloat(Volume)
        };
    });

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
    
    console.log('\n--- Condition Debug ---');
    for(let i=0; i<100; i++) {
        const q = dataset.at(i);
        if(!q) break;
        const ts = q.timestamp;
        const dq = dailyDataset.syncBefore(ts);
        
        if (i % 20 === 0) {
           console.log(`[${i}] ${new Date(ts).toISOString()} | P: ${q.value.close.toFixed(2)} | dEMA50: ${dq?.getIndicator('EMA50')?.toFixed(2) || 'N/A'} | VWAP: ${q.getIndicator('VWAP')?.toFixed(2) || 'N/A'} | RVOL: ${q.getIndicator('RVOL')?.toFixed(2) || 'N/A'}`);
        }
    }

    const report = backtestStrategy(dataset, strategy, dailyDataset);
    console.log('\n--- Backtest Summary ---');
    console.log(`Trade Count: ${report.trades.length}`);
}

function backtestStrategy(dataset, strategy, dailyDataset) {
    const backtest = new Backtest(dataset, strategy, [dailyDataset]);
    return backtest.run({
        config: { capital: 100000, slippage: 0 },
        onEntry: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close,
        onExit: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close
    });
}

run().catch(console.error);
