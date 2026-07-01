import { prisma } from "@quantomate/db";
import { IDataProvider } from "../providers/IDataProvider";

export async function ensureSymbolExists(symbolId: string, provider: IDataProvider): Promise<any> {
  let symbolExists = await prisma.symbol.findUnique({
    where: { id: symbolId },
  });

  if (!symbolExists) {
    console.log(`Symbol ${symbolId} not found in database. Fetching metadata...`);
    let name = symbolId;
    let sector = "Unknown";
    let industry = "Unknown";

    try {
      const fundamentals = await provider.getFundamentals(symbolId);
      name = fundamentals.name || symbolId;
      sector = fundamentals.sector || "Unknown";
      industry = fundamentals.industry || "Unknown";
    } catch (error: any) {
      console.warn(`Failed to fetch metadata for symbol ${symbolId}:`, error.message);
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
