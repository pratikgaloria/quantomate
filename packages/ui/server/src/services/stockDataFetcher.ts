import { DataService } from '@quantomate/data';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

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
    let tz = 'UTC';
    try {
      const quote = await yahooFinance.quote(symbol);
      if (quote && quote.exchangeTimezoneName) {
        tz = quote.exchangeTimezoneName;
      }
    } catch (err: any) {
      console.warn(`Failed to fetch timezone from Yahoo Finance for ${symbol}, falling back to UTC. Error: ${err.message}`);
    }

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const allData = await DataService.getHistoricalData(symbol, undefined, interval);

    return allData
      .filter(item => {
        const itemDateStr = formatter.format(new Date(item.date));
        return itemDateStr >= startDate && itemDateStr <= endDate;
      })
      .map(item => ({
        date: new Date(item.date),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw new Error(`Failed to fetch stock data for ${symbol}`);
  }
}
