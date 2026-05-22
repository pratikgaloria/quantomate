import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function test() {
    try {
        console.log("Testing historical method...");
        const histResult = await yahooFinance.historical('NVDA', {
            period1: '2025-01-01',
            period2: '2026-02-18',
            interval: '1d'
        });
        console.log("Historical success! Count:", histResult.length);
        console.log("First:", histResult[0]);
    } catch (e: any) {
        console.error("Historical failed:", e.message);
    }

    try {
        console.log("\nTesting chart method...");
        const chartResult = await yahooFinance.chart('NVDA', {
            period1: '2025-01-01',
            period2: '2026-02-18',
            interval: '1d',
            return: 'array'
        });
        console.log("Chart success! Count:", chartResult.quotes.length);
        if (chartResult.quotes.length > 0) {
            console.log("First:", chartResult.quotes[0]);
        }
    } catch (e: any) {
        console.error("Chart failed:", e.message);
    }
}

test();
