import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { STRATEGY_CATALOGUE, INDICATOR_CATALOGUE } from "../catalogues.js";

/**
 * Registers MCP resources — read-only data that AI clients can access as context.
 */
export function registerResources(server: McpServer) {
  // ─── Strategy catalogue ───────────────────────────────────────────────────
  server.resource(
    "strategies-catalogue",
    "quantomate://strategies/catalogue",
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                description:
                  "All pre-built trading strategies available in Quantomate. " +
                  "Use the strategy `id` when calling the run_backtest or compare_strategies tools.",
                strategies: STRATEGY_CATALOGUE,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ─── Indicator catalogue ──────────────────────────────────────────────────
  server.resource(
    "indicators-catalogue",
    "quantomate://indicators/catalogue",
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                description:
                  "All technical indicators available in Quantomate. " +
                  "Use the indicator `id` when calling the compute_indicator or get_indicator_value tools.",
                indicators: INDICATOR_CATALOGUE,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
