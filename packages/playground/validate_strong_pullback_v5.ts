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
    const strategy = new StrongPullback({
        emaPeriod: 20,
        dailyEmaPeriod: 50,
        rvolPeriod: 20,
        atrPeriod: 14,
        rvolThreshold: 1.2,
        vwapDistanceAtrRatio: 0.5,
        atrMultiplier: 1.0,
        tp1_R: 1.0,
        tp2_R: 2.0,
        tp1_pct: 50
    });

    hourlyDataset.prepare(strategy, [dailyDataset]);
    
    // Check Oct 17 2025 specifically
    console.log('\n--- Oct 17 2025 Detail ---');
    for(let i=0; i<hourlyDataset.length; i++) {
        const q = hourlyDataset.at(i);
        const d = new Date(q.timestamp);
        if (d.toISOString().startsWith('2025-10-17')) {
             const dq = dailyDataset.syncBefore(q.timestamp);
             console.log(`${d.toISOString()} | P: ${q.value.close.toFixed(2)} | ATR: ${q.getIndicator('ATR')?.toFixed(2)} | VWAP: ${q.getIndicator('VWAP')?.toFixed(2)} | dEMA: ${dq?.getIndicator('EMA50')?.toFixed(2)}`);
        }
    }

    const backtest = new Backtest(hourlyDataset, strategy, [dailyDataset]);
    const report = backtest.run({
        config: { 
            capital: 100000, 
            commission: 0 // We'll manually check P&L matches prices for now
        },
        onEntry: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close,
        onExit: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close
    });

    console.log('\n--- Trade Log (Strict Parameters) ---');
    report.trades.forEach(t => {
        const d = new Date(t.quote.timestamp);
        console.log(`${t.type.toUpperCase().padEnd(5)} | ${d.toISOString()} | Price: ${t.tradedValue.toFixed(2)} | Reason: ${t.exitReason || '-'}`);
    });
}
run().catch(console.error);
