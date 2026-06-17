import log from 'npmlog';
import { prisma } from '@quantomate/db';
import { reconcileEngine } from './reconciler';

export async function init(): Promise<void> {
  try {
    const defaultSettings = [
      { key: "trading_mode", value: "paper" },
      { key: "enabled_markets", value: JSON.stringify(["india", "us"]) },
      { key: "candle_interval", value: "1m" },
      { key: "execution_mode", value: "candle_close" },
    ];

    for (const s of defaultSettings) {
      const existing = await prisma.systemSetting.findUnique({ where: { key: s.key } });
      if (!existing) {
        await prisma.systemSetting.create({ data: s });
        log.info("Daemon", `Seeded setting: ${s.key} = ${s.value}`);
      } else if (s.key === "enabled_markets") {
        const currentMarkets = JSON.parse(existing.value) as string[];
        if (!currentMarkets.includes("us")) {
          currentMarkets.push("us");
          await prisma.systemSetting.update({ where: { key: s.key }, data: { value: JSON.stringify(currentMarkets) } });
          log.info("Daemon", `Updated setting enabled_markets to include 'us': ${JSON.stringify(currentMarkets)}`);
        }
      }
    }

    const defaultSessions = [
      { name: "India Options Session", capital: 200000, virtualCash: 200000, maxDrawdownPct: 10, enabledMarkets: ["india"], provider: "paper", active: true },
      { name: "US Equities Session", capital: 5000, virtualCash: 5000, maxDrawdownPct: 10, enabledMarkets: ["us"], provider: "paper", active: true },
    ];

    for (const ds of defaultSessions) {
      const existing = await prisma.allocationSession.findUnique({ where: { name: ds.name } });
      if (!existing) {
        await prisma.allocationSession.create({ data: { ...ds, enabledMarkets: JSON.stringify(ds.enabledMarkets) } });
        log.info("Daemon", `Seeded default allocation session: ${ds.name}`);
      }
    }

    await reconcileEngine();
  } catch (err) {
    log.error("Daemon", "Error initializing database seeds:", err);
  }
}
