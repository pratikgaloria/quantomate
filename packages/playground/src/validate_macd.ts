import { Dataset, Strategy, Quote, Indicator, TradePosition, Backtest } from '@quantomate/core';
import type { StrategyContext } from '@quantomate/core';
import { MACDStrategy } from '@quantomate/strategies';
import fs from 'fs';

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
    const strategy = new MACDStrategy('MACDStrategy', { signalPeriod: 9, source: 'close' });

    const backtest = new Backtest<any, any, any>(dataset, strategy);

    const report = backtest.run({
        config: {
            capital: 1000000,
            entryPriceField: 'open' // Note: This isn't strictly used if we provide onEntry
        },
        onEntry: (q, i, quotes) => {
            const nextBar = quotes[i + 1];
            return nextBar ? nextBar.value.open : q.value.close;
        },
        onExit: (q, i, quotes) => {
            const nextBar = quotes[i + 1];
            return nextBar ? nextBar.value.open : q.value.close;
        }
    });

    console.log('\n--- MACD (Long/Short, Next Open) Backtest Report ---');
    console.log(`Symbol: ${ticker}`);
    console.log(`Total Trades: ${report.trades.length}`);

    const summary = report.summary();
    console.log(`Net Profit: ${(summary.finalCapital - summary.initialCapital).toFixed(2)}`);
    console.log(`Win Rate: ${(summary.winningRate * 100).toFixed(2)}%`);

    console.log('\n--- Trade List ---');
    report.trades.forEach((trade, i) => {
        const timestamp = trade.quote.timestamp;
        const date = timestamp ? new Date(timestamp).toISOString().split('T')[0] : 'N/A';
        console.log(`${(i + 1).toString().padStart(3)} | ${trade.type.toUpperCase().padEnd(5)} | ${date} | Price: ${trade.tradedValue.toFixed(4)}`);
    });
}

run().catch(console.error);
