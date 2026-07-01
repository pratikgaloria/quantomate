import { DataService, YahooFinanceProvider } from '@quantomate/data';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function resolveActiveTradingRange(
  symbol: string,
  startDate: string,
  endDate: string,
  interval: string = '1d'
): Promise<{ startDate: string; endDate: string }> {
  try {
    let tz = 'UTC';
    try {
      const quote = await yahooFinance.quote(symbol);
      if (quote && quote.exchangeTimezoneName) {
        tz = quote.exchangeTimezoneName;
      }
    } catch (err: any) {
      console.warn(`Failed to fetch timezone from Yahoo Finance for ${symbol}, falling back to UTC: ${err.message}`);
    }

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const yahooProvider = new YahooFinanceProvider();
    const allData = await DataService.getHistoricalData(symbol, undefined, interval, yahooProvider);

    if (!allData || allData.length === 0) {
      return { startDate, endDate };
    }

    // Check if there is already data in the requested range
    const hasData = allData.some(item => {
      const itemDateStr = formatter.format(new Date(item.date));
      return itemDateStr >= startDate && itemDateStr <= endDate;
    });

    if (hasData) {
      return { startDate, endDate };
    }

    // No data in requested range. Find the latest date in allData <= endDate
    let bestDateStr: string | null = null;
    for (const item of allData) {
      const itemDateStr = formatter.format(new Date(item.date));
      if (itemDateStr <= endDate) {
        if (!bestDateStr || itemDateStr > bestDateStr) {
          bestDateStr = itemDateStr;
        }
      }
    }

    if (bestDateStr) {
      console.log(`[BacktestDateResolver] No data for ${symbol} between ${startDate} and ${endDate}. Adjusted to last active day: ${bestDateStr}`);
      return { startDate: bestDateStr, endDate: bestDateStr };
    }

    return { startDate, endDate };
  } catch (error) {
    console.error(`Error resolving active trading range for ${symbol}:`, error);
    return { startDate, endDate };
  }
}
