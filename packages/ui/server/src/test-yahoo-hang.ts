import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();
async function run() {
  const start = Date.now();
  console.log("Starting Yahoo Finance query for BTC-EUR...");
  try {
    const summary = await yahooFinance.quoteSummary('BTC-EUR', {
      modules: ["defaultKeyStatistics", "summaryDetail", "financialData", "summaryProfile", "price"]
    });
    console.log("Succeeded in", (Date.now() - start), "ms");
  } catch (e) {
    console.log("Failed in", (Date.now() - start), "ms, error:", (e as Error).message);
  }
}

run();
