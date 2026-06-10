import express from "express";
import cors from "cors";
import log from "npmlog";
import dotenv from "dotenv";
import path from "path";
import { exec } from "child_process";
// @ts-ignore
import { KiteConnect } from "kiteconnect";
import { prisma } from "@quantomate/db";
import {
  MemoryBroker,
  PaperBroker,
  KiteLiveFeed,
  KiteInstrumentMapper,
  TradierLiveFeed,
  TradierInstrumentMapper,
  CompositeLiveFeed,
  DataService,
} from "@quantomate/data";
import { LiveTradingEngine } from "./liveEngine";
import {
  GoldenCrossStrategy,
  RSIMeanReversionStrategy,
  IndexOptionMomentumStrategy,
  IndexOptionRsiReversionStrategy,
  PivotTrendStrategy,
} from "@quantomate/library";
import { isMarketOpen } from "./utils/market-scheduler";
import { IBroker, Strategy } from "@quantomate/core";
import { SessionManager } from "./sessionManager";

dotenv.config();
// Load workspace root .env with override: true so root values always win over
// any stub/placeholder values in the local packages/trade/.env file.
dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
  override: true,
});

const app = express();
const PORT = process.env.DAEMON_PORT
  ? parseInt(process.env.DAEMON_PORT, 10)
  : 8082;

app.use(cors());
app.use(express.json());

// Set up logger name
log.heading = "TradingDaemon";

// State management
let engine: LiveTradingEngine | null = null;
let currentFeed: any = null;
let currentBroker: IBroker | null = null;
let globalMemoryBroker: MemoryBroker | null = null;
let activeEngineBotsCount = 0;
let isEngineRunning = false;
let lastOpenBotsHash = "";

// Helper: Determine market from symbol name
function getMarketForSymbol(symbol: string): string {
  const sym = symbol.toUpperCase().trim();
  const cryptoAssets = ["BTC", "ETH", "SOL", "ADA", "DOT", "DOGE", "XRP"];
  if (
    cryptoAssets.some(
      (c) =>
        sym.startsWith(c) ||
        sym.endsWith(c) ||
        sym.includes("/USD") ||
        sym.includes("-USD"),
    )
  ) {
    return "crypto";
  }
  if (
    sym.startsWith("NIFTY") ||
    sym.startsWith("BANKNIFTY") ||
    sym.startsWith("^NSE") ||
    sym.endsWith(".NS") ||
    sym.includes("NSEI") ||
    sym.includes("NSEBANK") ||
    sym.startsWith("NSE:") ||
    sym.startsWith("NFO:") ||
    ["SBIN", "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"].includes(sym)
  ) {
    return "india";
  }
  return "us";
}

// Helper: Fetch settings from Database
interface Settings {
  tradingMode: "paper" | "live";
  enabledMarkets: string[];
}

async function getSystemSettings(): Promise<Settings> {
  const settings = await prisma.systemSetting.findMany();
  const modeSetting = settings.find((s) => s.key === "trading_mode");
  const marketsSetting = settings.find((s) => s.key === "enabled_markets");

  return {
    tradingMode: (modeSetting?.value as any) || "paper",
    enabledMarkets: marketsSetting
      ? JSON.parse(marketsSetting.value)
      : ["india"],
  };
}

// Helper: Instantiates strategies with parameters
function instantiateStrategy(
  strategyType: string,
  botName: string,
  symbol: string,
  parameters: any,
  allocationSessionId?: string | null,
): Strategy<any, any, any> {
  const name = `${strategyType}_${symbol}_${botName}`;
  const params = parameters || {};

  let strategy: Strategy<any, any, any>;
  switch (strategyType) {
    case "GoldenCross":
      strategy = new GoldenCrossStrategy(name, {
        fastPeriod: params.fastPeriod ?? 9,
        slowPeriod: params.slowPeriod ?? 20,
      });
      break;
    case "RSIMeanReversion":
      strategy = new RSIMeanReversionStrategy(name, {
        rsiPeriod: params.rsiPeriod ?? 14,
        oversoldThreshold: params.oversoldThreshold ?? 30,
        overboughtThreshold: params.overboughtThreshold ?? 70,
      });
      break;
    case "IndexOptionMomentum":
      strategy = new IndexOptionMomentumStrategy(name, {
        fastPeriod: params.fastPeriod ?? 9,
        slowPeriod: params.slowPeriod ?? 20,
        source: params.source ?? "close",
      });
      break;
    case "IndexOptionRsiReversion":
      strategy = new IndexOptionRsiReversionStrategy(name, {
        rsiPeriod: params.rsiPeriod ?? 14,
        oversoldThreshold: params.oversoldThreshold ?? 30,
        overboughtThreshold: params.overboughtThreshold ?? 70,
        source: params.source ?? "close",
      });
      break;
    case "PivotTrend":
      strategy = new PivotTrendStrategy(name, {
        direction: params.direction ?? "both",
      });
      break;
    case "PivotTrendOption":
      strategy = new PivotTrendStrategy(name, {
        direction: params.direction ?? "both",
      });
      break;
    default:
      throw new Error(`Unsupported strategy type: ${strategyType}`);
  }

  // Configure options routing and criteria
  strategy.options.tradeOptions =
    params.tradeOptions === true || strategyType.includes("Option");
  if (params.optionSelector) {
    strategy.options.optionSelector = params.optionSelector;
  }
  if (allocationSessionId) {
    strategy.options.allocationSessionId = allocationSessionId;
  }

  return strategy;
}

// Stop the active trading engine
async function stopEngine(): Promise<void> {
  isEngineRunning = false;
  activeEngineBotsCount = 0;
  if (engine) {
    try {
      await engine.stop();
      log.info("Daemon", "Trading engine stopped successfully.");
    } catch (err) {
      log.error("Daemon", "Error stopping engine:", err);
    }
    engine = null;
  }
  currentFeed = null;
  currentBroker = null;
}

// Helper: Checks if Indian market is enabled and active, and Zerodha session token is missing. If so, auto-opens the browser.
async function checkAndOpenAuthBrowser(
  settings: Settings,
  activeBotsList: any[],
): Promise<boolean> {
  try {
    // Check if any bot uses NSE / India market symbols
    const hasIndiaMarket = activeBotsList.some(
      (bot) => getMarketForSymbol(bot.symbol) === "india",
    );
    if (!hasIndiaMarket || !settings.enabledMarkets.includes("india")) {
      return false;
    }

    // Check if Zerodha token is valid for today
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
        `Zerodha session token missing or expired. Automatically launching browser at: ${loginUrl}`,
      );

      // Open browser cross-platform
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
            err.message,
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

// Reconciles and starts the engine based on current DB state and market schedules
async function reconcileEngine(): Promise<void> {
  try {
    log.info("Daemon", "Reconciling trading engine...");

    // 1. Fetch config and active bots
    const settings = await getSystemSettings();
    const activeBots = await prisma.tradingBot.findMany({
      where: { active: true },
    });

    // Load sessions in SessionManager
    await SessionManager.getInstance().loadSessions();

    // 2. Filter bots that belong to open & enabled markets
    const openBots = activeBots.filter((bot) => {
      const market = getMarketForSymbol(bot.symbol);
      return settings.enabledMarkets.includes(market) && isMarketOpen(market);
    });

    lastOpenBotsHash = openBots
      .map((b) => `${b.id}:${b.symbol}`)
      .sort()
      .join(",");
    activeEngineBotsCount = openBots.length;

    if (openBots.length === 0) {
      log.info(
        "Daemon",
        "No active bots in open/enabled markets. Stopping engine if running...",
      );
      await stopEngine();
      return;
    }

    log.info(
      "Daemon",
      `Active bots to execute: ${openBots.length} (out of ${activeBots.length} active total)`,
    );

    // 3. Obtain authentication session for Zerodha if India market is open
    const hasIndiaMarket = openBots.some(
      (bot) => getMarketForSymbol(bot.symbol) === "india",
    );
    let session: any = null;

    if (hasIndiaMarket) {
      session = await prisma.tradingSession.findFirst({
        where: { provider: "zerodha" },
        orderBy: { createdAt: "desc" },
      });

      const now = new Date();
      const isAuthenticated = session
        ? now.toDateString() === new Date(session.createdAt).toDateString()
        : false;

      if (!isAuthenticated || !session) {
        log.warn(
          "Daemon",
          "Indian market open but Zerodha session token is missing/expired. Cannot start.",
        );
        await stopEngine();
        await checkAndOpenAuthBrowser(settings, activeBots);
        return;
      }
    }

    // 4. Safely restart engine
    await stopEngine();

    const apiKey = process.env.ZERODHA_API_KEY;
    if (hasIndiaMarket && !apiKey) {
      log.error("Daemon", "ZERODHA_API_KEY is not defined in env.");
      return;
    }

    const hasUSMarket = openBots.some(
      (bot) => getMarketForSymbol(bot.symbol) === "us",
    );
    const tradierApiKey = process.env.TRADIER_API_KEY;

    // 5. Initialize Live Feed (use KiteLiveFeed if India market is present, TradierLiveFeed if US is present, otherwise fallback/mock)
    const activeFeeds: any[] = [];

    if (hasIndiaMarket && apiKey && session) {
      log.info("Daemon", "Initializing Zerodha/Kite Live Feed...");
      const kiteFeed = new KiteLiveFeed(apiKey, session.accessToken);
      activeFeeds.push({
        feed: kiteFeed,
        matches: (sym: string) => getMarketForSymbol(sym) === "india",
      });
      // Warm up instrument mapping cache
      try {
        log.info("Daemon", "Loading Zerodha instrument tokens...");
        await KiteInstrumentMapper.load(apiKey);
      } catch (err) {
        log.error("Daemon", "Failed to load instruments mapper:", err);
      }
    }

    if (hasUSMarket && tradierApiKey) {
      log.info("Daemon", "Initializing Tradier Live Feed for US market...");
      const useSandbox = process.env.TRADIER_ENV !== "production";
      const tradierFeed = new TradierLiveFeed(tradierApiKey, useSandbox);
      activeFeeds.push({
        feed: tradierFeed,
        matches: (sym: string) => getMarketForSymbol(sym) === "us",
      });
    }

    if (activeFeeds.length === 0) {
      // Fallback/Mock feed
      log.info("Daemon", "No active feeds open. Using fallback/mock feed.");
      currentFeed = {
        connect: async () => log.info("Feed", "Mock connected"),
        disconnect: async () => log.info("Feed", "Mock disconnected"),
        subscribe: (syms: string[], cb: any) =>
          log.info("Feed", `Mock subscribed to: ${syms.join(", ")}`),
        unsubscribe: () => {},
        onDisconnect: () => {},
      };
    } else if (activeFeeds.length === 1) {
      currentFeed = activeFeeds[0].feed;
    } else {
      log.info(
        "Daemon",
        "Using CompositeLiveFeed for multi-market execution...",
      );
      currentFeed = new CompositeLiveFeed(activeFeeds);
    }

    // 6. Get Broker Instance
    if (settings.tradingMode === "paper") {
      if (!globalMemoryBroker) {
        globalMemoryBroker = new MemoryBroker("Paper-Zerodha-Account", 100000);
      }
      currentBroker = globalMemoryBroker;
    } else {
      currentBroker = new PaperBroker("Live-Zerodha-Account", 100000);
    }

    // 7. Instantiate strategies
    const symbols = Array.from(
      new Set(openBots.map((b) => b.symbol.toUpperCase())),
    );
    const strategies = openBots.map((bot) => {
      return instantiateStrategy(
        bot.strategy,
        bot.name,
        bot.symbol,
        bot.parameters,
        bot.allocationSessionId,
      );
    });

    // 8. Create LiveTradingEngine
    engine = new LiveTradingEngine(currentFeed, currentBroker, {
      symbols,
      strategies,
      interval: "5m", // default interval for indicators
      startDate: new Date().toISOString(),
      resolveOptionSymbol: async (
        underlying,
        optionType,
        underlyingPrice,
        selector,
      ) => {
        const market = getMarketForSymbol(underlying);
        if (market === "india") {
          const opt = KiteInstrumentMapper.findATMOption(
            underlying,
            optionType,
            underlyingPrice,
            selector,
          );
          return opt?.tradingsymbol;
        } else if (market === "us" && tradierApiKey) {
          const useSandbox = process.env.TRADIER_ENV !== "production";
          const opt = await TradierInstrumentMapper.findATMOption(
            underlying,
            optionType,
            underlyingPrice,
            tradierApiKey,
            useSandbox,
            selector,
          );
          return opt?.symbol;
        }
        return undefined;
      },
    });

    await engine.start();
    isEngineRunning = true;
    activeEngineBotsCount = openBots.length;
    log.info("Daemon", "LiveTradingEngine started successfully.");
  } catch (error) {
    log.error("Daemon", "Error starting live trading engine:", error);
    await stopEngine();
  }
}

// Scheduled check loop (runs every 60 seconds)
setInterval(async () => {
  try {
    const settings = await getSystemSettings();
    const activeBots = await prisma.tradingBot.findMany({
      where: { active: true },
    });

    const currentlyOpenBots = activeBots.filter((bot) => {
      const market = getMarketForSymbol(bot.symbol);
      return settings.enabledMarkets.includes(market) && isMarketOpen(market);
    });

    const openBotsHash = currentlyOpenBots
      .map((b) => `${b.id}:${b.symbol}`)
      .sort()
      .join(",");

    if (openBotsHash !== lastOpenBotsHash) {
      log.info(
        "Scheduler",
        "Market schedules or bot states changed. Re-reconciling...",
      );
      lastOpenBotsHash = openBotsHash;
      await reconcileEngine();
    }
  } catch (err) {
    log.error("Scheduler", "Failed checking market schedule:", err);
  }
}, 60000);

async function init() {
  try {
    const defaultSettings = [
      { key: "trading_mode", value: "paper" },
      { key: "enabled_markets", value: JSON.stringify(["india", "us"]) },
    ];

    for (const s of defaultSettings) {
      const existing = await prisma.systemSetting.findUnique({
        where: { key: s.key },
      });
      if (!existing) {
        await prisma.systemSetting.create({ data: s });
        log.info("Daemon", `Seeded setting: ${s.key} = ${s.value}`);
      } else if (s.key === "enabled_markets") {
        const currentMarkets = JSON.parse(existing.value) as string[];
        if (!currentMarkets.includes("us")) {
          currentMarkets.push("us");
          await prisma.systemSetting.update({
            where: { key: s.key },
            data: { value: JSON.stringify(currentMarkets) },
          });
          log.info(
            "Daemon",
            `Updated setting enabled_markets to include 'us': ${JSON.stringify(
              currentMarkets,
            )}`,
          );
        }
      }
    }

    // Seed default allocation sessions
    const defaultSessions = [
      {
        name: "India Options Session",
        capital: 200000,
        virtualCash: 200000,
        maxDrawdownPct: 10,
        enabledMarkets: ["india"],
        provider: "paper",
        active: true,
      },
      {
        name: "US Equities Session",
        capital: 5000,
        virtualCash: 5000,
        maxDrawdownPct: 10,
        enabledMarkets: ["us"],
        provider: "paper",
        active: true,
      },
    ];

    for (const ds of defaultSessions) {
      const existing = await prisma.allocationSession.findUnique({
        where: { name: ds.name },
      });
      if (!existing) {
        await prisma.allocationSession.create({
          data: {
            ...ds,
            enabledMarkets: JSON.stringify(ds.enabledMarkets),
          },
        });
        log.info("Daemon", `Seeded default allocation session: ${ds.name}`);
      }
    }

    // Perform initial reconcile
    await reconcileEngine();
  } catch (err) {
    log.error("Daemon", "Error initializing database seeds:", err);
  }
}

// API Endpoints
app.get("/status", async (req, res) => {
  try {
    const settings = await getSystemSettings();
    const openMarkets = Object.keys(isMarketOpen).filter((k) =>
      isMarketOpen(k),
    );

    let account: any = null;
    let positions: any[] = [];
    let orders: any[] = [];

    if (currentBroker) {
      account = await currentBroker.getAccountInfo();
      positions = await currentBroker.getPositions();
      orders = await currentBroker.getOrders();
    } else if (globalMemoryBroker) {
      account = await globalMemoryBroker.getAccountInfo();
      positions = await globalMemoryBroker.getPositions();
      orders = await globalMemoryBroker.getOrders();
    }

    res.json({
      success: true,
      running: isEngineRunning,
      activeBots: activeEngineBotsCount,
      settings,
      account,
      positions,
      orders,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/reconcile", async (req, res) => {
  try {
    await reconcileEngine();
    res.json({ success: true, message: "Reconciliation complete." });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/stop", async (req, res) => {
  try {
    log.info("Daemon", "Received /stop request. Shutting down daemon...");
    await stopEngine();
    res.json({ success: true, message: "Daemon shutting down." });
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/positions/exit", async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res
        .status(400)
        .json({ success: false, message: "Missing symbol" });
    }

    log.info("Daemon", `Manual position exit requested for symbol: ${symbol}`);

    const broker = currentBroker || globalMemoryBroker;
    if (!broker) {
      return res
        .status(400)
        .json({ success: false, message: "No broker running" });
    }

    const positions = await broker.getPositions();
    const pos = positions.find(
      (p) => p.symbol.toUpperCase() === symbol.toUpperCase(),
    );
    if (!pos || pos.qty === 0) {
      return res
        .status(400)
        .json({ success: false, message: `No active position for ${symbol}` });
    }

    await broker.placeOrder({
      symbol: pos.symbol,
      qty: Math.abs(pos.qty),
      side: pos.qty > 0 ? "sell" : "buy",
      type: "market",
    });

    res.json({
      success: true,
      message: `Market exit order placed for ${symbol}.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/panic-exit", async (req, res) => {
  try {
    log.warn(
      "Daemon",
      "Panic exit initiated! Closing all open positions and canceling pending orders...",
    );

    const broker = currentBroker || globalMemoryBroker;
    if (!broker) {
      return res
        .status(400)
        .json({ success: false, message: "No broker running" });
    }

    const positions = await broker.getPositions();
    let closedCount = 0;

    for (const pos of positions) {
      if (pos.qty !== 0) {
        await broker.placeOrder({
          symbol: pos.symbol,
          qty: Math.abs(pos.qty),
          side: pos.qty > 0 ? "sell" : "buy",
          type: "market",
        });
        closedCount++;
      }
    }

    const pendingOrders = await broker.getOrders("pending");
    for (const ord of pendingOrders) {
      await broker.cancelOrder(ord.id);
    }

    log.info(
      "Daemon",
      `Panic Exit completed. Closed ${closedCount} positions.`,
    );
    res.json({
      success: true,
      message: `Panic Exit completed. Closed ${closedCount} positions.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/auth/zerodha/login", (req, res) => {
  const apiKey = process.env.ZERODHA_API_KEY;
  if (!apiKey) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; padding: 2rem; background: #fef2f2;">
          <h1 style="color: #991b1b;">Configuration Error</h1>
          <p>Please edit the ZERODHA_API_KEY in your local <code>.env</code> file at the project root first.</p>
        </body>
      </html>
    `);
  }
  const loginUrl = `https://kite.trade/connect/login?api_key=${apiKey}&v=3`;
  res.redirect(loginUrl);
});

app.get("/auth/zerodha/callback", async (req, res) => {
  try {
    const requestToken = req.query.request_token as string;
    const apiKey = process.env.ZERODHA_API_KEY;
    const apiSecret = process.env.ZERODHA_API_SECRET;

    if (!requestToken) {
      return res.status(400).send("Missing request_token parameter.");
    }
    if (!apiKey || !apiSecret) {
      return res
        .status(400)
        .send("API Key or API Secret is not properly configured in .env.");
    }

    log.info(
      "Auth",
      `Callback received. Exchanging request token: ${requestToken}...`,
    );

    const kc = new KiteConnect({ api_key: apiKey });
    const session = await kc.generateSession(requestToken, apiSecret);

    log.info("Auth", "Token exchange successful! Storing session to DB...");

    await prisma.tradingSession.create({
      data: {
        provider: "zerodha",
        accessToken: session.access_token,
        publicToken: session.public_token || "",
      },
    });

    res.send(`
      <html>
        <head>
          <title>Broker Authentication Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: #f8fafc;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              text-align: center;
              max-width: 420px;
              border-top: 4px solid #16a34a;
            }
            h1 { color: #16a34a; font-size: 1.5rem; margin-top: 0; margin-bottom: 0.75rem; }
            p { color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; }
            .badge {
              display: inline-block;
              background: #dcfce7;
              color: #15803d;
              font-weight: bold;
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              font-size: 0.8rem;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Broker Connected Successfully!</h1>
            <p>Your Zerodha session has been initialized. The background trading daemon has automatically re-reconciled and started running.</p>
            <span class="badge">Session Active</span>
          </div>
        </body>
      </html>
    `);

    // Asynchronously trigger reconcile to boot the engine now that session exists
    setTimeout(async () => {
      try {
        await reconcileEngine();
      } catch (err: any) {
        log.error(
          "Auth",
          "Failed reconciling engine after callback login:",
          err.message,
        );
      }
    }, 1000);
  } catch (err: any) {
    log.error("Auth", "Failed token callback exchange:", err.message);
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; padding: 2rem; background: #fef2f2;">
          <h1 style="color: #991b1b;">Authentication Failed</h1>
          <p>${err.message}</p>
          <p>Please check your API key, secret, and try again.</p>
        </body>
      </html>
    `);
  }
});

// Start listening only on 127.0.0.1
app.listen(PORT, "127.0.0.1", async () => {
  log.info(
    "Daemon",
    `Trading Daemon server running on http://127.0.0.1:${PORT}`,
  );
  await init();
});
