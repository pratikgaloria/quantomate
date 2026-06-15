# 🤖 Quantomate MCP Server — Detailed Plan

> **Model Context Protocol (MCP)** is an open standard by Anthropic that lets AI assistants (Claude, Cursor, Gemini, etc.) connect to external tools and data sources through a structured server interface. An MCP server exposes **tools**, **resources**, and **prompts** that any compliant AI client can invoke.

---

## 📌 Overview

Quantomate is a feature-rich algorithmic trading framework with:
- A **backtesting engine** (`@quantomate/core`)
- A **rich indicator library** (`@quantomate/library` — SMA, EMA, RSI, MACD, BB, ATR, CCI, Stochastic, VWAP, AVWAP, Pivot Trend, WilliamsR, DEMA, TEMA, ROC, MOM, RVOL, Slope…)
- A **strategy library** (Golden Cross, RSI Mean Reversion, Bollinger Bands, MACD, Pivot Trend, Index Option Momentum/RSI…)
- A **data layer** (`@quantomate/data`) with multi-provider support (Yahoo Finance, Kite/Zerodha, Tradier) and a Prisma-backed DB cache
- A **live trading daemon** (`@quantomate/trade`) with paper/live broker support, session & position management, panic exit, and multi-market scheduling
- A **portfolio signal service** that scans symbols across all active strategies and caches results

Exposing Quantomate as an MCP server would allow any LLM-powered tool (Claude Desktop, Cursor, VS Code Copilot extensions, custom agents) to directly query market data, run backtests, manage bots, and receive trade signals — all through natural language.

---

## 🗂 Proposed Package Structure

```
packages/
  mcp/                          ← New package: @quantomate/mcp
    src/
      index.ts                  ← MCP server entry point
      tools/
        market-data.ts          ← Market data tools
        indicators.ts           ← Indicator computation tools
        backtest.ts             ← Backtest tools
        signals.ts              ← Portfolio signal scan tools
        bots.ts                 ← Trading bot management tools
        trading.ts              ← Live trading / daemon control tools
        fundamentals.ts         ← Fundamental data tools
      resources/
        symbols.ts              ← Symbol list resource
        strategies.ts           ← Strategy catalogue resource
        positions.ts            ← Live positions resource
      prompts/
        analyse-symbol.ts       ← Guided prompts for common workflows
        run-backtest.ts
        suggest-strategy.ts
    package.json
    tsconfig.json
    README.md
```

---

## 🛠 MCP Tools — Full Catalogue

Each tool is a structured callable function that an AI agent can invoke. Below is the complete list grouped by domain.

---

### 📊 1. Market Data Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `get_historical_data` | Fetch OHLCV price history for a symbol | `symbol`, `interval` (`1m`/`5m`/`1h`/`1d`), `limit` |
| `get_quote` | Get the latest quote/price snapshot for a symbol | `symbol` |
| `search_symbols` | Search/autocomplete instruments by name or ticker | `query`, `market` (`india`/`us`/`crypto`) |
| `get_market_status` | Check if a market (India/US/Crypto) is currently open | `market` |
| `get_symbol_metadata` | Retrieve symbol name, sector, industry from DB or provider | `symbol` |

**Implementation**: Wraps `DataService.getHistoricalData()`, `YahooFinanceProvider`, `KiteProvider`, and the `instruments.json` instrument catalogue.

---

### 📈 2. Technical Indicator Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `compute_indicator` | Calculate any supported indicator on historical data | `symbol`, `indicator` (e.g. `"RSI"`, `"EMA"`), `params` (period, etc.), `interval` |
| `list_indicators` | List all available indicators with their parameter schemas | — |
| `get_indicator_value` | Get the last N values of an indicator for a symbol | `symbol`, `indicator`, `params`, `count` |

**Supported Indicators**: SMA, EMA, DEMA, TEMA, WMA, RSI, MACD, Bollinger Bands, ATR, CCI, Stochastic, VWAP, AVWAP, Pivot Trend, Williams %R, ROC, MOM, RVOL, Slope.

**Implementation**: Instantiates the appropriate indicator class from `@quantomate/library`, builds a `Dataset`, calls `.prepare()`, and returns the series.

---

### 🧪 3. Backtest Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `run_backtest` | Run a backtest for a strategy on a symbol with custom config | `symbol`, `strategy`, `params`, `interval`, `capital`, `commission`, `slippage` |
| `get_backtest_summary` | Return a compact summary of a previous backtest result | `backtestId` |
| `list_strategies` | List all available strategy IDs with their parameter schemas | — |
| `compare_strategies` | Run multiple strategies on the same symbol and compare results | `symbol`, `strategies[]`, `capital`, `interval` |

**Output** (from `BacktestReport`):
- `initialCapital`, `finalCapital`, `returnsPercentage`
- `numberOfTrades`, `winningRate`
- `stopLossExits`, `takeProfitExits`, `strategyExits`
- `totalCommissions`, `totalSlippage`
- Full trade-by-trade log with entry/exit context and indicator snapshots

**Implementation**: Uses the `Backtest` class from `@quantomate/core`, instantiates strategy from `@quantomate/library`, fetches data via `DataService`.

---

### 📡 4. Portfolio Signal Scan Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `scan_signals` | Run all active strategies on a list of symbols and return signals | `symbols[]`, `cached` (boolean — use DB cache or recompute) |
| `get_symbol_signals` | Get the latest strategy signals for a specific symbol | `symbol` |
| `get_chart_data` | Get OHLCV + all signal markers (BUY/SELL) for charting | `symbol` |
| `refresh_signals` | Force-refresh signal cache for a set of symbols | `symbols[]` |

**Signal Output per symbol/strategy**:
- `signalValue`: `BUY`, `SELL`, `SHORT`, `COVER`, `HOLD`
- `price`: Price at signal
- `triggeredAt`: Timestamp

**Implementation**: Wraps `PortfolioSignalService.getSignals()` and `getChartData()`.

---

### 🤖 5. Trading Bot Management Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `list_bots` | List all trading bots and their status (active/inactive) | — |
| `create_bot` | Create a new trading bot with a strategy, symbol, and parameters | `name`, `symbol`, `strategy`, `params`, `allocationSessionId` |
| `update_bot` | Update bot parameters or toggle active state | `botId`, `params`, `active` |
| `delete_bot` | Remove a bot from the system | `botId` |
| `get_bot_status` | Get status and current allocation for a specific bot | `botId` |

**Implementation**: Direct `prisma.tradingBot` CRUD operations, followed by `/reconcile` call to daemon if engine is running.

---

### ⚙️ 6. Live Trading & Daemon Control Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `get_daemon_status` | Get engine status, active bots, positions, orders, account info | — |
| `reconcile_engine` | Trigger engine reconciliation (picks up bot changes) | — |
| `stop_engine` | Gracefully stop the live trading engine | — |
| `exit_position` | Place a market exit order for a specific position symbol | `symbol` |
| `panic_exit` | Close ALL open positions and cancel all pending orders immediately | — |
| `cleanup_symbols` | Remove virtual position tracking for given symbols | `symbols[]` |
| `reset_trading` | Full reset: clear all DB orders, positions, accounts, sessions | — |
| `get_trading_settings` | Get current trading mode (paper/live) and enabled markets | — |
| `update_trading_settings` | Update trading mode or enabled markets | `tradingMode`, `enabledMarkets[]` |
| `get_zerodha_auth_url` | Get the Zerodha login URL for session authentication | — |

**Implementation**: HTTP calls to the running daemon at `http://localhost:8082`, or direct Prisma access for settings.

---

### 💹 7. Position & Order Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `get_positions` | Get all current broker positions with P&L | — |
| `get_orders` | Get order history (all / pending / filled / cancelled) | `status` (optional) |
| `get_account_info` | Get account balance, available cash, and equity | — |
| `get_allocation_sessions` | List all capital allocation sessions | — |
| `get_session_summary` | Get P&L, drawdown, and trade stats for an allocation session | `sessionId` |

**Implementation**: Wraps `IBroker` methods (`getPositions`, `getOrders`, `getAccountInfo`) via daemon status endpoint or direct broker access.

---

### 📋 8. Fundamental Data Tools

| Tool Name | Description | Key Parameters |
|---|---|---|
| `get_fundamentals` | Fetch P/E, EPS, revenue, market cap, analyst ratings for a symbol | `symbol` |
| `get_fundamentals_batch` | Get fundamentals for a list of symbols | `symbols[]` |
| `screen_stocks` | Screen stocks by fundamental criteria (PE < X, sector = Y, etc.) | `criteria` object |

**Implementation**: Wraps `FundamentalService.refreshSignals()` and DB-cached fundamentals from the `StrategySignal` / Symbol tables.

---

## 📚 MCP Resources

Resources are **read-only data endpoints** that AI clients can subscribe to (like context documents).

| Resource URI | Description |
|---|---|
| `quantomate://symbols/watchlist` | User's current symbol watchlist from DB |
| `quantomate://strategies/catalogue` | All available strategies with parameter schemas |
| `quantomate://positions/live` | Live current broker positions (polling) |
| `quantomate://bots/active` | Currently active trading bots |
| `quantomate://market/status` | Real-time open/close status for all markets |
| `quantomate://account/summary` | Current account balance and session P&L |

---

## 💬 MCP Prompts (Guided Workflows)

Prompts are **pre-built conversation starters** that help users get the most out of Quantomate via AI.

| Prompt Name | Description |
|---|---|
| `analyse-symbol` | "Analyse `{symbol}` — fetch historical data, compute RSI/MACD/BB, run top strategies, and give a trading recommendation." |
| `run-backtest` | "Backtest `{strategy}` on `{symbol}` for the last `{years}` years with `{capital}` capital. Return full performance report." |
| `suggest-strategy` | "Based on current market conditions for `{symbol}`, which of the available strategies has the best setup right now?" |
| `portfolio-scan` | "Scan `{symbols[]}` for buy/sell signals across all active strategies and rank by signal strength." |
| `risk-check` | "Check current open positions, evaluate drawdown, and flag any positions exceeding risk thresholds." |
| `explain-indicator` | "Explain the `{indicator}` indicator, compute it for `{symbol}`, and interpret the current value." |

---

## 🔧 Technical Implementation Details

### Transport Layer

MCP supports two transport modes. Both should be supported:

1. **stdio** (default for local AI tools like Claude Desktop, Cursor)
   - Process communicates via stdin/stdout
   - Zero infrastructure required
   - Best for local developer usage

2. **HTTP/SSE** (for remote or multi-client usage)
   - Server listens on a configurable port (e.g. `3001`)
   - Supports streaming responses for long-running backtests
   - Suitable for deployment alongside the UI server

### Recommended MCP SDK

```json
// packages/mcp/package.json dependencies
{
  "@modelcontextprotocol/sdk": "^1.x",
  "@quantomate/core": "workspace:*",
  "@quantomate/data": "workspace:*",
  "@quantomate/library": "workspace:*",
  "@quantomate/db": "workspace:*",
  "zod": "^3.x"
}
```

Use **Zod** for input schema validation on all tools (the MCP SDK accepts Zod schemas natively for JSON Schema generation).

### Authentication & Security

- Daemon control tools (stop, reset, panic-exit) should require an `QUANTOMATE_MCP_SECRET` token passed as a tool argument or environment variable
- Read-only tools (signals, market data, indicators) can be open
- Broker API keys remain server-side and are never exposed to the AI client

### Error Handling

All tools should return structured errors:
```ts
{ success: false, error: "Market is closed", code: "MARKET_CLOSED" }
```
instead of throwing, so AI agents can handle them gracefully.

### Long-Running Tool Support

Backtests on large datasets can take seconds. Use MCP's **streaming / progress notifications** to send intermediate results:
```
Tool started: running backtest for AAPL (GoldenCross, 5 years)…
Tool progress: processing 1250 candles…
Tool result: { returnsPercentage: 34.2, numberOfTrades: 18, … }
```

---

## 🚀 Benefits

### For You as the Developer

| Benefit | Detail |
|---|---|
| **AI-native trading research** | Ask Claude or Cursor: *"Scan these 20 stocks for RSI oversold signals and run a backtest on the top 3"* — fully automated |
| **Faster iteration on strategies** | Describe a new strategy idea in natural language; the AI generates the code, runs a backtest via MCP, and reports results — without leaving the chat |
| **Natural language bot management** | Create, modify, and monitor trading bots through conversational commands instead of a UI |
| **Context-aware debugging** | AI tools with access to the MCP server can correlate live positions, bot parameters, and market data to diagnose anomalies automatically |
| **Automated daily briefings** | Schedule an AI agent to run `scan_signals` every morning and deliver a portfolio signal summary |

### For AI Agents / LLM Tooling

| Benefit | Detail |
|---|---|
| **Grounded market data** | Agents can access real, up-to-date OHLCV data instead of hallucinating prices |
| **Verifiable computation** | All indicator and backtest results are computed deterministically — the AI can reason about actual numbers |
| **Action capability** | Beyond reading data, agents can place paper trades, manage bots, and control the daemon — making Quantomate a fully agentic trading platform |
| **Composability** | MCP tools can be chained: `get_historical_data` → `compute_indicator` → `run_backtest` → `create_bot` — all in a single agent conversation |

### For Potential Future Extensions

| Benefit | Detail |
|---|---|
| **Multi-agent trading teams** | Orchestrator agents that spawn specialist sub-agents (data analyst, risk manager, execution engine) each using Quantomate MCP tools |
| **Third-party AI integrations** | Any MCP-compatible tool (Claude Desktop, Zed, VS Code extensions, n8n, Dify) can connect with zero extra integration work |
| **Strategy marketplace** | Share MCP-compatible strategy prompts that others can run against the server |
| **CI/CD integration** | Run backtests as part of a CI pipeline before deploying strategy changes to live trading |

---

## 📅 Implementation Phases

### Phase 1 — Foundation (1–2 days)
- [ ] Create `packages/mcp/` with package scaffold and MCP SDK setup
- [ ] Implement stdio transport with basic server init
- [ ] Implement `list_indicators`, `list_strategies` tools (static, no DB needed)
- [ ] Implement `get_historical_data` tool wrapping `DataService`
- [ ] Implement `compute_indicator` tool (single indicator, single symbol)
- [ ] Write `README.md` with Claude Desktop / Cursor setup instructions

### Phase 2 — Backtest & Signals (2–3 days)
- [ ] Implement `run_backtest` tool with streaming progress
- [ ] Implement `compare_strategies` tool
- [ ] Implement `scan_signals` / `get_symbol_signals` tools
- [ ] Implement `get_chart_data` tool
- [ ] Implement `get_fundamentals` tool
- [ ] Add `quantomate://strategies/catalogue` resource

### Phase 3 — Live Trading Control (2–3 days)
- [ ] Implement all daemon control tools (`get_daemon_status`, `reconcile_engine`, etc.)
- [ ] Implement bot CRUD tools
- [ ] Implement position / order / account tools
- [ ] Implement `panic_exit` with confirmation guard
- [ ] Add HTTP/SSE transport option

### Phase 4 — Prompts & Polish (1 day)
- [ ] Implement all 6 guided prompts
- [ ] Add all resource endpoints
- [ ] Add input validation with Zod on all tools
- [ ] Add integration with Claude Desktop config example
- [ ] Add integration with Cursor MCP config example

---

## 🔌 Claude Desktop Integration Example

After building, users can add this to their Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "quantomate": {
      "command": "node",
      "args": ["/path/to/quantomate/packages/mcp/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://...",
        "DAEMON_PORT": "8082"
      }
    }
  }
}
```

Then in Claude Desktop, you can say:
> *"Scan AAPL, TSLA, NVDA for trading signals and run a backtest on any that show a BUY signal using RSI Mean Reversion with 50k capital."*

---

## 🔌 Cursor Integration Example

Add to `.cursor/mcp.json` in the project root:

```json
{
  "mcpServers": {
    "quantomate": {
      "command": "npx",
      "args": ["tsx", "packages/mcp/src/index.ts"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

---

## 📝 Open Questions / Decisions

1. **Daemon coupling**: Should MCP tools talk to the daemon via HTTP (decoupled, requires daemon running) or directly via shared library code (tightly coupled, no daemon needed)?  
   → Recommendation: **Direct library access** for read-only tools, **HTTP to daemon** for engine control actions.

2. **Authentication**: Should the MCP server be secured with a static API key for broker control tools?  
   → Recommended: Yes, for `panic_exit`, `reset_trading`, `create_bot`, `stop_engine`.

3. **Streaming**: MCP 1.x supports progress notifications. Should backtests stream intermediate results or just return final reports?  
   → Recommended: Stream progress for backtests > 1 year of data.

4. **Port conflicts**: The daemon uses `8082`, the UI server uses its own port. The MCP HTTP transport could use `3001` or be stdio-only.

5. **Scope of `run_backtest`**: Should AI clients be able to pass arbitrary strategy code (unsafe), or only select from the pre-built strategy library?  
   → Recommendation: **Pre-built strategies only** for safety.
