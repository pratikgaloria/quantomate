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

    const openBots = activeBots.filter(b => settings.enabledMarkets.includes(getMarketForSymbol(b.symbol)) && isMarketOpen(getMarketForSymbol(b.symbol)));

    daemonState.lastOpenBotsHash = openBots.map((b) => `${b.id}:${b.symbol}`).sort().join(",");
    daemonState.activeEngineBotsCount = openBots.length;

    if (openBots.length === 0) {
      log.info("Daemon", "No active bots in open/enabled markets. Stopping engine if running...");
      await stopEngine();
      return;
    }

    let session: any = null;
    try { session = await checkZerodhaAuth(openBots, settings, activeBots); }
    catch (err: any) { if (err.message === "AUTH_EXPIRED") return; throw err; }

    await stopEngine();

    const hasIndiaMarket = openBots.some(b => getMarketForSymbol(b.symbol) === "india");
    const apiKey = process.env.ZERODHA_API_KEY;
    if (hasIndiaMarket && !apiKey) return log.error("Daemon", "ZERODHA_API_KEY is not defined in env.");

    const hasUSMarket = openBots.some((bot) => getMarketForSymbol(bot.symbol) === "us");
    const tradierApiKey = process.env.TRADIER_API_KEY;

    daemonState.currentFeed = await initializeFeed(hasIndiaMarket, hasUSMarket, apiKey, session, tradierApiKey);

    const sessions = await prisma.allocationSession.findMany({ where: { active: true } });
    const totalCap = sessions.reduce((sum, s) => sum + s.capital, 0);
    const brokerBalance = Math.max(100000, totalCap);

    if (settings.tradingMode === "paper") {
      daemonState.currentBroker = new PaperBroker("Paper-Zerodha-Account", brokerBalance, 20, false);
    } else {
      daemonState.currentBroker = new PaperBroker("Live-Zerodha-Account", brokerBalance, 20, true);
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
      resolveOptionSymbol: (und, type, price, sel) => resolveOptionSymbol(und, type, price, sel, tradierApiKey)
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
