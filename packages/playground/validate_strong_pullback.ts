import YahooFinance from 'yahoo-finance2';
import { Dataset, Backtest, TradePosition } from '../core/dist/index.js';
import { StrongPullback } from '../strategies/dist/index.js';
import fs from 'fs';

const yahooFinance = new YahooFinance();

async function run() {
    const symbol = 'NVDA';
    const startDate = '2025-01-01';
    const endDate = '2026-02-18';
    
    console.log(`Fetching Daily and 1h data for ${symbol}...`);
    
    try {
        // 1. Fetch Daily for Trend Bias
        const dailyResult = await yahooFinance.chart(symbol, {
            period1: '2024-01-01', // Extra warmup
            period2: endDate,
            interval: '1d',
            return: 'array'
        });

        const dailyData = dailyResult.quotes.map(q => ({
            date: q.date,
            timestamp: q.date.getTime(),
            open: q.open,
            high: q.high,
            low: q.low,
            close: q.close,
            volume: q.volume
        }));

        // 2. Fetch 1h for Signals
        const hourlyResult = await yahooFinance.chart(symbol, {
            period1: '2025-01-01',
            period2: endDate,
            interval: '1h',
            return: 'array'
        });

        const hourlyData = hourlyResult.quotes.map(q => ({
            date: q.date,
            timestamp: q.date.getTime(),
            open: q.open,
            high: q.high,
            low: q.low,
            close: q.close,
            volume: q.volume
        }));

        console.log(`Daily candles: ${dailyData.length}, Hourly candles: ${hourlyData.length}`);

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

        const backtest = new Backtest(dataset, strategy, [dailyDataset]);
        
        const report = backtest.run({
            config: {
                capital: 100000,
                slippage: 0.0005 // 0.05%
            },
            onEntry: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close,
            onExit: (q, i, quotes) => quotes[i+1]?.value.open ?? q.value.close
        });

        console.log('\n--- Strong Pullback Backtest Report ---');
        console.log(`Total Trades: ${report.trades.length}`);
        console.log(`Final Capital: ${report.finalCapital.toFixed(2)}`);
        console.log(`Win Rate: ${(report.winningRate * 100).toFixed(2)}%`);
        
        report.trades.slice(0, 10).forEach((t, i) => {
           console.log(`${i+1} | ${t.type.toUpperCase()} | ${t.quote.value.date.toISOString().split('T')[0]} ${t.quote.value.date.getUTCHours()}:00 | Price: ${t.tradedValue.toFixed(2)} | Reason: ${t.exitReason || '-'}`);
        });

    } catch (e: any) {
        console.error("Backtest failed:", e.message);
    }
}

run();
