import { prisma } from '@quantomate/db';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export class DataService {
  /**
   * Get historical price data for a symbol.
   * If not in database or outdated, fetches from Yahoo Finance, stores in DB, and returns all.
   */
  static async getHistoricalData(symbolId: string): Promise<any[]> {
    // 1. Ensure symbol metadata exists in db
    const symbolMeta = await this.ensureSymbolExists(symbolId);

    // 2. Find latest price in database
    const latestPrice = await prisma.historicalPrice.findFirst({
      where: { symbolId },
      orderBy: { date: 'desc' },
    });

    const now = new Date();
    const SYNC_TTL = 12 * 60 * 60 * 1000; // 12 hours cache TTL for Yahoo Finance sync
    const isSyncedRecently = symbolMeta && (now.getTime() - symbolMeta.updatedAt.getTime() < SYNC_TTL);

    if (!isSyncedRecently) {
      if (!latestPrice) {
        // Missing entirely: fetch 5 years
        console.log(`No local data found for ${symbolId}. Fetching 5 years history from Yahoo Finance...`);
        const startFrom = new Date();
        startFrom.setFullYear(startFrom.getFullYear() - 5);
        await this.fetchAndStoreHistoricalData(symbolId, startFrom, now);
      } else {
        // Data exists: check if outdated.
        // If latest price date is older than 24 hours, query from the day after the latestPrice date to today.
        const startFrom = new Date(latestPrice.date.getTime() + 24 * 60 * 60 * 1000);
        
        const startFromStr = startFrom.toISOString().split('T')[0];
        const todayStr = now.toISOString().split('T')[0];
        
        if (startFromStr <= todayStr) {
          console.log(`Local data for ${symbolId} is outdated (latest: ${latestPrice.date.toISOString().split('T')[0]}). Fetching incremental updates...`);
          await this.fetchAndStoreHistoricalData(symbolId, startFrom, now);
        } else {
          console.log(`Local data for ${symbolId} is up to date (latest: ${latestPrice.date.toISOString().split('T')[0]}).`);
        }
      }

      // Mark the sync attempt by updating the Symbol's updatedAt
      await prisma.symbol.update({
        where: { id: symbolId },
        data: { updatedAt: now }
      });
    } else {
      console.log(`Local data for ${symbolId} was synced recently (within 12h). Skipping Yahoo Finance fetch.`);
    }

    // 3. Return all sorted historical prices from the database
    return prisma.historicalPrice.findMany({
      where: { symbolId },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Ensure that the Symbol row exists in the Symbol table.
   * Fetches metadata from yahoo-finance2 if it does not exist.
   */
  private static async ensureSymbolExists(symbolId: string): Promise<any> {
    let symbolExists = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!symbolExists) {
      console.log(`Symbol ${symbolId} not found in database. Fetching metadata from Yahoo Finance...`);
      let name = symbolId;
      let sector = "Unknown";
      let industry = "Unknown";

      try {
        const summary = await yahooFinance.quoteSummary(symbolId, {
          modules: ['summaryProfile', 'price'],
        });
        
        name = summary.price?.longName || summary.price?.shortName || symbolId;
        sector = summary.summaryProfile?.sector || "Unknown";
        industry = summary.summaryProfile?.industry || "Unknown";
      } catch (error) {
        console.warn(`Failed to fetch metadata for symbol ${symbolId}:`, (error as Error).message);
      }

      symbolExists = await prisma.symbol.create({
        data: {
          id: symbolId,
          name,
          sector,
          industry,
        },
      });
    }

    return symbolExists;
  }

  /**
   * Fetches and stores historical prices for a symbol from a start date to an end date.
   */
  private static async fetchAndStoreHistoricalData(
    symbolId: string,
    start: Date,
    end: Date
  ): Promise<void> {
    const period1 = start.toISOString().split('T')[0];
    let period2 = end.toISOString().split('T')[0];

    if (period1 > period2) {
      return;
    }

    if (period1 === period2) {
      const nextDay = new Date(end.getTime() + 24 * 60 * 60 * 1000);
      period2 = nextDay.toISOString().split('T')[0];
    }

    try {
      const quotes = await yahooFinance.historical(symbolId, {
        period1,
        period2,
        interval: '1d',
      });

      if (!quotes || quotes.length === 0) {
        return;
      }

      // Filter invalid rows and map
      const dataToInsert = quotes
        .filter((q: any) => q.open !== null && q.high !== null && q.low !== null && q.close !== null)
        .map((q: any) => ({
          symbolId,
          date: new Date(q.date),
          open: Number(q.open),
          high: Number(q.high),
          low: Number(q.low),
          close: Number(q.close),
          volume: Number(q.volume || 0),
        }));

      if (dataToInsert.length > 0) {
        await prisma.historicalPrice.createMany({
          data: dataToInsert,
          skipDuplicates: true,
        });
        console.log(`Saved ${dataToInsert.length} historical prices for ${symbolId}.`);
      }
    } catch (error) {
      console.error(`Error fetching/storing historical data for ${symbolId}:`, error);
    }
  }
}
