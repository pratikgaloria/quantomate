import { IDataProvider, HistoricalPriceData, QuoteData, FundamentalData, StockSummaryData, EarningsData, ScreenerResult } from './IDataProvider';
// @ts-ignore
import { KiteConnect } from 'kiteconnect';
import { KiteInstrumentMapper } from './KiteProvider';

export class KiteDataProvider implements IDataProvider {
  private kc: any;

  constructor(apiKey: string, accessToken: string) {
    this.kc = new KiteConnect({
      api_key: apiKey,
      access_token: accessToken
    });
  }

  private mapInterval(interval?: string): string {
    if (!interval) return 'day';
    switch (interval) {
      case '1m': return 'minute';
      case '3m': return '3minute';
      case '5m': return '5minute';
      case '15m': return '15minute';
      case '30m': return '30minute';
      case '60m':
      case '1h': return '60minute';
      case '3h': return '3hour';
      case '1d': return 'day';
      default: return 'day';
    }
  }

  async getHistoricalData(
    symbol: string,
    start: Date,
    end: Date,
    interval?: string
  ): Promise<HistoricalPriceData[]> {
    const token = KiteInstrumentMapper.getInstrumentToken(symbol);
    if (!token) {
      console.warn(`[KiteDataProvider] Token not found for symbol ${symbol}. Historical fetch skipped.`);
      return [];
    }

    const kiteInterval = this.mapInterval(interval);
    try {
      const candles = await this.kc.getHistoricalData(token, kiteInterval, start, end);
      return (candles || []).map((c: any) => ({
        date: new Date(c.date),
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
        volume: Number(c.volume),
      }));
    } catch (err: any) {
      console.error(`[KiteDataProvider] Historical fetch failed for ${symbol}:`, err.message);
      return [];
    }
  }

  async getFundamentals(symbol: string): Promise<FundamentalData> {
    return { symbol, name: symbol };
  }

  async getQuotes(symbols: string[]): Promise<Map<string, QuoteData>> {
    const map = new Map<string, QuoteData>();
    if (symbols.length === 0) return map;

    const kiteSymbols = symbols.map(s => {
      const upper = s.toUpperCase().trim();
      if (upper.includes(':')) return upper;
      return `NSE:${upper}`;
    });

    try {
      const quotesRes = await this.kc.getQuote(kiteSymbols);
      for (const s of symbols) {
        const upper = s.toUpperCase().trim();
        const kiteKey = upper.includes(':') ? upper : `NSE:${upper}`;
        const q = quotesRes[kiteKey];
        if (q) {
          map.set(upper, {
            symbol: upper,
            regularMarketPrice: Number(q.last_price),
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

  async getSummaries(symbols: string[]): Promise<Map<string, StockSummaryData>> {
    return new Map();
  }

  async getPeers(symbol: string): Promise<string[]> {
    return [];
  }

  async getEarnings(symbol: string): Promise<EarningsData | null> {
    return null;
  }

  async getScreener(scrId: string, count?: number): Promise<ScreenerResult | null> {
    return null;
  }

  async search(query: string): Promise<any> {
    const upperQuery = query.toUpperCase().trim();
    const list = KiteInstrumentMapper.getCachedList();
    const matches = list.filter(item => 
      item.tradingsymbol?.toUpperCase().includes(upperQuery) || 
      item.name?.toUpperCase().includes(upperQuery)
    );

    return matches.slice(0, 50).map(item => ({
      symbol: `${item.exchange}:${item.tradingsymbol}`,
      shortname: item.name || item.tradingsymbol,
      longname: item.name || item.tradingsymbol,
      exchange: item.exchange,
    }));
  }
}
