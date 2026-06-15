#!/usr/bin/env node
/**
 * @quantomate/mcp — Model Context Protocol server
 *
 * Exposes Quantomate's market data, technical indicators, and backtesting
 * capabilities to any MCP-compatible AI client (Claude Desktop, Cursor, Antigravity, etc.)
 *
 * Transport: stdio (default) — no network port used.
 *
 * Usage:
 *   node dist/index.js              # stdio (for AI clients)
 *   tsx src/index.ts                # dev mode
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// ESM-safe __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv via require (ESM-safe)
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");

// Load environment variables — workspace root .env wins
dotenv.config({ path: resolve(__dirname, "../.env") });
dotenv.config({ path: resolve(__dirname, "../../../.env"), override: true });

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerMarketDataTools } from "./tools/market-data.js";
import { registerIndicatorTools } from "./tools/indicators.js";
import { registerBacktestTools } from "./tools/backtest.js";
import { registerResources } from "./resources/catalogues.js";

// ─── Server bootstrap ─────────────────────────────────────────────────────────

const server = new McpServer({
  name: "quantomate",
  version: "0.1.0",
});

registerMarketDataTools(server);
registerIndicatorTools(server);
registerBacktestTools(server);
registerResources(server);

// ─── Connect transport ────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // MCP servers MUST NOT write to stdout (it belongs to the JSON-RPC protocol).
  process.stderr.write(
    "[quantomate-mcp] Server started (stdio). Tools: " +
      "get_historical_data, get_market_status, get_symbol_metadata, " +
      "list_indicators, compute_indicator, get_indicator_value, " +
      "list_strategies, run_backtest, compare_strategies\n"
  );
}

main().catch((err) => {
  process.stderr.write(`[quantomate-mcp] Fatal error: ${err.message}\n`);
  process.exit(1);
});
