import log from 'npmlog';
import { prisma } from '@quantomate/db';
import { daemonState, Settings } from './daemonState';

export async function getSystemSettings(): Promise<Settings> {
  const settings = await prisma.systemSetting.findMany();
  const modeSetting = settings.find((s) => s.key === "trading_mode");
  const marketsSetting = settings.find((s) => s.key === "enabled_markets");
  const intervalSetting = settings.find((s) => s.key === "candle_interval");
  const execModeSetting = settings.find((s) => s.key === "execution_mode");

  return {
    tradingMode: (modeSetting?.value as any) || "paper",
    enabledMarkets: marketsSetting ? JSON.parse(marketsSetting.value) : ["india"],
    candleInterval: intervalSetting?.value || "1m",
    executionMode: (execModeSetting?.value as any) || "candle_close",
  };
}

export async function stopEngine(): Promise<void> {
  daemonState.isEngineRunning = false;
  daemonState.activeEngineBotsCount = 0;
  if (daemonState.engine) {
    try {
      await daemonState.engine.stop();
      log.info("Daemon", "Trading engine stopped successfully.");
    } catch (err) {
      log.error("Daemon", "Error stopping engine:", err);
    }
    daemonState.engine = null;
  }
  daemonState.currentFeed = null;
  daemonState.currentBroker = null;
}
