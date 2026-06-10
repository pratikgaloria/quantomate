import YahooFinance from 'yahoo-finance2';
import {
  IDataProvider,
  HistoricalPriceData,
  FundamentalData,
  QuoteData,
  StockSummaryData,
  EarningsData,
  ScreenerResult
} from './IDataProvider';
import { KiteInstrumentMapper } from './KiteProvider';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export class YahooFinanceProvider implements IDataProvider {
  private toYahooTicker(symbol: string): string {
    const sym = symbol.toUpperCase().trim();
    if (sym === "NIFTY 50" || sym === "NSEI" || sym === "NIFTY" || sym === "^NSEI") {
      return "^NSEI";
    }
    if (sym === "NIFTY BANK" || sym === "NSEBANK" || sym === "BANKNIFTY" || sym === "^NSEBANK") {
      return "^NSEBANK";
    }
    if (sym.endsWith(".NS") || sym.startsWith("^")) {
      return sym;
    }
    
    // Check if it exists in Kite Instrument Mapper (indicates Indian market asset)
    const hasKiteToken = KiteInstrumentMapper.getInstrumentToken(sym) !== undefined || 
                         KiteInstrumentMapper.getInstrumentToken("NSE:" + sym) !== undefined;
                         
    if (hasKiteToken) {
      const cleanSym = sym.replace("NSE:", "").replace("NFO:", "");
      return `${cleanSym}.NS`;
    }

    // Fallback crypto
    const cryptoAssets = ["BTC", "ETH", "SOL", "ADA", "DOT", "DOGE", "XRP"];
    if (
      cryptoAssets.some(
        (c) =>
          sym.startsWith(c) ||
          sym.endsWith(c) ||
          sym.includes("/USD") ||
          sym.includes("-USD"),
      )
    ) {
      return sym.replace("/", "-");
    }
    
    // Fallback: Indian hardcoded list
    if (
      sym.startsWith("NSE:") ||
      sym.startsWith("NFO:") ||
      ["SBIN", "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"].includes(sym)
    ) {
      const cleanSym = sym.replace("NSE:", "").replace("NFO:", "");
      return `${cleanSym}.NS`;
    }
    
    return sym;
  }

  async getHistoricalData(
    symbol: string,
    start: Date,
    end: Date,
    interval: string = '1d'
  ): Promise<HistoricalPriceData[]> {
    const yahooSymbol = this.toYahooTicker(symbol);
    const period1 = start.toISOString().split('T')[0];
    const period2 = end.toISOString().split('T')[0];

    try {
      // Use chart api to support sub-daily intervals (e.g. 1h)
      const result = await yahooFinance.chart(yahooSymbol, {
        period1,
        period2,
        interval: interval as any,
        return: 'array'
      });

      if (!result || !result.quotes || result.quotes.length === 0) {
        return [];
      }

      return result.quotes
        .filter(
          (q: any) =>
            q.open !== null &&
            q.high !== null &&
            q.low !== null &&
            q.close !== null
        )
        .map((q: any) => ({
          date: new Date(q.date),
          open: Number(q.open),
          high: Number(q.high),
          low: Number(q.low),
          close: Number(q.close),
          volume: Number(q.volume || 0),
        }));
    } catch (error) {
      console.error(`YahooFinanceProvider: Failed to fetch chart data for ${symbol} (mapped to ${yahooSymbol}):`, error);
      
      // Fallback to historical api for 1d if chart fails
      if (interval === '1d') {
        try {
          const quotes = await yahooFinance.historical(yahooSymbol, {
            period1,
            period2,
            interval: '1d',
          });

          if (!quotes || quotes.length === 0) return [];

          return quotes
            .filter(
              (q: any) =>
                q.open !== null &&
                q.high !== null &&
                q.low !== null &&
                q.close !== null
            )
            .map((q: any) => ({
              date: new Date(q.date),
              open: Number(q.open),
              high: Number(q.high),
              low: Number(q.low),
              close: Number(q.close),
              volume: Number(q.volume || 0),
            }));
        } catch (histError) {
          console.error(`YahooFinanceProvider: Fallback historical failed for ${symbol} (mapped to ${yahooSymbol}):`, histError);
        }
      }
      return [];
    }
  }

  async getFundamentals(symbol: string): Promise<FundamentalData> {
    const yahooSymbol = this.toYahooTicker(symbol);
    try {
      const summary = await yahooFinance.quoteSummary(yahooSymbol, {
        modules: ['defaultKeyStatistics', 'summaryDetail', 'financialData', 'summaryProfile', 'price']
      }) as any;

      const peRatio = summary.summaryDetail?.trailingPE ?? undefined;
      const forwardPe = summary.summaryDetail?.forwardPE ?? undefined;
      const priceToSales = summary.summaryDetail?.priceToSalesTrailing12Months ?? undefined;
      const evToEbitda = summary.defaultKeyStatistics?.enterpriseToEbitda ?? undefined;
      
      const freeCashflow = summary.financialData?.freeCashflow;
      const marketCap = summary.summaryDetail?.marketCap;
      const fcfYield = (freeCashflow && marketCap && marketCap > 0) ? freeCashflow / marketCap : undefined;
      
      const revGrowth = summary.financialData?.revenueGrowth ?? undefined;
      const epsGrowth = summary.financialData?.earningsGrowth ?? undefined;

      const name = summary.price?.longName || summary.price?.shortName || symbol;
      const sector = summary.summaryProfile?.sector || 'Unknown';
      const industry = summary.summaryProfile?.industry || 'Unknown';

      return {
        symbol: symbol, // Return the requested symbol ID
        peRatio,
        forwardPe,
        priceToSales,
        evToEbitda,
        fcfYield,
        revGrowth,
        epsGrowth,
        name,
        sector,
        industry
      };
    } catch (error) {
      console.error(`YahooFinanceProvider: Failed to fetch fundamentals for ${symbol} (mapped to ${yahooSymbol}):`, error);
      throw error;
    }
  }

  async getQuotes(symbols: string[]): Promise<Map<string, QuoteData>> {
    const quotesMap = new Map<string, QuoteData>();
    if (symbols.length === 0) return quotesMap;

    const yahooToOriginal = new Map<string, string>();
    const yahooSymbols = symbols.map(s => {
      const ys = this.toYahooTicker(s);
      yahooToOriginal.set(ys.toUpperCase(), s);
      return ys;
    });

    try {
      const quotes = await yahooFinance.quote(
        yahooSymbols,
        {
          return: 'map',
          fields: [
            'symbol', 'shortName', 'longName', 'displayName', 'regularMarketPrice', 'regularMarketChange',
            'regularMarketChangePercent', 'regularMarketPreviousClose', 'marketCap',
            'bid', 'ask', 'bidSize', 'askSize', 'fullExchangeName', 'financialCurrency',
            'earningsTimestamp', 'earningsTimestampStart', 'earningsTimestampEnd',
            'dividendDate', 'trailingAnnualDividendRate', 'trailingAnnualDividendYield',
            'fiftyTwoWeekLow', 'fiftyTwoWeekHigh', 'marketState',
            'preMarketPrice', 'preMarketChange', 'preMarketChangePercent',
            'postMarketPrice', 'postMarketChange', 'postMarketChangePercent',
            'extendedMarketPrice', 'extendedMarketChange', 'extendedMarketChangePercent',
            'hasPrePostMarketData', 'currency', 'regularMarketVolume',
            'beta', 'trailingPE'
          ]
        },
        { validateResult: false }
      ) as any;

      if (quotes) {
        for (const [yahooSym, quote] of quotes.entries()) {
          const original = yahooToOriginal.get(yahooSym.toUpperCase()) || yahooSym;
          quotesMap.set(original, {
            symbol: original, // Return the requested symbol ID
            shortName: quote.shortName,
            longName: quote.longName,
            displayName: quote.displayName,
            regularMarketPrice: quote.regularMarketPrice,
            regularMarketChange: quote.regularMarketChange,
            regularMarketChangePercent: quote.regularMarketChangePercent,
            regularMarketPreviousClose: quote.regularMarketPreviousClose,
            marketCap: quote.marketCap,
            bid: quote.bid,
            ask: quote.ask,
            bidSize: quote.bidSize,
            askSize: quote.askSize,
            fullExchangeName: quote.fullExchangeName,
            financialCurrency: quote.financialCurrency,
            earningsTimestamp: quote.earningsTimestamp ? new Date(quote.earningsTimestamp) : undefined,
            earningsTimestampStart: quote.earningsTimestampStart ? new Date(quote.earningsTimestampStart) : undefined,
            earningsTimestampEnd: quote.earningsTimestampEnd ? new Date(quote.earningsTimestampEnd) : undefined,
            dividendDate: quote.dividendDate ? new Date(quote.dividendDate) : undefined,
            trailingAnnualDividendRate: quote.trailingAnnualDividendRate,
            trailingAnnualDividendYield: quote.trailingAnnualDividendYield,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
            marketState: quote.marketState,
            preMarketPrice: quote.preMarketPrice,
            preMarketChange: quote.preMarketChange,
            preMarketChangePercent: quote.preMarketChangePercent,
            postMarketPrice: quote.postMarketPrice,
            postMarketChange: quote.postMarketChange,
            postMarketChangePercent: quote.postMarketChangePercent,
            extendedMarketPrice: quote.extendedMarketPrice,
            extendedMarketChange: quote.extendedMarketChange,
            extendedMarketChangePercent: quote.extendedMarketChangePercent,
            hasPrePostMarketData: quote.hasPrePostMarketData,
            currency: quote.currency,
            regularMarketVolume: quote.regularMarketVolume,
            beta: quote.beta,
            trailingPE: quote.trailingPE
          });
        }
      }
    } catch (error) {
      console.error(`YahooFinanceProvider: Failed to fetch quotes for group:`, error);
    }

    return quotesMap;
  }

  async getSummaries(symbols: string[]): Promise<Map<string, StockSummaryData>> {
    const summaryMap = new Map<string, StockSummaryData>();
    if (symbols.length === 0) return summaryMap;

    await Promise.all(
      symbols.map(async (symbol) => {
        const yahooSymbol = this.toYahooTicker(symbol);
        try {
          const summary = await yahooFinance.quoteSummary(yahooSymbol, {
            modules: ['defaultKeyStatistics', 'summaryDetail', 'financialData']
          }) as any;

          summaryMap.set(symbol, {
            beta: summary.defaultKeyStatistics?.beta ?? undefined,
            trailingPE: summary.summaryDetail?.trailingPE ?? undefined,
            forwardPE: summary.summaryDetail?.forwardPE ?? undefined,
            priceToSales: summary.summaryDetail?.priceToSalesTrailing12Months ?? undefined,
            enterpriseToEbitda: summary.defaultKeyStatistics?.enterpriseToEbitda ?? undefined,
            freeCashflow: summary.financialData?.freeCashflow ?? undefined,
            marketCap: summary.summaryDetail?.marketCap ?? undefined,
            dividendYield: summary.summaryDetail?.dividendYield ?? undefined,
            revenueGrowth: summary.financialData?.revenueGrowth ?? undefined,
            earningsGrowth: summary.financialData?.earningsGrowth ?? undefined,
            grossMargins: summary.financialData?.grossMargins ?? undefined,
            operatingMargins: summary.financialData?.operatingMargins ?? undefined
          });
        } catch (error) {
          console.error(`YahooFinanceProvider: Failed to fetch summary for ${symbol} (mapped to ${yahooSymbol}):`, error);
        }
      })
    );

    return summaryMap;
  }

  async getPeers(symbol: string): Promise<string[]> {
    const yahooSymbol = this.toYahooTicker(symbol);
    try {
      const recommendations = await yahooFinance.recommendationsBySymbol(yahooSymbol);
      return (recommendations.recommendedSymbols || [])
        .map((s: any) => s.symbol)
        .slice(0, 10);
    } catch (error) {
      console.error(`YahooFinanceProvider: Failed to fetch peers for ${symbol} (mapped to ${yahooSymbol}):`, error);
      return [];
    }
  }

  async getEarnings(symbol: string): Promise<EarningsData | null> {
    const yahooSymbol = this.toYahooTicker(symbol);
    try {
      const summary = await yahooFinance.quoteSummary(yahooSymbol, {
        modules: ['earnings', 'calendarEvents']
      }) as any;

      if (!summary) return null;

      const earningsChart = summary.earnings?.earningsChart;
      const financialsChart = summary.earnings?.financialsChart;

      const formattedEarningsChart = earningsChart ? {
        quarterly: (earningsChart.quarterly || []).map((q: any) => ({
          date: q.date,
          actual: q.actual,
          estimate: q.estimate
        }))
      } : undefined;

      const formattedFinancialsChart = financialsChart ? {
        quarterly: (financialsChart.quarterly || []).map((q: any) => ({
          date: q.date,
          revenue: q.revenue,
          earnings: q.earnings
        })),
        yearly: (financialsChart.yearly || []).map((y: any) => ({
          date: y.date,
          revenue: y.revenue,
          earnings: y.earnings
        }))
      } : undefined;

      const formattedCalendarEvents = summary.calendarEvents?.earnings ? {
        earnings: {
          earningsDate: (summary.calendarEvents.earnings.earningsDate || []).map((d: any) => new Date(d))
        }
      } : undefined;

      return {
        earnings: {
          financialCurrency: summary.earnings?.financialCurrency,
          earningsChart: formattedEarningsChart,
          financialsChart: formattedFinancialsChart
        },
        calendarEvents: formattedCalendarEvents
      };
    } catch (error) {
      console.error(`YahooFinanceProvider: Failed to fetch earnings for ${symbol} (mapped to ${yahooSymbol}):`, error);
      return null;
    }
  }

  async getScreener(scrId: string, count: number = 25): Promise<ScreenerResult | null> {
    try {
      const results = await yahooFinance.screener({
        scrIds: scrId as any,
        count: count,
        params: {
          formatted: false
        }
      } as any);

      if (!results || !results.quotes) {
        return { quotes: [] };
      }

      const mappedQuotes: QuoteData[] = results.quotes.map((quote: any) => ({
        symbol: quote.symbol,
        shortName: quote.shortName,
        longName: quote.longName,
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChange: quote.regularMarketChange,
        regularMarketChangePercent: quote.regularMarketChangePercent,
        regularMarketPreviousClose: quote.regularMarketPreviousClose,
        marketCap: quote.marketCap,
        bid: quote.bid,
        ask: quote.ask,
        bidSize: quote.bidSize,
        askSize: quote.askSize,
        fullExchangeName: quote.fullExchangeName,
        financialCurrency: quote.financialCurrency,
        earningsTimestamp: quote.earningsTimestamp ? new Date(quote.earningsTimestamp) : undefined,
        earningsTimestampStart: quote.earningsTimestampStart ? new Date(quote.earningsTimestampStart) : undefined,
        earningsTimestampEnd: quote.earningsTimestampEnd ? new Date(quote.earningsTimestampEnd) : undefined,
        dividendDate: quote.dividendDate ? new Date(quote.dividendDate) : undefined,
        trailingAnnualDividendRate: quote.trailingAnnualDividendRate,
        trailingAnnualDividendYield: quote.trailingAnnualDividendYield,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        marketState: quote.marketState,
        preMarketPrice: quote.preMarketPrice,
        preMarketChange: quote.preMarketChange,
        preMarketChangePercent: quote.preMarketChangePercent,
        postMarketPrice: quote.postMarketPrice,
        postMarketChange: quote.postMarketChange,
        postMarketChangePercent: quote.postMarketChangePercent,
        extendedMarketPrice: quote.extendedMarketPrice,
        extendedMarketChange: quote.extendedMarketChange,
        extendedMarketChangePercent: quote.extendedMarketChangePercent,
        hasPrePostMarketData: quote.hasPrePostMarketData,
        currency: quote.currency,
        regularMarketVolume: quote.regularMarketVolume
      }));

      return { quotes: mappedQuotes };
    } catch (error) {
      console.error(`YahooFinanceProvider: Failed to fetch screener ${scrId}:`, error);
      return null;
    }
  }

  async search(query: string): Promise<any> {
    try {
      const result = await yahooFinance.search(query, {}, { validateResult: false }) as any;
      return result.quotes || [];
    } catch (error) {
      console.error(`YahooFinanceProvider: Failed to search for ${query}:`, error);
      return [];
    }
  }
}
