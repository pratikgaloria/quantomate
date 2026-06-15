import { IDataProvider, HistoricalPriceData, QuoteData, FundamentalData, StockSummaryData, EarningsData, ScreenerResult } from './IDataProvider';

export class TradierDataProvider implements IDataProvider {
  constructor(
    private accessToken: string,
    private useSandbox: boolean = true
  ) {}

  private mapInterval(interval?: string): string {
    if (!interval) return '1min';
    const match = interval.match(/^(\d+)([mhd])$/);
    if (!match) return '1min';
    const val = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === 'm') {
      return `${val}min`;
    }
    return '1min';
  }

  private formatTradierDate(date: Date, includeTime: boolean = false): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    if (includeTime) {
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }
    return `${yyyy}-${mm}-${dd}`;
  }

  async getHistoricalData(
    symbol: string,
    start: Date,
    end: Date,
    interval?: string
  ): Promise<HistoricalPriceData[]> {
    const isDaily = !interval || interval === '1d';
    const baseUrl = this.useSandbox ? 'https://sandbox.tradier.com/v1' : 'https://api.tradier.com/v1';
    
    let url = '';
    if (isDaily) {
      url = `${baseUrl}/markets/history?symbol=${symbol.toUpperCase().trim()}&start=${this.formatTradierDate(start)}&end=${this.formatTradierDate(end)}`;
    } else {
      const tradierInterval = this.mapInterval(interval);
      url = `${baseUrl}/markets/timesales?symbol=${symbol.toUpperCase().trim()}&interval=${tradierInterval}&start=${this.formatTradierDate(start, true)}&end=${this.formatTradierDate(end, true)}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Tradier API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      let raw: any = null;
      if (isDaily) {
        raw = data.history?.day;
      } else {
        raw = data.series?.data;
      }

      const dataList = Array.isArray(raw) ? raw : (raw ? [raw] : []);
      return dataList.map((d: any) => {
        const dateVal = d.timestamp ? new Date(Number(d.timestamp) * 1000) : new Date(d.date || d.time);
        return {
          date: dateVal,
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume),
        };
      });
    } catch (err: any) {
      console.error(`[TradierDataProvider] Historical fetch failed for ${symbol}:`, err.message);
      return [];
    }
  }

  async getFundamentals(symbol: string): Promise<FundamentalData> {
    return { symbol, name: symbol };
  }

  async getQuotes(symbols: string[]): Promise<Map<string, QuoteData>> {
    const map = new Map<string, QuoteData>();
    if (symbols.length === 0) return map;

    const baseUrl = this.useSandbox ? 'https://sandbox.tradier.com/v1' : 'https://api.tradier.com/v1';
    const cleanSymbols = symbols.map(s => s.toUpperCase().trim());
    const url = `${baseUrl}/markets/quotes?symbols=${cleanSymbols.map(encodeURIComponent).join(',')}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json() as any;
        const rawQuotes = data.quotes?.quote;
        if (rawQuotes) {
          const quotesList = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];
          for (const q of quotesList) {
            if (!q || !q.symbol) continue;
            map.set(q.symbol, {
              symbol: q.symbol,
              regularMarketPrice: Number(q.last),
              bid: q.bid ? Number(q.bid) : undefined,
              ask: q.ask ? Number(q.ask) : undefined,
              regularMarketVolume: q.volume ? Number(q.volume) : undefined,
              displayName: q.description,
              shortName: q.description,
              longName: q.description,
            });
          }
        }
      }
    } catch (err: any) {
      console.error(`[TradierDataProvider] getQuotes failed:`, err.message);
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
    const baseUrl = this.useSandbox ? 'https://sandbox.tradier.com/v1' : 'https://api.tradier.com/v1';
    try {
      const response = await fetch(`${baseUrl}/markets/search?q=${encodeURIComponent(query.trim())}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json() as any;
        const securities = data.securities?.security;
        const secList = Array.isArray(securities) ? securities : (securities ? [securities] : []);
        return secList.map((s: any) => ({
          symbol: s.symbol,
          shortname: s.description,
          longname: s.description,
          exchange: s.exchange,
        }));
      }
      return [];
    } catch (err: any) {
      console.error(`[TradierDataProvider] Search failed:`, err.message);
      return [];
    }
  }
}
