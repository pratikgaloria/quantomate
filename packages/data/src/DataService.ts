import { prisma } from "@quantomate/db";
import { IDataProvider } from "./providers/IDataProvider";
import { YahooFinanceProvider } from "./providers/YahooFinanceProvider";

export class DataService {
  public static provider: IDataProvider = new YahooFinanceProvider();

  /**
   * Get historical price data for a symbol.
   * If not in database or outdated, fetches from data provider, stores in DB, and returns all.
   */
  static async getHistoricalData(
    symbolId: string,
    limit?: number,
    interval: string = "1d"
  ): Promise<any[]> {
    // 1. If interval is not Daily, fetch on-the-fly and keep in-memory
    if (interval !== "1d") {
      const now = new Date();
      const startFrom = new Date();
      if (interval === '1m') {
        startFrom.setDate(startFrom.getDate() - 7);
      } else if (interval === '5m' || interval === '15m' || interval === '1h') {
        startFrom.setDate(startFrom.getDate() - 59);
      } else {
        startFrom.setFullYear(startFrom.getFullYear() - 5);
      }
      try {
        const quotes = await DataService.provider.getHistoricalData(symbolId, startFrom, now, interval);
        let result = quotes || [];
        if (limit !== undefined) {
          result = result.slice(-limit);
        }
        return result;
      } catch (error) {
        console.error(`Error fetching on-the-fly historical data for ${symbolId} (${interval}):`, error);
        return [];
      }
    }

    // 2. Ensure symbol metadata exists in db
    const symbolMeta = await this.ensureSymbolExists(symbolId);

    // 3. Find latest price in database for this interval
    const latestPrice = await prisma.historicalPrice.findFirst({
      where: { symbolId, interval },
      orderBy: { date: "desc" },
    });

    const now = new Date();
    const SYNC_TTL = 12 * 60 * 60 * 1000; // 12 hours cache TTL for provider sync
    const isSyncedRecently =
      symbolMeta && now.getTime() - symbolMeta.updatedAt.getTime() < SYNC_TTL;

    if (!isSyncedRecently || !latestPrice) {
      if (!latestPrice) {
        // Missing entirely: fetch 5 years history for Daily data
        console.log(`No local data found for ${symbolId} (${interval}). Fetching 5 years history...`);
        const startFrom = new Date();
        startFrom.setFullYear(startFrom.getFullYear() - 5);
        await this.fetchAndStoreHistoricalData(symbolId, startFrom, now, interval);
      } else {
        // Data exists: check if outdated.
        // If latest price date is older than 24 hours, query from the day after the latestPrice date to today.
        const startFrom = new Date(
          latestPrice.date.getTime() + 24 * 60 * 60 * 1000
        );

        const startFromStr = startFrom.toISOString().split("T")[0];
        const todayStr = now.toISOString().split("T")[0];

        if (startFromStr <= todayStr) {
          console.log(
            `Local data for ${symbolId} (${interval}) is outdated (latest: ${
              latestPrice.date.toISOString().split("T")[0]
            }). Fetching incremental updates...`,
          );
          await this.fetchAndStoreHistoricalData(symbolId, startFrom, now, interval);
        } else {
          console.log(
            `Local data for ${symbolId} (${interval}) is up to date (latest: ${
              latestPrice.date.toISOString().split("T")[0]
            }).`,
          );
        }
      }

      // Mark the sync attempt by updating the Symbol's updatedAt
      await prisma.symbol.update({
        where: { id: symbolId },
        data: { updatedAt: now },
      });
    } else {
      console.log(
        `Local data for ${symbolId} (${interval}) was synced recently (within 12h). Skipping fetch.`,
      );
    }

    // 3. Return sorted historical prices from the database (applying limit if provided)
    if (limit !== undefined) {
      const prices = await prisma.historicalPrice.findMany({
        where: { symbolId, interval },
        orderBy: { date: "desc" },
        take: limit,
      });
      return prices.reverse();
    }

    return prisma.historicalPrice.findMany({
      where: { symbolId, interval },
      orderBy: { date: "asc" },
    });
  }

  /**
   * Ensure that the Symbol row exists in the Symbol table.
   * Fetches metadata from data provider if it does not exist.
   */
  private static async ensureSymbolExists(symbolId: string): Promise<any> {
    let symbolExists = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!symbolExists) {
      console.log(
        `Symbol ${symbolId} not found in database. Fetching metadata...`,
      );
      let name = symbolId;
      let sector = "Unknown";
      let industry = "Unknown";

      try {
        const fundamentals = await DataService.provider.getFundamentals(symbolId);
        name = fundamentals.name || symbolId;
        sector = fundamentals.sector || "Unknown";
        industry = fundamentals.industry || "Unknown";
      } catch (error) {
        console.warn(
          `Failed to fetch metadata for symbol ${symbolId}:`,
          (error as Error).message,
        );
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
    end: Date,
    interval: string = "1d"
  ): Promise<void> {
    const period1 = start.toISOString().split("T")[0];
    const period2 = end.toISOString().split("T")[0];

    if (period1 > period2) {
      return;
    }

    try {
      const quotes = await DataService.provider.getHistoricalData(symbolId, start, end, interval);

      if (!quotes || quotes.length === 0) {
        return;
      }

      const dataToInsert = quotes.map((q: any) => ({
        symbolId,
        date: q.date,
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close,
        volume: q.volume,
        interval,
      }));

      if (dataToInsert.length > 0) {
        await prisma.historicalPrice.createMany({
          data: dataToInsert,
          skipDuplicates: true,
        });
        console.log(
          `Saved ${dataToInsert.length} historical prices (${interval}) for ${symbolId}.`,
        );
      }
    } catch (error) {
      console.error(
        `Error fetching/storing historical data for ${symbolId}:`,
        error
      );
    }
  }
}
