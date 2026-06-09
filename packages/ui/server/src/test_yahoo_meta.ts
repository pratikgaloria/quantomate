import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function main() {
  const symbols = ['NVDA', '^NSEBANK'];
  
  for (const symbol of symbols) {
    console.log(`\n--- Fetching chart meta for ${symbol} ---`);
    try {
      const result = await yahooFinance.chart(symbol, {
        period1: '2026-06-08',
        period2: '2026-06-09',
        interval: '1d'
      });
      // The chart response has a meta field on the raw result if we inspect it
      // Let's print the keys and structure of the result
      console.log('Result root keys:', Object.keys(result));
      if ((result as any).meta) {
        console.log('Meta:', (result as any).meta);
      } else {
        console.log('No meta field directly on result. Quotes sample:', result.quotes?.[0]);
      }
      
      // Let's also try quoting the symbol to check its metadata
      console.log(`\n--- Fetching quote detail for ${symbol} ---`);
      const quote = await yahooFinance.quote(symbol);
      console.log('Exchange:', (quote as any).exchange);
      console.log('Exchange timezone name:', (quote as any).exchangeTimezoneName);
      console.log('Exchange timezone short name:', (quote as any).exchangeTimezoneShortName);
    } catch (err: any) {
      console.error(`Error for ${symbol}:`, err.message);
    }
  }
}

main().catch(console.error);
