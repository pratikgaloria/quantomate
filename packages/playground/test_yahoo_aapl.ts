import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function testFetch() {
    console.log("Fetching AAPL data UI style...");
    try {
        const result = await yahooFinance.chart('AAPL', {
            period1: '2024-01-01',
            period2: '2026-02-18',
            interval: '1d',
            return: 'array'
        });
        console.log("Success! Quotes count:", result.quotes.length);
    } catch (e: any) {
        console.error("Fetch failed:", e.message);
    }
}

testFetch();
