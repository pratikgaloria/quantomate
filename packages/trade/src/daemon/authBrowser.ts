import log from 'npmlog';
import { exec } from 'child_process';
import { prisma } from '@quantomate/db';
import { getMarketForSymbol } from '../utils/market';
import { Settings, PORT } from './daemonState';

export async function checkAndOpenAuthBrowser(
  settings: Settings,
  activeBotsList: any[]
): Promise<boolean> {
  try {
    const hasIndiaMarket = activeBotsList.some(
      (bot) => getMarketForSymbol(bot.symbol) === "india"
    );
    if (!hasIndiaMarket || !settings.enabledMarkets.includes("india")) {
      return false;
    }

    const session = await prisma.tradingSession.findFirst({
      where: { provider: "zerodha" },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const isAuthenticated = session
      ? now.toDateString() === new Date(session.createdAt).toDateString()
      : false;

    if (!isAuthenticated) {
      const loginUrl = `http://127.0.0.1:${PORT}/auth/zerodha/login`;
      log.warn(
        "Daemon",
        `Zerodha session token missing or expired. Automatically launching browser at: ${loginUrl}`
      );

      const start =
        process.platform === "darwin"
          ? "open"
          : process.platform === "win32"
            ? "start"
            : "xdg-open";
      exec(`${start} ${loginUrl}`, (err) => {
        if (err) {
          log.error(
            "Daemon",
            "Failed to open browser automatically:",
            err.message
          );
        }
      });
      return true;
    }
  } catch (err: any) {
    log.error("Daemon", "Error checking session auto-auth:", err.message);
  }
  return false;
}
