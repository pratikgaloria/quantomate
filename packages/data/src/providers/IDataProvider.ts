export interface HistoricalPriceData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FundamentalData {
  symbol?: string;
  peRatio?: number;
  forwardPe?: number;
  priceToSales?: number;
  evToEbitda?: number;
  fcfYield?: number;
  revGrowth?: number;
  epsGrowth?: number;
  name?: string;
  sector?: string;
  industry?: string;
}

export interface QuoteData {
  symbol: string;
  shortName?: string;
  longName?: string;
  displayName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  marketCap?: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  fullExchangeName?: string;
  financialCurrency?: string;
  earningsTimestamp?: Date;
  earningsTimestampStart?: Date;
  earningsTimestampEnd?: Date;
  dividendDate?: Date;
  trailingAnnualDividendRate?: number;
  trailingAnnualDividendYield?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  marketState?: string;
  preMarketPrice?: number;
  preMarketChange?: number;
  preMarketChangePercent?: number;
  postMarketPrice?: number;
  postMarketChange?: number;
  postMarketChangePercent?: number;
  extendedMarketPrice?: number;
  extendedMarketChange?: number;
  extendedMarketChangePercent?: number;
  hasPrePostMarketData?: boolean;
  currency?: string;
  regularMarketVolume?: number;
  beta?: number;
  trailingPE?: number;
}

export interface StockSummaryData {
  beta?: number;
  trailingPE?: number;
  forwardPE?: number;
  priceToSales?: number;
  enterpriseToEbitda?: number;
  freeCashflow?: number;
  marketCap?: number;
  dividendYield?: number;
  revenueGrowth?: number;
  earningsGrowth?: number;
  grossMargins?: number;
  operatingMargins?: number;
}

export interface EarningsQuarterlyPerformance {
  date: string;
  actual: number;
  estimate: number;
}

export interface FinancialsQuarterly {
  date: string;
  revenue: number;
  earnings: number;
}

export interface FinancialsYearly {
  date: number;
  revenue: number;
  earnings: number;
}

export interface EarningsData {
  earnings: {
    financialCurrency?: string;
    earningsChart?: {
      quarterly?: EarningsQuarterlyPerformance[];
    };
    financialsChart?: {
      quarterly?: FinancialsQuarterly[];
      yearly?: FinancialsYearly[];
    };
  };
  calendarEvents?: {
    earnings?: {
      earningsDate?: Date[];
    };
  };
}

export interface ScreenerResult {
  quotes: QuoteData[];
}

export interface IDataProvider {
  getHistoricalData(
    symbol: string,
    start: Date,
    end: Date,
    interval?: string
  ): Promise<HistoricalPriceData[]>;

  getFundamentals(symbol: string): Promise<FundamentalData>;

  getQuotes(symbols: string[]): Promise<Map<string, QuoteData>>;

  getSummaries(symbols: string[]): Promise<Map<string, StockSummaryData>>;

  getPeers(symbol: string): Promise<string[]>;

  getEarnings(symbol: string): Promise<EarningsData | null>;

  getScreener(scrId: string, count?: number): Promise<ScreenerResult | null>;
  search(query: string): Promise<any>;
}
