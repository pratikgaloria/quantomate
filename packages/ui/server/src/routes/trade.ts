import { Router, Request, Response } from 'express';
import { prisma } from '@quantomate/db';
import { DataService } from '@quantomate/data';

const router = Router();
const DAEMON_PORT = process.env.DAEMON_PORT ? parseInt(process.env.DAEMON_PORT, 10) : 8082;
const DAEMON_URL = `http://127.0.0.1:${DAEMON_PORT}`;

// Helper: Make HTTP request to the daemon
async function fetchFromDaemon(path: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 2000); // 2-second timeout

  try {
    const response = await fetch(`${DAEMON_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// GET /api/trade/status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const daemonStatus = await fetchFromDaemon('/status');
    
    // Check Zerodha session in DB for UI status
    const session = await prisma.tradingSession.findFirst({
      where: { provider: 'zerodha' },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const isAuthenticated = session
      ? now.toDateString() === new Date(session.createdAt).toDateString()
      : false;

    res.json({
      success: true,
      zerodha: {
        authenticated: isAuthenticated,
        authenticatedAt: session?.createdAt || null,
      },
      engine: {
        running: daemonStatus.running,
        activeBots: daemonStatus.activeBots,
      },
      account: daemonStatus.account,
    });
  } catch (error: any) {
    // Daemon is offline
    res.json({
      success: true,
      zerodha: {
        authenticated: false,
        authenticatedAt: null,
      },
      engine: {
        running: false,
        activeBots: 0,
        offline: true,
      },
      account: null,
    });
  }
});

// GET /api/trade/positions
router.get('/positions', async (req: Request, res: Response) => {
  try {
    const daemonStatus = await fetchFromDaemon('/status');
    res.json({ success: true, data: daemonStatus.positions || [] });
  } catch (error) {
    res.json({ success: true, data: [], offline: true });
  }
});

// GET /api/trade/orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const daemonStatus = await fetchFromDaemon('/status');
    res.json({ success: true, data: daemonStatus.orders || [] });
  } catch (error) {
    res.json({ success: true, data: [], offline: true });
  }
});

// GET /api/trade/prices
router.get('/prices', async (req: Request, res: Response) => {
  const prices: Record<string, number | null> = {
    'NIFTY 50': null,
    'NIFTY BANK': null,
  };

  // 1. Try querying daemon for latest broker price map
  try {
    const daemonStatus = await fetchFromDaemon('/status');
    const priceMap = daemonStatus.prices || {};
    if (priceMap['NIFTY 50'] !== undefined) prices['NIFTY 50'] = priceMap['NIFTY 50'];
    if (priceMap['NIFTY BANK'] !== undefined) prices['NIFTY BANK'] = priceMap['NIFTY BANK'];
  } catch (error) {
    // Daemon offline
  }

  // 2. Fallback to Yahoo Finance quotes
  if (prices['NIFTY 50'] === null || prices['NIFTY BANK'] === null) {
    try {
      const quotes = await DataService.provider.getQuotes(['^NSEI', '^NSEBANK']);
      const niftyQuote = quotes.get('^NSEI');
      const bankNiftyQuote = quotes.get('^NSEBANK');

      if (prices['NIFTY 50'] === null && niftyQuote) {
        prices['NIFTY 50'] = niftyQuote.regularMarketPrice ?? null;
      }
      if (prices['NIFTY BANK'] === null && bankNiftyQuote) {
        prices['NIFTY BANK'] = bankNiftyQuote.regularMarketPrice ?? null;
      }
    } catch (err: any) {
      console.warn(`[TradeRoutes] Failed index quotes fallback: ${err.message}`);
    }
  }

  res.json({ success: true, data: prices });
});

// GET /api/trade/bots
router.get('/bots', async (req: Request, res: Response) => {
  try {
    const bots = await prisma.tradingBot.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: bots });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/bots/toggle
router.post('/bots/toggle', async (req: Request, res: Response) => {
  try {
    const { id, active } = req.body;
    if (!id || typeof active !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Missing required fields: id or active' });
    }

    const updated = await prisma.tradingBot.update({
      where: { id },
      data: { active },
    });

    // Notify daemon
    try {
      await fetchFromDaemon('/reconcile', 'POST');
    } catch (err) {
      // Ignore notification error if daemon is not running
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/bots - Create a bot
router.post('/bots', async (req: Request, res: Response) => {
  try {
    const { name, strategy, symbol, parameters, active } = req.body;
    if (!name || !strategy || !symbol) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, strategy, symbol' });
    }

    const created = await prisma.tradingBot.create({
      data: {
        name,
        strategy,
        symbol,
        parameters: parameters || {},
        active: active ?? false,
      },
    });

    // Notify daemon
    try {
      await fetchFromDaemon('/reconcile', 'POST');
    } catch (err) {
      // Ignore
    }

    res.json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trade/bots/:id - Update a bot
router.put('/bots/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, strategy, symbol, parameters, active } = req.body;

    const updated = await prisma.tradingBot.update({
      where: { id },
      data: {
        name,
        strategy,
        symbol,
        parameters,
        active,
      },
    });

    // Notify daemon
    try {
      await fetchFromDaemon('/reconcile', 'POST');
    } catch (err) {
      // Ignore
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/trade/bots/:id - Delete a bot
router.delete('/bots/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.tradingBot.delete({
      where: { id },
    });

    // Notify daemon
    try {
      await fetchFromDaemon('/reconcile', 'POST');
    } catch (err) {
      // Ignore
    }

    res.json({ success: true, data: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/positions/exit
router.post('/positions/exit', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Missing symbol' });
    }

    const result = await fetchFromDaemon('/positions/exit', 'POST', { symbol });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: `Failed to contact daemon: ${error.message}` });
  }
});

// POST /api/trade/panic-exit
router.post('/panic-exit', async (req: Request, res: Response) => {
  try {
    const result = await fetchFromDaemon('/panic-exit', 'POST');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: `Failed to contact daemon: ${error.message}` });
  }
});

// GET /api/trade/settings
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    const mode = settings.find((s: any) => s.key === 'trading_mode')?.value || 'paper';
    const markets = JSON.parse(settings.find((s: any) => s.key === 'enabled_markets')?.value || '["india"]');

    res.json({
      success: true,
      data: {
        tradingMode: mode,
        enabledMarkets: markets,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/settings
router.post('/settings', async (req: Request, res: Response) => {
  try {
    const { tradingMode, enabledMarkets } = req.body;

    if (tradingMode) {
      await prisma.systemSetting.upsert({
        where: { key: 'trading_mode' },
        update: { value: tradingMode },
        create: { key: 'trading_mode', value: tradingMode },
      });
    }

    if (enabledMarkets) {
      await prisma.systemSetting.upsert({
        where: { key: 'enabled_markets' },
        update: { value: JSON.stringify(enabledMarkets) },
        create: { key: 'enabled_markets', value: JSON.stringify(enabledMarkets) },
      });
    }

    // Reconcile daemon
    try {
      await fetchFromDaemon('/reconcile', 'POST');
    } catch (err) {
      // Ignore if daemon is offline
    }

    res.json({ success: true, message: 'Settings saved and daemon notified.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
