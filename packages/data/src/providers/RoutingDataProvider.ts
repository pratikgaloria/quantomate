import { IDataProvider, HistoricalPriceData, QuoteData, FundamentalData, StockSummaryData, EarningsData, ScreenerResult } from './IDataProvider';
import { KiteDataProvider } from './KiteDataProvider';
import { TradierDataProvider } from './TradierDataProvider';

export class RoutingDataProvider implements IDataProvider {
  private kiteProvider: KiteDataProvider;
  private tradierProvider: TradierDataProvider;

  constructor(options?: { kite?: KiteDataProvider; tradier?: TradierDataProvider }) {
    const kiteKey = process.env.ZERODHA_API_KEY || '';
    this.kiteProvider = options?.kite || new KiteDataProvider(kiteKey, '');

    const tradierToken = process.env.TRADIER_API_KEY || '';
    const useSandbox = process.env.TRADIER_ENV !== 'production';
    this.tradierProvider = options?.tradier || new TradierDataProvider(tradierToken, useSandbox);
  }

  private getProviderForSymbol(symbol: string): IDataProvider {
    const sym = symbol.toUpperCase().trim();
    // Indian stock / index detection
    const isIndia =
      sym.startsWith("NIFTY") ||
      sym.startsWith("BANKNIFTY") ||
      sym.startsWith("^NSE") ||
      sym.endsWith(".NS") ||
      sym.includes("NSEI") ||
      sym.includes("NSEBANK") ||
      sym.startsWith("NSE:") ||
      sym.startsWith("NFO:") ||
      ["SBIN", "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"].includes(sym);

    if (isIndia) {
      return this.kiteProvider;
    }
    // Default to Tradier for US/other equities
    return this.tradierProvider;
  }

  async getHistoricalData(
    symbol: string,
    start: Date,
    end: Date,
    interval?: string
  ): Promise<HistoricalPriceData[]> {
    return this.getProviderForSymbol(symbol).getHistoricalData(symbol, start, end, interval);
  }

  async getFundamentals(symbol: string): Promise<FundamentalData> {
    return this.getProviderForSymbol(symbol).getFundamentals(symbol);
  }

  async getQuotes(symbols: string[]): Promise<Map<string, QuoteData>> {
    const res = new Map<string, QuoteData>();
    const kiteSyms: string[] = [];
    const tradierSyms: string[] = [];

    for (const sym of symbols) {
      if (this.getProviderForSymbol(sym) === this.kiteProvider) {
        kiteSyms.push(sym);
      } else {
        tradierSyms.push(sym);
      }
    }

    if (kiteSyms.length > 0) {
      try {
        const kq = await this.kiteProvider.getQuotes(kiteSyms);
        for (const [k, v] of kq.entries()) res.set(k, v);
      } catch (err: any) {
        console.error('[RoutingDataProvider] Kite getQuotes failed:', err.message);
      }
    }

    if (tradierSyms.length > 0) {
      try {
        const tq = await this.tradierProvider.getQuotes(tradierSyms);
        for (const [k, v] of tq.entries()) res.set(k, v);
      } catch (err: any) {
        console.error('[RoutingDataProvider] Tradier getQuotes failed:', err.message);
      }
    }

    return res;
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
    const kRes = await this.kiteProvider.search(query);
    const tRes = await this.tradierProvider.search(query);
    return [...kRes, ...tRes];
  }
}
