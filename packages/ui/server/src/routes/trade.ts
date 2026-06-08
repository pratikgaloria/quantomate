import { Router, Request, Response } from 'express';
import { prisma } from '@quantomate/db';
import { DataService } from '@quantomate/data';
import dotenv from 'dotenv';
import path from 'path';

// Load environment configurations
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const router = Router();

// Helper to determine market from symbol name
function getMarketForSymbol(symbol: string): string {
  const sym = symbol.toUpperCase().trim();
  const cryptoAssets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'DOGE', 'XRP'];
  if (cryptoAssets.some(c => sym.startsWith(c) || sym.endsWith(c) || sym.includes('/USD') || sym.includes('-USD'))) {
    return 'crypto';
  }
  if (sym.startsWith('NIFTY') || sym.startsWith('BANKNIFTY') || ['SBIN', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'].includes(sym)) {
    return 'india';
  }
  return 'us';
}

// Helper to map symbol to Yahoo ticker symbol
function mapSymbolToYahooTicker(symbol: string): string {
  const sym = symbol.toUpperCase().trim();
  if (sym === 'NIFTY 50' || sym === 'NSEI' || sym === 'NIFTY') {
    return '^NSEI';
  }
  if (sym === 'NIFTY BANK' || sym === 'NSEBANK' || sym === 'BANKNIFTY') {
    return '^NSEBANK';
  }
  const market = getMarketForSymbol(sym);
  if (market === 'crypto') {
    return sym.replace('/', '-');
  }
  if (market === 'india') {
    return `${sym}.NS`;
  }
  return sym;
}
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
  const isTradierAuthenticated = !!process.env.TRADIER_API_KEY && process.env.TRADIER_API_KEY !== 'DUMMY';

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
      tradier: {
        authenticated: isTradierAuthenticated,
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
      tradier: {
        authenticated: isTradierAuthenticated,
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
  const prices: Record<string, number | null> = {};

  try {
    // 1. Get unique symbols from bots
    const bots = await prisma.tradingBot.findMany({
      select: { symbol: true }
    });
    const symbols = Array.from(new Set(bots.map(b => b.symbol)));

    if (symbols.length === 0) {
      return res.json({ success: true, data: {} });
    }

    for (const sym of symbols) {
      prices[sym] = null;
    }

    // 2. Try querying daemon for latest broker price map
    let daemonStatus: any = null;
    try {
      daemonStatus = await fetchFromDaemon('/status');
      const priceMap = daemonStatus.prices || {};
      for (const sym of symbols) {
        if (priceMap[sym] !== undefined) {
          prices[sym] = priceMap[sym];
        }
      }
    } catch (error) {
      // Daemon offline
    }

    // 3. Fallback to Yahoo Finance quotes for any null prices
    const missingSymbols = symbols.filter(sym => prices[sym] === null);
    if (missingSymbols.length > 0) {
      const symbolToTicker = new Map<string, string>();
      const tickers: string[] = [];

      for (const sym of missingSymbols) {
        const ticker = mapSymbolToYahooTicker(sym);
        symbolToTicker.set(sym, ticker);
        tickers.push(ticker);
      }

      const quotes = await DataService.provider.getQuotes(tickers);

      for (const sym of missingSymbols) {
        const ticker = symbolToTicker.get(sym);
        if (ticker) {
          const quote = quotes.get(ticker);
          if (quote) {
            prices[sym] = quote.regularMarketPrice ?? null;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn(`[TradeRoutes] Failed to fetch bot prices: ${err.message}`);
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
    const { name, strategy, symbol, parameters, active, allocationSessionId } = req.body;
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
        allocationSessionId: allocationSessionId || null,
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
    const { name, strategy, symbol, parameters, active, allocationSessionId } = req.body;

    const updated = await prisma.tradingBot.update({
      where: { id },
      data: {
        name,
        strategy,
        symbol,
        parameters,
        active,
        allocationSessionId: allocationSessionId || null,
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

// GET /api/trade/sessions
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.allocationSession.findMany({
      include: { bots: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/sessions
router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const { name, capital, maxDrawdownPct, enabledMarkets, provider, active } = req.body;
    if (!name || capital === undefined || !provider) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, capital, provider' });
    }

    const session = await prisma.allocationSession.create({
      data: {
        name,
        capital: parseFloat(capital),
        virtualCash: parseFloat(capital),
        maxDrawdownPct: maxDrawdownPct ? parseFloat(maxDrawdownPct) : 10.0,
        enabledMarkets: enabledMarkets || [],
        provider,
        active: active ?? true,
      },
    });

    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trade/sessions/:id
router.put('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, capital, maxDrawdownPct, enabledMarkets, provider, active } = req.body;

    const existing = await prisma.allocationSession.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const newCapital = capital !== undefined ? parseFloat(capital) : existing.capital;
    const deltaCapital = newCapital - existing.capital;

    const session = await prisma.allocationSession.update({
      where: { id },
      data: {
        name,
        capital: newCapital,
        virtualCash: existing.virtualCash + deltaCapital,
        maxDrawdownPct: maxDrawdownPct !== undefined ? parseFloat(maxDrawdownPct) : existing.maxDrawdownPct,
        enabledMarkets: enabledMarkets || existing.enabledMarkets,
        provider: provider || existing.provider,
        active: active !== undefined ? active : existing.active,
      },
    });

    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/trade/sessions/:id
router.delete('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.allocationSession.delete({
      where: { id },
    });

    res.json({ success: true, data: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
