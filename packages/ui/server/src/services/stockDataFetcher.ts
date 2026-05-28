import { DataService } from '@quantomate/data';

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
    const start = new Date(startDate);
    const end = new Date(endDate);

    const allData = await DataService.getHistoricalData(symbol, undefined, interval);

    return allData
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
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
