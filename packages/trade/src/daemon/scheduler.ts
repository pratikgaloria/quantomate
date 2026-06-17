import log from 'npmlog';
import { prisma } from '@quantomate/db';
import { isMarketOpen, getMarketForSymbol } from '../utils/market';
import { daemonState } from './daemonState';
import { getSystemSettings } from './engineControl';
import { reconcileEngine } from './reconciler';

export function startScheduler(): void {
  setInterval(async () => {
    try {
      const settings = await getSystemSettings();
      const activeBots = await prisma.tradingBot.findMany({
        where: { active: true },
        include: { customStrategy: true }
      });

      const currentlyOpenBots = activeBots.filter((bot) => {
        const market = getMarketForSymbol(bot.symbol);
        return settings.enabledMarkets.includes(market) && isMarketOpen(market);
      });

      const openBotsHash = currentlyOpenBots
        .map((b) => `${b.id}:${b.symbol}`)
        .sort()
        .join(",");

      const shouldBeRunning = currentlyOpenBots.length > 0;
      const isEngineRunning = daemonState.engine ? daemonState.engine.running : false;

      if (openBotsHash !== daemonState.lastOpenBotsHash || (shouldBeRunning && !isEngineRunning)) {
        log.info(
          "Scheduler",
          `Market schedules, bot states, or engine status changed (engine running: ${isEngineRunning}). Re-reconciling...`
        );
        daemonState.lastOpenBotsHash = openBotsHash;
        await reconcileEngine();
      }
    } catch (err) {
      log.error("Scheduler", "Failed checking market schedule:", err);
    }
  }, 60000);
}
