import { prisma } from "@quantomate/db";
import { IDataProvider } from "../providers/IDataProvider";
import { ensureSymbolExists } from "./symbolHelper";
import { fetchAndStoreHistoricalData } from "./historicalStore";

export async function getHistoricalDataImpl(
  symbolId: string,
  limit: number | undefined,
  interval: string,
  provider: IDataProvider
): Promise<any[]> {
  if (interval !== "1d") {
    const now = new Date();
    const startFrom = new Date();
    if (interval === '1m') {
      startFrom.setDate(startFrom.getDate() - 7);
    } else if (interval === '5m' || interval === '15m' || interval === '1h') {
      startFrom.setDate(startFrom.getDate() - 40); // 40 days to stay within Tradier API limit
    } else {
      startFrom.setFullYear(startFrom.getFullYear() - 5);
    }
    try {
      const quotes = await provider.getHistoricalData(symbolId, startFrom, now, interval);
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

  const symbolMeta = await ensureSymbolExists(symbolId, provider);
  const latestPrice = await prisma.historicalPrice.findFirst({
    where: { symbolId, interval },
    orderBy: { date: "desc" },
  });

  const now = new Date();
  const SYNC_TTL = 12 * 60 * 60 * 1000;
  const isSyncedRecently = symbolMeta && now.getTime() - symbolMeta.updatedAt.getTime() < SYNC_TTL;

  if (!isSyncedRecently || !latestPrice) {
    if (!latestPrice) {
      console.log(`No local data found for ${symbolId} (${interval}). Fetching 5 years history...`);
      const startFrom = new Date();
      startFrom.setFullYear(startFrom.getFullYear() - 5);
      await fetchAndStoreHistoricalData(symbolId, startFrom, now, interval, provider);
    } else {
      const startFrom = new Date(latestPrice.date.getTime() + 24 * 60 * 60 * 1000);
      const startFromStr = startFrom.toISOString().split("T")[0];
      const todayStr = now.toISOString().split("T")[0];

      if (startFromStr <= todayStr) {
        console.log(`Local data for ${symbolId} (${interval}) is outdated (latest: ${latestPrice.date.toISOString().split("T")[0]}). Fetching incremental updates...`);
        await fetchAndStoreHistoricalData(symbolId, startFrom, now, interval, provider);
      } else {
        console.log(`Local data for ${symbolId} (${interval}) is up to date (latest: ${latestPrice.date.toISOString().split("T")[0]}).`);
      }
    }

    await prisma.symbol.update({
      where: { id: symbolId },
      data: { updatedAt: now },
    });
  } else {
    console.log(`Local data for ${symbolId} (${interval}) was synced recently (within 12h). Skipping fetch.`);
  }

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
