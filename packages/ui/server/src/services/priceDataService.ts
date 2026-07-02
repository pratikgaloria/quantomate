import { fetchStockData, StockData } from './stockDataFetcher';
import { resolveActiveTradingRange } from './backtestDateResolver';
import { getWarmupDate } from './strategyFactory';

/**
 * Resolves a period shorthand (e.g. '1d', '1w', '1m', '1y', '3y', '5y')
 * into YYYY-MM-DD start and end date strings.
 */
export function resolvePeriodDates(period: string): { startDate: string; endDate: string } {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const p = period.toLowerCase();
  if (p === '1d') {
    start.setDate(end.getDate() - 1);
  } else if (p === '1w' || p === '1wk') {
    start.setDate(end.getDate() - 7);
  } else if (p === '1m' || p === '1mo') {
    start.setMonth(end.getMonth() - 1);
  } else if (p === '6m') {
    start.setMonth(end.getMonth() - 6);
  } else if (p === '1y') {
    start.setFullYear(end.getFullYear() - 1);
  } else if (p === '3y') {
    start.setFullYear(end.getFullYear() - 3);
  } else if (p === '5y') {
    start.setFullYear(end.getFullYear() - 5);
  } else {
    start.setFullYear(end.getFullYear() - 1);
  }

  return {
    startDate: fmt(start),
    endDate: fmt(end),
  };
}

export interface FetchPriceDataParams {
  symbol: string;
  interval: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  warmupDays?: number;
}

/**
 * Unifies the resolution of active trading ranges, warmup offsets,
 * and fetches cleaned stock candles for visualization and backtesting.
 */
export async function fetchPriceData(params: FetchPriceDataParams): Promise<{
  data: StockData[];
  resolvedStartDate: string;
  resolvedEndDate: string;
}> {
  const { symbol, interval, period, warmupDays = 0 } = params;

  let startDate = params.startDate || '';
  let endDate = params.endDate || '';

  if (period) {
    const dates = resolvePeriodDates(period);
    startDate = dates.startDate;
    endDate = dates.endDate;
  }

  // Adjust date range for active trading days (handles weekends/holidays)
  const resolved = await resolveActiveTradingRange(symbol, startDate, endDate, interval);

  // Apply warmup prefix if requested
  let fetchStart = resolved.startDate;
  if (warmupDays > 0) {
    fetchStart = getWarmupDate(resolved.startDate, warmupDays);
  }

  // Fetch data
  const data = await fetchStockData(symbol, fetchStart, resolved.endDate, interval);

  return {
    data,
    resolvedStartDate: resolved.startDate,
    resolvedEndDate: resolved.endDate,
  };
}
