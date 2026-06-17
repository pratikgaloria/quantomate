import log from 'npmlog';
import { prisma } from '@quantomate/db';
import { MemoryBroker } from '../brokers/MemoryBroker';
import { PaperBroker } from '../brokers/PaperBroker';
import { LiveTradingEngine } from '../engine/LiveTradingEngine';
import { SessionManager } from '../session/SessionManager';
import { isMarketOpen, getMarketForSymbol } from '../utils/market';
import { daemonState } from './daemonState';
import { initializeFeed } from './feedInitializer';
import { resolveOptionSymbol } from './optionResolver';
import { mapBotsConfig } from './botMapper';
import { getSystemSettings, stopEngine } from './engineControl';
import { checkZerodhaAuth } from './authChecker';

export async function reconcileEngine(): Promise<void> {
  try {
    log.info("Daemon", "Reconciling trading engine...");
    const settings = await getSystemSettings();
    const activeBots = await prisma.tradingBot.findMany({
      where: { active: true },
      include: { customStrategy: true }
    });

    await SessionManager.getInstance().loadSessions();

    const openBots = activeBots.filter((bot) => {
      const market = getMarketForSymbol(bot.symbol);
      return settings.enabledMarkets.includes(market) && isMarketOpen(market);
    });

    daemonState.lastOpenBotsHash = openBots.map((b) => `${b.id}:${b.symbol}`).sort().join(",");
    daemonState.activeEngineBotsCount = openBots.length;

    if (openBots.length === 0) {
      log.info("Daemon", "No active bots in open/enabled markets. Stopping engine if running...");
      await stopEngine();
      return;
    }

    let session: any = null;
    try {
      session = await checkZerodhaAuth(openBots, settings, activeBots);
    } catch (err: any) {
      if (err.message === "AUTH_EXPIRED") return;
      throw err;
    }

    await stopEngine();

    const hasIndiaMarket = openBots.some((bot) => getMarketForSymbol(bot.symbol) === "india");
    const apiKey = process.env.ZERODHA_API_KEY;
    if (hasIndiaMarket && !apiKey) {
      log.error("Daemon", "ZERODHA_API_KEY is not defined in env.");
      return;
    }

    const hasUSMarket = openBots.some((bot) => getMarketForSymbol(bot.symbol) === "us");
    const tradierApiKey = process.env.TRADIER_API_KEY;

    daemonState.currentFeed = await initializeFeed(hasIndiaMarket, hasUSMarket, apiKey, session, tradierApiKey);

    if (settings.tradingMode === "paper") {
      if (!daemonState.globalMemoryBroker) {
        daemonState.globalMemoryBroker = new MemoryBroker("Paper-Zerodha-Account", 100000);
      }
      daemonState.currentBroker = daemonState.globalMemoryBroker;
    } else {
      daemonState.currentBroker = new PaperBroker("Live-Zerodha-Account", 100000);
    }

    const bots = mapBotsConfig(openBots, settings.candleInterval);

    daemonState.engine = new LiveTradingEngine(daemonState.currentFeed, daemonState.currentBroker as any, {
      bots,
      interval: settings.candleInterval,
      executionMode: settings.executionMode,
      startDate: new Date().toISOString(),
      kiteApiKey: apiKey || undefined,
      kiteAccessToken: session?.accessToken || undefined,
      tradierAccessToken: tradierApiKey || undefined,
      tradierUseSandbox: process.env.TRADIER_ENV !== "production",
      resolveOptionSymbol: (underlying, optionType, price, selector) =>
        resolveOptionSymbol(underlying, optionType, price, selector, tradierApiKey)
    });

    await daemonState.engine.start();
    daemonState.isEngineRunning = true;
    daemonState.activeEngineBotsCount = openBots.length;
    log.info("Daemon", "LiveTradingEngine started successfully.");
  } catch (error) {
    log.error("Daemon", "Error starting live trading engine:", error);
    await stopEngine();
  }
}
