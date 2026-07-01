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

    // Create fixed accounts: India (Zerodha/INR) and US (Tradier/USD)
    const fixedAccounts = [
      { name: "India", capital: 100000, virtualCash: 100000, maxDrawdownPct: 10, enabledMarkets: ["india"], provider: "zerodha", active: true },
      { name: "US", capital: 100000, virtualCash: 100000, maxDrawdownPct: 10, enabledMarkets: ["us"], provider: "tradier", active: true },
    ];

    for (const acct of fixedAccounts) {
      const existing = await prisma.allocationSession.findUnique({ where: { name: acct.name } });
      if (!existing) {
        await prisma.allocationSession.create({ data: { ...acct, enabledMarkets: JSON.stringify(acct.enabledMarkets) } });
        log.info("Daemon", `Seeded fixed account: ${acct.name}`);
      }
    }

    const indiaAccount = await prisma.allocationSession.findUnique({ where: { name: "India" } });
    const usAccount = await prisma.allocationSession.findUnique({ where: { name: "US" } });

    // Clean up any other allocation session that is not named "India" or "US"
    const allSessions = await prisma.allocationSession.findMany();
    for (const session of allSessions) {
      if (session.name !== "India" && session.name !== "US") {
        const markets = Array.isArray(session.enabledMarkets)
          ? session.enabledMarkets
          : (typeof session.enabledMarkets === 'string' ? JSON.parse(session.enabledMarkets) : []);
        const isIndia = markets.includes("india") || session.provider === "zerodha" || session.name.toLowerCase().includes("india");
        const targetAccount = isIndia ? indiaAccount : usAccount;

        if (targetAccount) {
          // Reassign any bots to the correct fixed account
          await prisma.tradingBot.updateMany({
            where: { allocationSessionId: session.id },
            data: { allocationSessionId: targetAccount.id }
          });
          log.info("Daemon", `Reassigned bots from legacy session '${session.name}' to fixed account '${targetAccount.name}'`);
        }

        await prisma.allocationSession.delete({ where: { id: session.id } });
        log.info("Daemon", `Removed legacy allocation session: ${session.name}`);
      }
    }

    await reconcileEngine();
  } catch (err) {
    log.error("Daemon", "Error initializing database seeds:", err);
  }
}
