import { Dataset, Strategy, Quote, Indicator, TradePosition, Backtest } from '@quantomate/core';
import type { StrategyContext } from '@quantomate/core';
import { SMA } from '@quantomate/library';
import fs from 'fs';

// 1. Define the Golden Cross Strategy exactly as per Pine Script
export class GoldenCrossTV extends Strategy<any, any> {
    constructor() {
        const fastSMA = new SMA<any>('fastSMA', { period: 50, attribute: 'close' });
        const slowSMA = new SMA<any>('slowSMA', { period: 200, attribute: 'close' });

        // Indicators for previous values to detect crossover
        const prevFastIndicator = new Indicator<any, any>(
            'prevFast',
            (dataset: Dataset<any>) => {
                const idx = dataset.length - 1;
                if (idx < 1) return NaN;
                return dataset.at(idx - 1)?.getIndicator('fastSMA') ?? NaN;
            }
        );

        const prevSlowIndicator = new Indicator<any, any>(
            'prevSlow',
            (dataset: Dataset<any>) => {
                const idx = dataset.length - 1;
                if (idx < 1) return NaN;
                return dataset.at(idx - 1)?.getIndicator('slowSMA') ?? NaN;
            }
        );

        super('GoldenCrossTV', {
            indicators: [fastSMA, slowSMA, prevFastIndicator, prevSlowIndicator],
            direction: 'long',
            entryWhen: (quote: Quote<any>) => {
                const fast = quote.getIndicator('fastSMA');
                const slow = quote.getIndicator('slowSMA');
                const prevFast = quote.getIndicator('prevFast');
                const prevSlow = quote.getIndicator('prevSlow');

                if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
                    return false;
                }

                // Pine crossover: prevFast <= prevSlow && fast > slow
                return prevFast <= prevSlow && fast > slow;
            },
            exitWhen: (quote: Quote<any>) => {
                const fast = quote.getIndicator('fastSMA');
                const slow = quote.getIndicator('slowSMA');
                const prevFast = quote.getIndicator('prevFast');
                const prevSlow = quote.getIndicator('prevSlow');

                if (fast === undefined || slow === undefined || prevFast === undefined || prevSlow === undefined || isNaN(prevFast) || isNaN(prevSlow)) {
                    return false;
                }

                // Pine crossunder: prevFast >= prevSlow && fast < slow
                return prevFast >= prevSlow && fast < slow;
            },
        });
    }
}

async function run() {
    const ticker = 'NVDA';
    const start = '1999-01-22';
    const end = '2026-02-18';

    console.log(`Reading data for ${ticker} from nvda_stooq.csv...`);

    const fileContent = fs.readFileSync('nvda_stooq.csv', 'utf8');
    const lines = fileContent.split('\n');
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [dateStr, open, high, low, close, volume] = line.split(',');

        if (dateStr < start || dateStr > end) continue;

        data.push({
            timestamp: new Date(dateStr).getTime(),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume)
        });
    }

    const dataset = new Dataset<any>(data, { timestampField: 'timestamp' });
    const strategy = new GoldenCrossTV();

    const backtest = new Backtest<any, any, any>(dataset, strategy);

    // Note: TV by default fills on NEXT bar open. 
    // Our engine by default fills on CURRENT bar close.
    // To simulate TV better, we might need a custom entryPriceField that looks at the NEXT bar, 
    // but that's hard in the current engine loop.
    // Let's start with 'close' (current bar) and see how far off we are.
    const report = backtest.run({
        config: {
            capital: 10000,
            entryPriceField: 'close'
        },
        onEntry: (q) => q.value.close,
        onExit: (q) => q.value.close
    });

    console.log('\n--- First Trade Detail ---');
    const firstEntry = report.trades[0];
    if (firstEntry) {
        const idx = data.findIndex(d => d.timestamp === firstEntry.quote.timestamp);
        for (let i = idx - 2; i <= idx + 2; i++) {
            const d = dataset.at(i);
            if (!d) continue;
            const fast = d.getIndicator('fastSMA');
            const slow = d.getIndicator('slowSMA');
            const date = new Date(d.timestamp!).toISOString().split('T')[0];
            console.log(`${date} | Price: ${d.value.close.toFixed(4)} | Open: ${d.value.open.toFixed(4)} | SMA50: ${fast?.toFixed(4)} | SMA200: ${slow?.toFixed(4)}${i === idx ? ' <- SIGNAL' : ''}`);
        }
    }

    console.log('\n--- Backtest Report ---');
    console.log(`Symbol: ${ticker}`);
    console.log(`Period: ${start} to ${end}`);
    console.log(`Total Trades: ${report.trades.length}`);

    const summary = report.summary();
    console.log(`Net Profit: ${(summary.finalCapital - summary.initialCapital).toFixed(2)}`);
    console.log(`Win Rate: ${(summary.winningRate * 100).toFixed(2)}%`);

    console.log('\n--- Trade List ---');
    report.trades.forEach((trade, i) => {
        const timestamp = trade.quote.timestamp;
        const date = timestamp ? new Date(timestamp).toISOString().split('T')[0] : 'N/A';
        console.log(`${(i + 1).toString().padStart(3)} | ${trade.type.toUpperCase().padEnd(5)} | ${date} | Price: ${trade.tradedValue.toFixed(4)} | Shares: ${(trade.shares || 0).toFixed(2)}`);
    });
}

run().catch(console.error);
