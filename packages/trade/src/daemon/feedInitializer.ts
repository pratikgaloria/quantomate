import log from 'npmlog';
import {
  KiteLiveFeed,
  KiteInstrumentMapper,
  TradierLiveFeed,
  CompositeLiveFeed
} from '@quantomate/data';
import { getMarketForSymbol } from '../utils/market';

export async function initializeFeed(
  hasIndiaMarket: boolean,
  hasUSMarket: boolean,
  apiKey: string | undefined,
  session: any,
  tradierApiKey: string | undefined
): Promise<any> {
  const activeFeeds: any[] = [];

  if (hasIndiaMarket && apiKey && session) {
    log.info("Daemon", "Initializing Zerodha/Kite Live Feed...");
    const kiteFeed = new KiteLiveFeed(apiKey, session.accessToken);
    activeFeeds.push({
      feed: kiteFeed,
      matches: (sym: string) => getMarketForSymbol(sym) === "india",
    });
    try {
      log.info("Daemon", "Loading Zerodha instrument tokens...");
      await KiteInstrumentMapper.load(apiKey);
    } catch (err) {
      log.error("Daemon", "Failed to load instruments mapper:", err);
    }
  }

  if (hasUSMarket && tradierApiKey) {
    log.info("Daemon", "Initializing Tradier Live Feed for US market...");
    const useSandbox = process.env.TRADIER_ENV !== "production";
    const tradierFeed = new TradierLiveFeed(tradierApiKey, useSandbox);
    activeFeeds.push({
      feed: tradierFeed,
      matches: (sym: string) => getMarketForSymbol(sym) === "us",
    });
  }

  if (activeFeeds.length === 0) {
    log.info("Daemon", "No active feeds open. Using fallback/mock feed.");
    return {
      connect: async () => log.info("Feed", "Mock connected"),
      disconnect: async () => log.info("Feed", "Mock disconnected"),
      subscribe: (syms: string[], cb: any) =>
        log.info("Feed", `Mock subscribed to: ${syms.join(", ")}`),
      unsubscribe: () => {},
      onDisconnect: () => {},
    };
  } else if (activeFeeds.length === 1) {
    return activeFeeds[0].feed;
  } else {
    log.info(
      "Daemon",
      "Using CompositeLiveFeed for multi-market execution..."
    );
    return new CompositeLiveFeed(activeFeeds);
  }
}
