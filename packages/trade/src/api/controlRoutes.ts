import { Router } from 'express';
import log from 'npmlog';
import { prisma } from '@quantomate/db';
import { daemonState, reconcileEngine, stopEngine } from '../daemon/orchestrator';

const router = Router();

router.post("/reconcile", async (req, res) => {
  log.info("API", "Manual reconcile triggered via HTTP POST.");
  try {
    await reconcileEngine();
    res.json({ success: true, message: "Engine reconciliation executed." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/cleanup", async (req, res) => {
  const { symbols } = req.body;
  if (!symbols || !Array.isArray(symbols)) {
    return res.status(400).json({ success: false, message: "Invalid symbols list." });
  }

  const parsedSymbols = Array.from(
    new Set(
      symbols
        .flatMap((s: string) => (typeof s === "string" ? s.split(",").map((sub) => sub.trim().toUpperCase()) : []))
        .filter(Boolean)
    )
  );

  log.info("API", `Cleanup triggered for symbols: ${parsedSymbols.join(", ")}`);

  const broker = daemonState.currentBroker || daemonState.globalMemoryBroker;
  if (broker && typeof broker.cleanupSymbols === "function") {
    await broker.cleanupSymbols(parsedSymbols);
  }

  const { SessionManager } = await import('../session/SessionManager');
  SessionManager.getInstance().cleanupVirtualPositions(parsedSymbols);

  res.json({ success: true, message: "Cleaned symbols in broker and session manager." });
});

router.post("/reset", async (req, res) => {
  log.info("API", "Control center reset triggered.");
  
  const broker = daemonState.currentBroker || daemonState.globalMemoryBroker;
  if (broker && typeof broker.reset === "function") {
    await broker.reset();
  }

  const { SessionManager } = await import('../session/SessionManager');
  const sessions = await prisma.allocationSession.findMany();
  for (const s of sessions) {
    await prisma.allocationSession.update({
      where: { id: s.id },
      data: { virtualCash: s.capital }
    });
    SessionManager.getInstance().clearSessionState(s.id);
  }
  await SessionManager.getInstance().loadSessions();

  res.json({ success: true, message: "Control center states reset completed." });
});

router.post("/stop", async (req, res) => {
  log.info("API", "Trading engine stop triggered.");
  try {
    await stopEngine();
    res.json({ success: true, message: "Engine stopped." });
    setTimeout(() => process.exit(0), 1000);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export const controlRoutes = router;
