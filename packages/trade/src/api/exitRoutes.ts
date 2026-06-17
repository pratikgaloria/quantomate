import { Router } from 'express';
import log from 'npmlog';
import { daemonState, stopEngine } from '../daemon/orchestrator';

const router = Router();

router.post("/positions/exit", async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ success: false, message: "Missing symbol parameters." });
  }

  log.info("API", `Manual position exit triggered for symbol: ${symbol}`);
  const broker = daemonState.currentBroker || daemonState.globalMemoryBroker;
  if (!broker) {
    return res.status(400).json({ success: false, message: "No active broker configured." });
  }

  try {
    const positions = await broker.getPositions();
    const pos = positions.find(p => p.symbol.toUpperCase() === symbol.toUpperCase());
    if (!pos || pos.qty === 0) {
      return res.json({ success: true, message: "No open position to exit." });
    }

    const side = pos.qty > 0 ? "sell" : "buy";
    await broker.placeOrder({
      symbol: pos.symbol,
      qty: Math.abs(pos.qty),
      side,
      type: "market"
    });

    res.json({ success: true, message: `Market exit order placed for ${symbol}.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/panic-exit", async (req, res) => {
  log.warn("API", "PANIC EXIT TRIGGERED! Closing all open positions...");
  const broker = daemonState.currentBroker || daemonState.globalMemoryBroker;
  if (!broker) {
    return res.status(400).json({ success: false, message: "No active broker." });
  }

  try {
    const orders = await broker.getOrders('pending');
    for (const ord of orders) {
      await broker.cancelOrder(ord.id);
    }

    const positions = await broker.getPositions();
    for (const pos of positions) {
      if (pos.qty !== 0) {
        const side = pos.qty > 0 ? 'sell' : 'buy';
        await broker.placeOrder({
          symbol: pos.symbol,
          qty: Math.abs(pos.qty),
          side,
          type: 'market'
        });
      }
    }

    await stopEngine();
    res.json({ success: true, message: "Panic exit execution completed. Engine stopped." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export const exitRoutes = router;
