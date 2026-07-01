import { prisma } from "@quantomate/db";
import { IDataProvider } from "../providers/IDataProvider";

export async function fetchAndStoreHistoricalData(
  symbolId: string,
  start: Date,
  end: Date,
  interval: string,
  provider: IDataProvider
): Promise<void> {
  const period1 = start.toISOString().split("T")[0];
  const period2 = end.toISOString().split("T")[0];

  if (period1 > period2) return;

  try {
    const quotes = await provider.getHistoricalData(symbolId, start, end, interval);
    if (!quotes || quotes.length === 0) return;

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
      console.log(`Saved ${dataToInsert.length} historical prices (${interval}) for ${symbolId}.`);
    }
  } catch (error) {
    console.error(`Error fetching/storing historical data for ${symbolId}:`, error);
  }
}
