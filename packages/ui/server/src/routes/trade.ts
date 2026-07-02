import { Router, Request, Response } from "express";
import { prisma } from "@quantomate/db";
import { DataService, KiteInstrumentMapper, TradierDataProvider, YahooFinanceProvider, KiteDataProvider, RoutingDataProvider } from "@quantomate/data";
import dotenv from "dotenv";
import path from "path";
import { fetchPriceData } from "../services/priceDataService";
import { 
  Bar, 
  BarSeries
} from "@quantomate/core";
import {
  SMA, 
  EMA, 
  RSI, 
  BB, 
  MACD, 
  MACDSignal, 
  ATR, 
  VWAP, 
  AVWAP,
  RVOL, 
  Slope, 
  PivotTrend,
  ChandelierExit,
  WeeklyAVWAP,
  WMA,
  DEMA,
  TEMA,
  CCI,
  Stochastic,
  WilliamsR,
  ROC,
  MOM
} from "@quantomate/library";



// Load environment configurations
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../../../../.env"), override: true });

const router = Router();

// Router-level middleware to configure DataService.provider to use Zerodha/Tradier live providers for all /api/trade requests
router.use(async (req, res, next) => {
  try {
    const session = await prisma.tradingSession.findFirst({
      where: { provider: "zerodha" },
      orderBy: { createdAt: "desc" },
    });

    const kiteKey = process.env.ZERODHA_API_KEY || '';
    const kiteToken = session?.accessToken || '';
    
    const tradierToken = process.env.TRADIER_API_KEY || '';
    const useSandbox = process.env.TRADIER_ENV !== 'production';

    const kiteProvider = new KiteDataProvider(kiteKey, kiteToken);
    const tradierProvider = new TradierDataProvider(tradierToken, useSandbox);

    DataService.provider = new RoutingDataProvider({
      kite: kiteProvider,
      tradier: tradierProvider
    });
  } catch (error) {
    console.error("[TradeRoutes] Failed to initialize live RoutingDataProvider:", error);
  }
  next();
});

const DAEMON_PORT = process.env.DAEMON_PORT
  ? parseInt(process.env.DAEMON_PORT, 10)
  : 8082;
const DAEMON_URL = `http://127.0.0.1:${DAEMON_PORT}`;

// Helper: Make HTTP request to the daemon
async function fetchFromDaemon(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: any,
): Promise<any> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 2000); // 2-second timeout

  try {
    const response = await fetch(`${DAEMON_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
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

// GET /api/trade/search-symbols
router.get("/search-symbols", async (req: Request, res: Response) => {
  try {
    const { market, query } = req.query;
    if (!query || typeof query !== "string") {
      return res.json({ success: true, data: [] });
    }
    const q = query.trim();
    if (q.length === 0) {
      return res.json({ success: true, data: [] });
    }

    if (market === "india") {
      const list = KiteInstrumentMapper.getCachedList();
      const queryUpper = q.toUpperCase();
      
      const matches: any[] = [];
      const seen = new Set<string>();

      // 1. Add major indices manually
      const indices = [
        { symbol: 'NIFTY', name: 'Nifty 50 Index' },
        { symbol: 'BANKNIFTY', name: 'Nifty Bank Index' },
        { symbol: '^NSEI', name: 'Nifty 50 Index (Yahoo)' },
        { symbol: '^NSEBANK', name: 'Nifty Bank Index (Yahoo)' }
      ];
      for (const idx of indices) {
        if (idx.symbol.includes(queryUpper) || idx.name.toUpperCase().includes(queryUpper)) {
          matches.push({ ...idx, exchange: 'NSE', market: 'india' });
          seen.add(idx.symbol);
        }
      }

      // 2. Filter from cached instruments
      for (const item of list) {
        if (matches.length >= 30) break;
        
        const isNseEq = item.exchange === 'NSE' && item.instrument_type === 'EQ';
        const isNfo = item.exchange === 'NFO';
        
        if (isNseEq) {
          const symbol = item.tradingsymbol;
          if (!seen.has(symbol)) {
            const name = item.name || '';
            if (symbol.toUpperCase().includes(queryUpper) || name.toUpperCase().includes(queryUpper)) {
              matches.push({
                symbol,
                name: name || symbol,
                exchange: 'NSE',
                market: 'india'
              });
              seen.add(symbol);
            }
          }
        } else if (isNfo) {
          const symbol = item.name;
          if (symbol && !seen.has(symbol)) {
            if (symbol.toUpperCase().includes(queryUpper)) {
              matches.push({
                symbol,
                name: `${symbol} (Derivatives)`,
                exchange: 'NFO',
                market: 'india'
              });
              seen.add(symbol);
            }
          }
        }
      }

      return res.json({ success: true, data: matches });
    } else if (market === "us" || market === "yf") {
      let rawResults: any[] = [];
      const token = process.env.TRADIER_API_KEY;
      if (token && market !== "yf") {
        const useSandbox = process.env.TRADIER_ENV !== "production";
        const provider = new TradierDataProvider(token, useSandbox);
        rawResults = await provider.search(q);
      } else {
        const provider = new YahooFinanceProvider();
        rawResults = await provider.search(q);
      }
      const matches = (rawResults || []).map((item: any) => ({
        symbol: item.symbol,
        name: item.shortname || item.longname || item.name || item.symbol,
        exchange: item.exchange || (market === 'yf' ? 'YF' : 'US'),
        market: market
      }));
      return res.json({ success: true, data: matches });
    }

    return res.json({ success: true, data: [] });
  } catch (error: any) {
    console.error("[SearchSymbols] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/trade/status
router.get("/status", async (req: Request, res: Response) => {
  const isTradierAuthenticated = !!process.env.TRADIER_API_KEY;

  try {
    const daemonStatus = await fetchFromDaemon("/status");

    // Check Zerodha session in DB for UI status
    const session = await prisma.tradingSession.findFirst({
      where: { provider: "zerodha" },
      orderBy: { createdAt: "desc" },
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
router.get("/positions", async (req: Request, res: Response) => {
  try {
    const modeSetting = await prisma.systemSetting.findUnique({ where: { key: "trading_mode" } });
    const isLive = modeSetting?.value === "live";
    const accountName = isLive ? "Live-Zerodha-Account" : "Paper-Zerodha-Account";

    const account = await prisma.tradingAccount.findFirst({
      where: { name: accountName, isLive }
    });

    if (!account) {
      return res.json({ success: true, data: [] });
    }

    const dbPositions = await prisma.tradingPosition.findMany({ where: { accountId: account.id } });
    
    let latestPrices: Record<string, number> = {};
    try {
      const daemonStatus = await fetchFromDaemon("/status");
      latestPrices = daemonStatus.prices || {};
    } catch (e) {
      // Daemon offline
    }

    const positions = dbPositions.map(pos => {
      const currentPrice = latestPrices[pos.symbol] || pos.marketPrice || pos.entryPrice;
      return {
        symbol: pos.symbol,
        qty: pos.qty,
        avgEntryPrice: pos.entryPrice,
        marketPrice: currentPrice,
        unrealizedPL: (currentPrice - pos.entryPrice) * pos.qty,
        costBasis: pos.entryPrice * pos.qty
      };
    });

    res.json({ success: true, data: positions });
  } catch (error) {
    res.json({ success: true, data: [], offline: true });
  }
});

// GET /api/trade/orders
router.get("/orders", async (req: Request, res: Response) => {
  try {
    const modeSetting = await prisma.systemSetting.findUnique({ where: { key: "trading_mode" } });
    const isLive = modeSetting?.value === "live";
    const accountName = isLive ? "Live-Zerodha-Account" : "Paper-Zerodha-Account";

    const account = await prisma.tradingAccount.findFirst({
      where: { name: accountName, isLive }
    });

    if (!account) {
      return res.json({ success: true, data: [] });
    }

    const dbOrders = await prisma.tradingOrder.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' }
    });

    const orders = dbOrders.map(ord => ({
      id: ord.id,
      clientOrderId: ord.id,
      status: ord.status,
      filledQty: ord.qty,
      avgFillPrice: ord.filledPrice || undefined,
      filledAt: ord.updatedAt,
      commissionPaid: ord.commission,
      symbol: ord.symbol,
      side: ord.side
    }));

    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: true, data: [], offline: true });
  }
});

// GET /api/trade/prices
router.get("/prices", async (req: Request, res: Response) => {
  const prices: Record<string, number | null> = {};

  try {
    // 1. Get unique symbols from bots
    const bots = await prisma.tradingBot.findMany({
      select: { symbol: true },
    });
    const symbols = Array.from(new Set(bots.map((b) => b.symbol)));

    if (symbols.length === 0) {
      return res.json({ success: true, data: {} });
    }

    for (const sym of symbols) {
      prices[sym] = null;
    }

    // 2. Try querying daemon for latest broker price map
    let daemonStatus: any = null;
    try {
      daemonStatus = await fetchFromDaemon("/status");
      const priceMap = daemonStatus.prices || {};
      for (const sym of symbols) {
        if (priceMap[sym] !== undefined) {
          prices[sym] = priceMap[sym];
        }
      }
    } catch (error) {
      // Daemon offline
    }

    // 3. Fallback to live provider quotes for any null prices
    const missingSymbols = symbols.filter((sym) => prices[sym] === null);
    if (missingSymbols.length > 0) {
      const quotes = await DataService.provider.getQuotes(missingSymbols);

      for (const sym of missingSymbols) {
        const quote = quotes.get(sym.toUpperCase().trim());
        if (quote) {
          prices[sym] = quote.regularMarketPrice ?? null;
        }
      }
    }
  } catch (err: any) {
    console.warn(`[TradeRoutes] Failed to fetch bot prices: ${err.message}`);
  }

  res.json({ success: true, data: prices });
});

// GET /api/trade/bots
router.get("/bots", async (req: Request, res: Response) => {
  try {
    const bots = await prisma.tradingBot.findMany({
      orderBy: { createdAt: "asc" },
      include: { customStrategy: true }
    });
    res.json({ success: true, data: bots });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/bots/toggle
router.post("/bots/toggle", async (req: Request, res: Response) => {
  try {
    const { id, active } = req.body;
    if (!id || typeof active !== "boolean") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields: id or active",
        });
    }

    const updated = await prisma.tradingBot.update({
      where: { id },
      data: { active },
    });

    // Notify daemon
    try {
      await fetchFromDaemon("/reconcile", "POST");
    } catch (err) {
      // Ignore notification error if daemon is not running
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/bots - Create a bot
router.post("/bots", async (req: Request, res: Response) => {
  try {
    const { name, customStrategyId, symbol, active, allocationSessionId } =
      req.body;
    if (!name || !customStrategyId || !symbol) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields: name, customStrategyId, symbol",
        });
    }

    const customStrategy = await prisma.customStrategy.findUnique({
      where: { id: customStrategyId }
    });

    if (!customStrategy) {
      return res.status(404).json({
        success: false,
        message: "Custom strategy not found"
      });
    }

    const created = await prisma.tradingBot.create({
      data: {
        name,
        strategy: customStrategy.name,
        customStrategyId,
        symbol,
        parameters: customStrategy.parameters || {},
        active: active ?? false,
        allocationSessionId: allocationSessionId || null,
      },
    });

    // Notify daemon
    try {
      await fetchFromDaemon("/reconcile", "POST");
    } catch (err) {
      // Ignore
    }

    res.json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trade/bots/:id - Update a bot
router.put("/bots/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, customStrategyId, symbol, active, allocationSessionId } =
      req.body;

    if (!name || !customStrategyId || !symbol) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields: name, customStrategyId, symbol",
        });
    }

    const customStrategy = await prisma.customStrategy.findUnique({
      where: { id: customStrategyId }
    });

    if (!customStrategy) {
      return res.status(404).json({
        success: false,
        message: "Custom strategy not found"
      });
    }

    const updated = await prisma.tradingBot.update({
      where: { id },
      data: {
        name,
        strategy: customStrategy.name,
        customStrategyId,
        symbol,
        parameters: customStrategy.parameters || {},
        active,
        allocationSessionId: allocationSessionId || null,
      },
    });

    // Notify daemon
    try {
      await fetchFromDaemon("/reconcile", "POST");
    } catch (err) {
      // Ignore
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/trade/bots/:id - Delete a bot
router.delete("/bots/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bot = await prisma.tradingBot.findUnique({
      where: { id },
      select: { symbol: true },
    });

    const deleted = await prisma.tradingBot.delete({
      where: { id },
    });

    if (bot) {
      // Clean up orders/positions for this bot's symbol
      try {
        await fetchFromDaemon("/cleanup", "POST", { symbols: [bot.symbol] });
      } catch (err) {
        // Ignore
      }
    }

    // Notify daemon
    try {
      await fetchFromDaemon("/reconcile", "POST");
    } catch (err) {
      // Ignore
    }

    res.json({ success: true, data: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/bots/:id/clear - Clear previous positions/orders for a bot from db
router.post("/bots/:id/clear", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bot = await prisma.tradingBot.findUnique({
      where: { id },
    });
    if (!bot) {
      return res.status(404).json({ success: false, message: "Bot not found" });
    }

    const modeSetting = await prisma.systemSetting.findUnique({ where: { key: "trading_mode" } });
    const isLive = modeSetting?.value === "live";
    const accountName = isLive ? "Live-Zerodha-Account" : "Paper-Zerodha-Account";

    const account = await prisma.tradingAccount.findFirst({
      where: { name: accountName, isLive }
    });

    if (account) {
      await prisma.tradingPosition.deleteMany({
        where: { accountId: account.id, symbol: bot.symbol }
      });
      await prisma.tradingOrder.deleteMany({
        where: { accountId: account.id, symbol: bot.symbol }
      });
      try {
        await fetchFromDaemon("/cleanup", "POST", { symbols: [bot.symbol] });
      } catch (err) {
        // Ignore
      }
    }

    res.json({ success: true, message: `Cleared positions and orders for symbol ${bot.symbol}` });
  } catch (error: any) {
    console.error("[ClearBotState] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/positions/exit
router.post("/positions/exit", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res
        .status(400)
        .json({ success: false, message: "Missing symbol" });
    }

    const result = await fetchFromDaemon("/positions/exit", "POST", { symbol });
    res.json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to contact daemon: ${error.message}`,
      });
  }
});

// POST /api/trade/panic-exit
router.post("/panic-exit", async (req: Request, res: Response) => {
  try {
    const result = await fetchFromDaemon("/panic-exit", "POST");
    res.json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to contact daemon: ${error.message}`,
      });
  }
});

// GET /api/trade/settings
router.get("/settings", async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    const mode =
      settings.find((s: any) => s.key === "trading_mode")?.value || "paper";
    const markets = JSON.parse(
      settings.find((s: any) => s.key === "enabled_markets")?.value ||
        '["india"]',
    );

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
router.post("/settings", async (req: Request, res: Response) => {
  try {
    const { tradingMode, enabledMarkets } = req.body;

    if (tradingMode) {
      await prisma.systemSetting.upsert({
        where: { key: "trading_mode" },
        update: { value: tradingMode },
        create: { key: "trading_mode", value: tradingMode },
      });
    }

    if (enabledMarkets) {
      await prisma.systemSetting.upsert({
        where: { key: "enabled_markets" },
        update: { value: JSON.stringify(enabledMarkets) },
        create: {
          key: "enabled_markets",
          value: JSON.stringify(enabledMarkets),
        },
      });
    }

    // Reconcile daemon
    try {
      await fetchFromDaemon("/reconcile", "POST");
    } catch (err) {
      // Ignore if daemon is offline
    }

    res.json({ success: true, message: "Settings saved and daemon notified." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/trade/sessions (now called "accounts")
router.get("/sessions", async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.allocationSession.findMany({
      include: { bots: true },
      orderBy: { createdAt: "asc" },
    });
    // Enrich with currency field based on market
    const enriched = sessions.map((s: any) => {
      const markets = Array.isArray(s.enabledMarkets)
        ? s.enabledMarkets
        : (typeof s.enabledMarkets === 'string' ? JSON.parse(s.enabledMarkets) : []);
      const market = markets[0] || 'us';
      return { ...s, enabledMarkets: markets, currency: market === 'india' ? 'INR' : 'USD' };
    });
    res.json({ success: true, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/sessions — disabled (accounts are fixed)
router.post("/sessions", async (req: Request, res: Response) => {
  res.status(403).json({ success: false, message: "Account creation is disabled. Use the fixed India and US accounts." });
});

// PUT /api/trade/sessions/:id
router.put("/sessions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, capital, maxDrawdownPct, enabledMarkets, provider, active } =
      req.body;

    if (enabledMarkets !== undefined) {
      if (!enabledMarkets || !Array.isArray(enabledMarkets) || enabledMarkets.length !== 1 || !["india", "us"].includes(enabledMarkets[0])) {
        return res.status(400).json({
          success: false,
          message: "Exactly one enabled market (india or us) must be selected.",
        });
      }
    }

    const existing = await prisma.allocationSession.findUnique({
      where: { id },
    });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const newCapital =
      capital !== undefined ? parseFloat(capital) : existing.capital;
    const deltaCapital = newCapital - existing.capital;

    const session = await prisma.allocationSession.update({
      where: { id },
      data: {
        name,
        capital: newCapital,
        virtualCash: existing.virtualCash + deltaCapital,
        maxDrawdownPct:
          maxDrawdownPct !== undefined
            ? parseFloat(maxDrawdownPct)
            : existing.maxDrawdownPct,
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

// DELETE /api/trade/sessions/:id — disabled (accounts are fixed)
router.delete("/sessions/:id", async (req: Request, res: Response) => {
  res.status(403).json({ success: false, message: "Account deletion is disabled. India and US accounts are fixed." });
});

// POST /api/trade/reset
router.post("/reset", async (req: Request, res: Response) => {
  try {
    const result = await fetchFromDaemon("/reset", "POST");
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: `Failed to reset control center: ${error.message}` });
  }
});

// GET /api/trade/historical-prices
router.get("/historical-prices", async (req: Request, res: Response) => {
  try {
    const { symbol, period, interval } = req.query;
    if (!symbol || typeof symbol !== "string") {
      return res.status(400).json({ success: false, message: "Missing required query parameter: symbol" });
    }

    const p = (period as string) || "1y";
    const intv = (interval as string) || "1d";

    const { data } = await fetchPriceData({
      symbol,
      period: p,
      interval: intv,
    });

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("[HistoricalPrices] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/trade/calculate-indicators
function getIntervalDuration(interval: string): number {
  const num = parseInt(interval, 10);
  if (interval.endsWith("m")) return num * 60 * 1000;
  if (interval.endsWith("h")) return num * 60 * 60 * 1000;
  if (interval.endsWith("d")) return num * 24 * 60 * 60 * 1000;
  if (interval.endsWith("wk")) return 7 * 24 * 60 * 60 * 1000;
  if (interval.endsWith("mo")) return 30 * 24 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
}

function alignHTFValuesToLTF(
  htfSeries: BarSeries,
  htfValues: number[],
  ltfSeries: BarSeries,
  timeframe: string
): number[] {
  const result: number[] = [];
  const htfDuration = getIntervalDuration(timeframe);

  let htfIdx = 0;
  for (let i = 0; i < ltfSeries.length; i++) {
    const ltfBar = ltfSeries.at(i);
    if (!ltfBar) {
      result.push(NaN);
      continue;
    }
    const ltfTime = ltfBar.timestamp;

    while (htfIdx + 1 < htfSeries.length) {
      const nextBar = htfSeries.at(htfIdx + 1);
      if (nextBar && (nextBar.timestamp + htfDuration) <= ltfTime) {
        htfIdx++;
      } else {
        break;
      }
    }

    const currentBar = htfSeries.at(htfIdx);
    if (currentBar && (currentBar.timestamp + htfDuration) <= ltfTime) {
      result.push(htfValues[htfIdx]);
    } else {
      result.push(NaN);
    }
  }
  return result;
}

async function fetchHTFSeries(symbol: string, period: string, timeframe: string): Promise<BarSeries> {
  const p = period || "1y";
  const intv = timeframe || "1d";
  const now = new Date();
  const startDate = new Date();

  if (p === "1d") {
    startDate.setDate(now.getDate() - 1);
  } else if (p === "1w") {
    startDate.setDate(now.getDate() - 7);
  } else if (p === "1m") {
    startDate.setMonth(now.getMonth() - 1);
  } else if (p === "1y") {
    startDate.setFullYear(now.getFullYear() - 1);
  } else if (p === "3y") {
    startDate.setFullYear(now.getFullYear() - 3);
  } else {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  const yahooProvider = new YahooFinanceProvider();
  const rawQuotes = await DataService.getHistoricalData(symbol, undefined, intv, yahooProvider);

  const bars: Bar[] = rawQuotes.map((q: any) => ({
    open: q.open,
    high: q.high,
    low: q.low,
    close: q.close,
    volume: q.volume,
    timestamp: new Date(q.date).getTime(),
  }));
  return new BarSeries(bars);
}

router.post("/calculate-indicators", async (req: Request, res: Response) => {
  try {
    const { symbol, period, quotes, indicators } = req.body;
    if (!quotes || !Array.isArray(quotes)) {
      return res.status(400).json({ success: false, message: "Missing or invalid parameter: quotes" });
    }
    if (!indicators || !Array.isArray(indicators)) {
      return res.status(400).json({ success: false, message: "Missing or invalid parameter: indicators" });
    }

    const bars: Bar[] = quotes.map((q: any) => ({
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      volume: q.volume,
      timestamp: new Date(q.date).getTime(),
    }));
    const series = new BarSeries(bars);

    // Determine the main interval to check if timeframe parameter requires HTF lookup
    // Default to '1d' if not easily determined
    const sampleDuration = quotes.length >= 2 ? (new Date(quotes[1].date).getTime() - new Date(quotes[0].date).getTime()) : 0;
    let mainInterval = "1d";
    if (sampleDuration > 0) {
      if (sampleDuration <= 60 * 1000) mainInterval = "1m";
      else if (sampleDuration <= 5 * 60 * 1000) mainInterval = "5m";
      else if (sampleDuration <= 15 * 60 * 1000) mainInterval = "15m";
      else if (sampleDuration <= 60 * 60 * 1000) mainInterval = "1h";
    }

    const results: Record<string, number[]> = {};
    const htfCache: Record<string, BarSeries> = {};

    for (const indConfig of indicators) {
      const { id, type, params, timeframe } = indConfig;

      let calcSeries = series;
      const isHTF = timeframe && timeframe !== mainInterval;

      if (isHTF) {
        if (!symbol) {
          return res.status(400).json({ success: false, message: `Missing required parameter symbol for MTF calculation on indicator ${id}` });
        }
        if (!htfCache[timeframe]) {
          htfCache[timeframe] = await fetchHTFSeries(symbol, period, timeframe);
        }
        calcSeries = htfCache[timeframe];
      }

      // Skip processing if there is no data in calcSeries (prevent crash)
      if (calcSeries.length === 0) {
        if (type === "MACD") {
          results[id] = new Array(series.length).fill(NaN);
          results[id + "_signal"] = new Array(series.length).fill(NaN);
          results[id + "_hist"] = new Array(series.length).fill(NaN);
        } else if (type === "BB") {
          results[id + "_upper"] = new Array(series.length).fill(NaN);
          results[id + "_middle"] = new Array(series.length).fill(NaN);
          results[id + "_lower"] = new Array(series.length).fill(NaN);
        } else if (type === "Stochastic") {
          results[id + "_k"] = new Array(series.length).fill(NaN);
          results[id + "_d"] = new Array(series.length).fill(NaN);
        } else {
          results[id] = new Array(series.length).fill(NaN);
        }
        continue;
      }

      if (type === "MACD") {
        const field = params.attribute || "close";
        const fastPeriod = params.fastPeriod || 12;
        const slowPeriod = params.slowPeriod || 26;
        const signalPeriod = params.signalPeriod || 9;

        const macdSeries = new MACD(id, { fastPeriod, slowPeriod, field }).calculate(calcSeries);
        const signalSeries = new MACDSignal(id + "_signal", { fastPeriod, slowPeriod, signalPeriod, field }).calculate(calcSeries);

        let macdValues: number[] = [];
        let signalValues: number[] = [];
        let histValues: number[] = [];

        for (let i = 0; i < calcSeries.length; i++) {
          const macdVal = macdSeries.at(i) ?? NaN;
          const sigVal = signalSeries.at(i) ?? NaN;
          macdValues.push(macdVal);
          signalValues.push(sigVal);
          histValues.push(isNaN(macdVal) || isNaN(sigVal) ? NaN : macdVal - sigVal);
        }

        if (isHTF) {
          macdValues = alignHTFValuesToLTF(calcSeries, macdValues, series, timeframe);
          signalValues = alignHTFValuesToLTF(calcSeries, signalValues, series, timeframe);
          histValues = alignHTFValuesToLTF(calcSeries, histValues, series, timeframe);
        }

        results[id] = macdValues;
        results[id + "_signal"] = signalValues;
        results[id + "_hist"] = histValues;
      } else if (type === "BB") {
        const periodVal = params.period || 20;
        const multiplier = params.multiplier || 2.0;
        const field = params.attribute || "close";

        const upperSeries = new BB(id + "_upper", { period: periodVal, multiplier, band: "upper", field }).calculate(calcSeries);
        const middleSeries = new BB(id + "_middle", { period: periodVal, multiplier, band: "middle", field }).calculate(calcSeries);
        const lowerSeries = new BB(id + "_lower", { period: periodVal, multiplier, band: "lower", field }).calculate(calcSeries);

        let upperValues: number[] = [];
        let middleValues: number[] = [];
        let lowerValues: number[] = [];

        for (let i = 0; i < calcSeries.length; i++) {
          upperValues.push(upperSeries.at(i) ?? NaN);
          middleValues.push(middleSeries.at(i) ?? NaN);
          lowerValues.push(lowerSeries.at(i) ?? NaN);
        }

        if (isHTF) {
          upperValues = alignHTFValuesToLTF(calcSeries, upperValues, series, timeframe);
          middleValues = alignHTFValuesToLTF(calcSeries, middleValues, series, timeframe);
          lowerValues = alignHTFValuesToLTF(calcSeries, lowerValues, series, timeframe);
        }

        results[id + "_upper"] = upperValues;
        results[id + "_middle"] = middleValues;
        results[id + "_lower"] = lowerValues;
      } else if (type === "Stochastic") {
        const kPeriod = params.kPeriod || 14;
        const dPeriod = params.dPeriod || 3;
        const stochSeries = new Stochastic(id, { kPeriod, dPeriod }).calculate(calcSeries);

        let kValues: number[] = [];
        let dValues: number[] = [];
        for (let i = 0; i < calcSeries.length; i++) {
          const val = stochSeries.at(i);
          kValues.push(val?.k ?? NaN);
          dValues.push(val?.d ?? NaN);
        }

        if (isHTF) {
          kValues = alignHTFValuesToLTF(calcSeries, kValues, series, timeframe);
          dValues = alignHTFValuesToLTF(calcSeries, dValues, series, timeframe);
        }

        results[id + "_k"] = kValues;
        results[id + "_d"] = dValues;
      } else {
        let indicatorInstance: any = null;
        const field = params.attribute || "close";

        if (type === "SMA") {
          indicatorInstance = new SMA(id, { period: params.period, field });
        } else if (type === "EMA") {
          indicatorInstance = new EMA(id, { period: params.period, field });
        } else if (type === "WMA") {
          indicatorInstance = new WMA(id, { period: params.period, field });
        } else if (type === "DEMA") {
          indicatorInstance = new DEMA(id, { period: params.period, field });
        } else if (type === "TEMA") {
          indicatorInstance = new TEMA(id, { period: params.period, field });
        } else if (type === "RSI") {
          indicatorInstance = new RSI(id, { period: params.period, field });
        } else if (type === "ATR") {
          indicatorInstance = new ATR(id, { period: params.period });
        } else if (type === "CCI") {
          indicatorInstance = new CCI(id, { period: params.period });
        } else if (type === "WilliamsR") {
          indicatorInstance = new WilliamsR(id, { period: params.period });
        } else if (type === "ROC") {
          indicatorInstance = new ROC(id, { period: params.period, field });
        } else if (type === "MOM") {
          indicatorInstance = new MOM(id, { period: params.period, field });
        } else if (type === "VWAP") {
          indicatorInstance = new VWAP(id, { field });
        } else if (type === "AVWAP") {
          indicatorInstance = new AVWAP(id, { anchorIndex: params.anchorIndex ?? 0, field });
        } else if (type === "RVOL") {
          indicatorInstance = new RVOL(id, { period: params.period });
        } else if (type === "Slope") {
          indicatorInstance = new Slope(id, { period: params.period, field });
        } else if (type === "PivotTrend") {
          indicatorInstance = new PivotTrend(id);
        } else if (type === "ChandelierExit") {
          indicatorInstance = new ChandelierExit(id, { period: params.period, multiplier: params.multiplier, line: params.line });
        } else if (type === "WeeklyAVWAP") {
          indicatorInstance = new WeeklyAVWAP(id);
        } else {
          return res.status(400).json({ success: false, message: `Indicator type ${type} is not supported in core` });
        }

        const calculatedSeries = indicatorInstance.calculate(calcSeries);
        let values: number[] = [];
        for (let i = 0; i < calcSeries.length; i++) {
          values.push(calculatedSeries.at(i) ?? NaN);
        }

        if (isHTF) {
          values = alignHTFValuesToLTF(calcSeries, values, series, timeframe);
        }
        results[id] = values;
      }
    }

    res.json({ success: true, data: { indicators: results } });
  } catch (error: any) {
    console.error("[CalculateIndicators] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

