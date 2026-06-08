import { QuoteData } from './IDataProvider';
import { YahooFinanceProvider } from './YahooFinanceProvider';

export class RoutingDataProvider extends YahooFinanceProvider {
  async getQuotes(symbols: string[]): Promise<Map<string, QuoteData>> {
    const quotesMap = new Map<string, QuoteData>();
    if (symbols.length === 0) return quotesMap;

    const usSymbols = symbols.filter(sym => {
      const upper = sym.toUpperCase();
      const cryptoAssets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'DOGE', 'XRP'];
      const isCrypto = cryptoAssets.some(c => upper.startsWith(c) || upper.endsWith(c) || upper.includes('/USD') || upper.includes('-USD'));
      const isIndia = upper.startsWith('NIFTY') || upper.startsWith('BANKNIFTY') || upper === 'SBIN' || upper === 'RELIANCE';
      return !isCrypto && !isIndia;
    });

    const nonUsSymbols = symbols.filter(sym => !usSymbols.includes(sym));

    if (nonUsSymbols.length > 0) {
      try {
        const nonUsQuotes = await super.getQuotes(nonUsSymbols);
        for (const [sym, quote] of nonUsQuotes.entries()) {
          quotesMap.set(sym, quote);
        }
      } catch (err: any) {
        console.error('[RoutingDataProvider] Failed to fetch non-US quotes from Yahoo:', err.message);
      }
    }

    if (usSymbols.length > 0) {
      const token = process.env.TRADIER_API_KEY;
      if (token) {
        try {
          const sandbox = process.env.TRADIER_ENV !== 'production';
          const baseUrl = sandbox ? 'https://sandbox.tradier.com/v1' : 'https://api.tradier.com/v1';
          const url = `${baseUrl}/markets/quotes?symbols=${usSymbols.map(encodeURIComponent).join(',')}`;
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = (await response.json()) as any;
            const rawQuotes = data.quotes?.quote;
            if (rawQuotes) {
              const quotesList = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];
              for (const q of quotesList) {
                if (!q || !q.symbol) continue;
                quotesMap.set(q.symbol, {
                  symbol: q.symbol,
                  regularMarketPrice: q.last,
                  bid: q.bid,
                  ask: q.ask,
                  bidSize: q.bidsize,
                  askSize: q.asksize,
                  regularMarketVolume: q.volume,
                  regularMarketPreviousClose: q.prevclose,
                  displayName: q.description,
                  shortName: q.description,
                  longName: q.description,
                });
              }
            }
          } else {
            console.error(`[RoutingDataProvider] Failed to fetch quotes from Tradier: ${response.statusText}`);
          }
        } catch (err: any) {
          console.error(`[RoutingDataProvider] Error fetching quotes from Tradier:`, err.message);
        }
      }

      // Fallback to Yahoo Finance for any missing US symbols
      const missingUsSymbols = usSymbols.filter(sym => !quotesMap.has(sym));
      if (missingUsSymbols.length > 0) {
        try {
          const fallbackQuotes = await super.getQuotes(missingUsSymbols);
          for (const [sym, quote] of fallbackQuotes.entries()) {
            quotesMap.set(sym, quote);
          }
        } catch (err: any) {
          console.warn(`[RoutingDataProvider] Fallback quote fetch failed for ${missingUsSymbols.join(', ')}:`, err.message);
        }
      }
    }

    return quotesMap;
  }
}
