import { IDataProvider, HistoricalPriceData, QuoteData, FundamentalData } from './IDataProvider';
// @ts-ignore
import { KiteConnect } from 'kiteconnect';
import { KiteInstrumentMapper } from './KiteProvider';

export class KiteDataProvider implements IDataProvider {
  private kc: any;
  constructor(apiKey: string, accessToken: string) {
    this.kc = new KiteConnect({ api_key: apiKey, access_token: accessToken });
  }

  private mapInterval(interval?: string): string {
    const map: Record<string, string> = { '1m': 'minute', '3m': '3minute', '5m': '5minute', '15m': '15minute', '30m': '30minute', '60m': '60minute', '1h': '60minute', '3h': '3hour', '1d': 'day' };
    return interval ? map[interval] || 'day' : 'day';
  }

  async getHistoricalData(symbol: string, start: Date, end: Date, interval?: string): Promise<HistoricalPriceData[]> {
    const token = KiteInstrumentMapper.getInstrumentToken(symbol);
    if (!token) {
      console.warn(`[KiteDataProvider] Token not found for symbol ${symbol}. Historical fetch skipped.`);
      return [];
    }
    try {
      const candles = await this.kc.getHistoricalData(token, this.mapInterval(interval), start, end);
      return (candles || []).map((c: any) => ({
        date: new Date(c.date), open: Number(c.open), high: Number(c.high), low: Number(c.low), close: Number(c.close), volume: Number(c.volume),
      }));
    } catch (err: any) {
      console.error(`[KiteDataProvider] Historical fetch failed for ${symbol}:`, err.message);
      return [];
    }
  }

  async getFundamentals(symbol: string): Promise<FundamentalData> { return { symbol, name: symbol }; }

  async getQuotes(symbols: string[]): Promise<Map<string, QuoteData>> {
    const map = new Map<string, QuoteData>();
    if (symbols.length === 0) return map;

    const kiteSymbols = symbols.map(s => {
      const upper = s.toUpperCase().trim();
      if (upper.includes(':')) return upper;
      const exchange = (upper.endsWith('CE') || upper.endsWith('PE') || upper.endsWith('FUT')) ? 'NFO' : 'NSE';
      return `${exchange}:${upper}`;
    });

    try {
      const quotesRes = await this.kc.getQuote(kiteSymbols);
      for (const s of symbols) {
        const upper = s.toUpperCase().trim();
        const exchange = (upper.endsWith('CE') || upper.endsWith('PE') || upper.endsWith('FUT')) ? 'NFO' : 'NSE';
        const q = quotesRes[`${exchange}:${upper}`];
        if (q) {
          map.set(upper, {
            symbol: upper, regularMarketPrice: Number(q.last_price),
            bid: q.depth?.buy?.[0]?.price ? Number(q.depth.buy[0].price) : undefined,
            ask: q.depth?.sell?.[0]?.price ? Number(q.depth.sell[0].price) : undefined,
            regularMarketVolume: Number(q.volume),
          });
        }
      }
    } catch (err: any) {
      console.error(`[KiteDataProvider] getQuotes failed:`, err.message);
    }
    return map;
  }

  async getSummaries(symbols: string[]) { return new Map(); }
  async getPeers(symbol: string) { return []; }
  async getEarnings(symbol: string) { return null; }
  async getScreener(scrId: string) { return null; }

  async search(query: string): Promise<any> {
    const q = query.toUpperCase().trim();
    return KiteInstrumentMapper.getCachedList()
      .filter(item => item.tradingsymbol?.toUpperCase().includes(q) || item.name?.toUpperCase().includes(q))
      .slice(0, 50).map(item => ({
        symbol: `${item.exchange}:${item.tradingsymbol}`,
        shortname: item.name || item.tradingsymbol,
        longname: item.name || item.tradingsymbol,
        exchange: item.exchange,
      }));
  }
}
