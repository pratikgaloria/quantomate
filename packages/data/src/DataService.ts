import { IDataProvider } from "./providers/IDataProvider";
import { YahooFinanceProvider } from "./providers/YahooFinanceProvider";
import { getHistoricalDataImpl } from "./utils/historicalFetcher";

export class DataService {
  public static provider: IDataProvider = new YahooFinanceProvider();

  static async getHistoricalData(
    symbolId: string,
    limit?: number,
    interval: string = "1d",
    provider?: IDataProvider
  ): Promise<any[]> {
    return getHistoricalDataImpl(symbolId, limit, interval, provider || DataService.provider);
  }
}
