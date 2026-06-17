import { Router } from 'express';
import log from 'npmlog';
import { daemonState } from '../daemon/orchestrator';

const router = Router();

router.get("/status", async (req, res) => {
  const isRunning = daemonState.engine ? daemonState.engine.running : false;
  
  let accountInfo: any = null;
  let openPositions: any[] = [];
  let openOrders: any[] = [];

  if (daemonState.currentBroker) {
    try {
      accountInfo = await daemonState.currentBroker.getAccountInfo();
      openPositions = await daemonState.currentBroker.getPositions();
      openOrders = await daemonState.currentBroker.getOrders();
    } catch (err: any) {
      log.warn("Daemon", `Failed getting broker status: ${err.message}`);
    }
  }

  const activePrices: Record<string, number> = {};
  if (daemonState.currentBroker && 'lastPrices' in (daemonState.currentBroker as any)) {
    for (const [sym, price] of (daemonState.currentBroker as any).lastPrices.entries()) {
      activePrices[sym] = price;
    }
  }

  res.json({
    running: isRunning,
    activeBots: daemonState.activeEngineBotsCount,
    account: accountInfo,
    positions: openPositions,
    orders: openOrders,
    prices: activePrices
  });
});

export const statusRoute = router;
