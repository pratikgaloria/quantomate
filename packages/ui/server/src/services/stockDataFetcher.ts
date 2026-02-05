import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function fetchStockData(
  symbol: string,
  startDate: string,
  endDate: string,
  interval: string = '1d'
): Promise<StockData[]> {
  try {
    const result = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: interval as any,
      return: 'array'
    });

    return result.quotes
      .filter(quote => 
        quote.open !== null && 
        quote.high !== null && 
        quote.low !== null && 
        quote.close !== null
      )
      .map(quote => ({
        date: quote.date,
        open: quote.open as number,
        high: quote.high as number,
        low: quote.low as number,
        close: quote.close as number,
        volume: quote.volume as number,
      }));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw new Error(`Failed to fetch stock data for ${symbol}`);
  }
}
