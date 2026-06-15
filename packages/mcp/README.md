# @quantomate/mcp

Model Context Protocol server for Quantomate. Exposes market data, technical indicators, and backtesting to any MCP-compatible AI assistant.

## Tools Available

### Market Data
| Tool | Description |
|---|---|
| `get_historical_data` | Fetch OHLCV price history for a symbol |
| `get_market_status` | Check if india/us/crypto market is currently open |
| `get_symbol_metadata` | Get name, sector, industry for a ticker |

### Technical Indicators
| Tool | Description |
|---|---|
| `list_indicators` | List all 19 available indicators with param schemas |
| `compute_indicator` | Compute a full indicator series on a symbol |
| `get_indicator_value` | Get the last N values of an indicator |

**Supported:** SMA, EMA, WMA, DEMA, TEMA, RSI, MACD, BB, ATR, CCI, Stochastic, WilliamsR, PivotTrend, AVWAP, RVOL, Slope, VWAP, ROC, MOM

### Backtesting
| Tool | Description |
|---|---|
| `list_strategies` | List all 5 pre-built strategies with params |
| `run_backtest` | Run a backtest with streaming step-by-step progress |
| `compare_strategies` | Run 2–5 strategies on a symbol and rank by return |

**Supported:** golden-cross, rsi-mean-reversion, bollinger-bands, macd, pivot-trend

## Resources
- `quantomate://strategies/catalogue` — Strategy definitions as a readable context resource
- `quantomate://indicators/catalogue` — Indicator definitions as a readable context resource

---

## Setup

### Prerequisites
- Node.js 18+
- Database running with Quantomate's Prisma schema migrated
- Root `.env` configured with `DATABASE_URL`

### Build
```bash
# From project root
npm run mcp:build

# Or from this package
npx tsc
```

### Dev (tsx, no build needed)
```bash
npm run mcp        # from project root
# or
npx tsx src/index.ts
```

---

## Integration

### Antigravity IDE (Recommended)

**Port mapping:** No port conflicts — MCP uses stdio only.

1. Open Antigravity IDE
2. Go to **Agent Panel → ⋯ (three dots) → Manage MCP Servers → View raw config**
3. This opens `~/.gemini/config/mcp_config.json`
4. Add the following entry:

```json
{
  "mcpServers": {
    "quantomate": {
      "command": "node",
      "args": ["/home/dev/projects/quantomate/packages/mcp/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/quantomate"
      }
    }
  }
}
```

5. Save the file
6. Back in Antigravity: **Manage MCP Servers → Refresh**

**For dev mode (no build required):**
```json
{
  "mcpServers": {
    "quantomate": {
      "command": "npx",
      "args": ["tsx", "/home/dev/projects/quantomate/packages/mcp/src/index.ts"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/quantomate"
      }
    }
  }
}
```

---

### Claude Desktop

Edit `~/.config/Claude/claude_desktop_config.json` (Linux) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "quantomate": {
      "command": "node",
      "args": ["/home/dev/projects/quantomate/packages/mcp/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/quantomate"
      }
    }
  }
}
```

---

### Cursor

Add to `.cursor/mcp.json` in the project root:

```json
{
  "mcpServers": {
    "quantomate": {
      "command": "npx",
      "args": ["tsx", "packages/mcp/src/index.ts"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/quantomate"
      }
    }
  }
}
```

---

## Example Prompts (after integration)

```
"Run a backtest of RSI Mean Reversion on AAPL with $50,000 capital"

"What is the current RSI and MACD for TSLA on the daily chart?"

"Compare golden-cross vs macd vs rsi-mean-reversion on NVDA and tell me which performed best in the last 2 years"

"Is the US market open right now?"

"List all available strategies and their parameters"
```

---

## Port Mapping

| Service | Port |
|---|---|
| UI client (Vite dev) | 5173 |
| UI API server | 3001 |
| Trade daemon | 8082 |
| MCP server | **stdio only — no port** |
