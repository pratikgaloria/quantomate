import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function testFetch() {
    console.log("Fetching NVDA data (2024-2026) UI style...");
    try {
        const result = await yahooFinance.chart('NVDA', {
            period1: '2024-01-01',
            period2: '2026-02-18',
            interval: '1d',
            return: 'array'
        });
        console.log("Success! Quotes count:", result.quotes.length);
        console.log("Last Quote:", result.quotes[result.quotes.length - 1]);
    } catch (e: any) {
        console.error("Fetch failed:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Body:", e.response.body);
        }
    }
}

testFetch();
