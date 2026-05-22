const { Dataset, Quote, Backtest } = require('../core/dist/index');
const { StrongPullback } = require('../strategies/dist/index');

async function validate() {
    console.log('🚀 Validating Strong Pullback Strategy...');

    // 1. Create Daily Dataset (Higher Timeframe)
    const dailyQuotes = [];
    for (let i = 0; i < 60; i++) {
        const price = 100 + i * 2;
        const ts = new Date(2024, 0, i + 1).getTime();
        dailyQuotes.push(new Quote({ close: price, volume: 10000 }, ts));
    }
    const dailyDataset = new Dataset(dailyQuotes, { id: 'daily' });
    StrongPullback.prepareDaily(dailyDataset, 20);

    // 2. Create 5m Dataset (Primary)
    const primaryQuotes = [];
    for (let d = 0; d < 60; d++) {
        const dayPrice = 100 + d * 2;
        for (let h = 0; h < 20; h++) {
            const ts = new Date(2024, 0, d + 1, h).getTime();
            let price = dayPrice + h * 0.1;
            let volume = 1000;

            if (d === 40) {
                if (h === 5) {
                    price = dayPrice - 0.2; // Shallower dip
                    volume = 500;
                }
                if (h === 6) {
                    price = dayPrice + 3.0; // Breakout
                    volume = 5000;
                }
                if (h > 6) {
                    price = dayPrice + 5 + (h - 6) * 5; // Sustain trend
                }
            }

            primaryQuotes.push(new Quote({ close: price, volume }, ts));
        }
    }
    const primaryDataset = new Dataset(primaryQuotes, { id: '5m' });

    // 3. Strategy Configuration
    const strategy = new StrongPullback({
        dailyEmaPeriod: 20,
        rvolThreshold: 1.5,
        vwapDistanceAtrRatio: 10.0,
        high: 'close',
        low: 'close',
        emaPeriod: 5 // Shorter EMA for faster catch-up
    });

    // 4. Run Backtest
    const backtest = new Backtest(primaryDataset, strategy, [dailyDataset]);

    console.log('\n🔍 Checking Day 41 (d=40) indicators:');
    for (let h = 0; h < 20; h++) {
        const quote = primaryDataset.at(40 * 20 + h);
        if (quote) {
            console.log(`h=${h} | Price: ${quote.value.close} | EMA20: ${quote.getIndicator('EMA20')?.toFixed(2)} | VWAP: ${quote.getIndicator('VWAP')?.toFixed(2)} | RVOL: ${quote.getIndicator('RVOL')?.toFixed(2)}`);
        }
    }

    const report = backtest.run({
        config: {
            capital: 10000,
            commission: 0.005,
            slippage: 0.0002
        },
        onEntry: (q) => q.value.close,
        onExit: (q) => q.value.close
    });

    console.log('\n📊 BACKTEST SUMMARY:');
    console.log(JSON.stringify(report.summary(), null, 2));

    console.log('\n📜 TRADE LOG:');
    report.trades.forEach(t => {
        const time = new Date(t.quote.timestamp).toLocaleString();
        const type = t.type.toUpperCase();
        const reason = t.exitReason ? `[${t.exitReason}]` : '';
        console.log(`${time} | ${type} ${reason} | Price: ${t.tradedValue.toFixed(2)} | Shares: ${t.shares.toFixed(2)} | Comm: $${t.commission?.toFixed(2)}`);
    });

    const exitTrades = report.trades.filter(t => t.type === 'exit');
    const entryTrade = report.trades.find(t => t.type === 'entry');

    if (entryTrade && exitTrades.length > 0) {
        const hasPartialExit = exitTrades.some(t => t.shares < entryTrade.shares - 0.00001);
        if (hasPartialExit) {
            console.log('\n✅ Partial Exit Detected (Multi-target TP working!)');
        } else {
            console.log('\n❌ No Partial Exit Detected. Only full exit found.');
        }
    } else {
        console.log('\n❌ No trades executed. Check conditions.');
    }
}

validate().catch(console.error);
