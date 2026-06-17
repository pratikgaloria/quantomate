import log from 'npmlog';
import { prisma } from '@quantomate/db';
import { getMarketForSymbol } from '../utils/market';
import { stopEngine } from './engineControl';
import { checkAndOpenAuthBrowser } from './authBrowser';
import { Settings } from './daemonState';

export async function checkZerodhaAuth(
  openBots: any[],
  settings: Settings,
  activeBots: any[]
): Promise<any | null> {
  const hasIndiaMarket = openBots.some((bot) => getMarketForSymbol(bot.symbol) === "india");
  if (!hasIndiaMarket) return null;

  const session = await prisma.tradingSession.findFirst({
    where: { provider: "zerodha" },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const isAuthenticated = session ? now.toDateString() === new Date(session.createdAt).toDateString() : false;

  if (!isAuthenticated || !session) {
    log.warn("Daemon", "Indian market open but Zerodha session token is missing/expired. Cannot start.");
    await stopEngine();
    await checkAndOpenAuthBrowser(settings, activeBots);
    throw new Error("AUTH_EXPIRED");
  }

  return session;
}
