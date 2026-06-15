import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DataService } from "@quantomate/data";
import { prisma } from "@quantomate/db";
import {
  HistoricalDataInputSchema,
  MarketStatusInputSchema,
  SymbolMetaInputSchema,
} from "../schemas/inputs.js";
import { MARKET_SCHEDULES } from "./market-utils.js";

/**
 * Registers all market-data tools on the MCP server.
 */
export function registerMarketDataTools(server: McpServer) {
  // ─── get_historical_data ──────────────────────────────────────────────────
  server.tool(
    "get_historical_data",
    "Fetch OHLCV (open, high, low, close, volume) price history for a symbol. " +
      "Data is fetched from the provider and cached in the local database. " +
      "Use the `interval` parameter to control candle size (1m, 5m, 15m, 1h, 1d). " +
      "Use `limit` to cap the number of most-recent candles returned.",
    HistoricalDataInputSchema.shape,
    async ({ symbol, interval, limit }) => {
      try {
        const data = await DataService.getHistoricalData(
          symbol.toUpperCase(),
          limit,
          interval
        );

        if (!data || data.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: `No historical data found for ${symbol} (${interval})`,
                }),
              },
            ],
          };
        }

        const formatted = data.map((d: any) => ({
          date: d.date instanceof Date ? d.date.toISOString() : d.date,
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume),
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  symbol: symbol.toUpperCase(),
                  interval,
                  count: formatted.length,
                  from: formatted[0]?.date,
                  to: formatted[formatted.length - 1]?.date,
                  data: formatted,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: err.message,
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ─── get_market_status ────────────────────────────────────────────────────
  server.tool(
    "get_market_status",
    "Check whether a market (india, us, or crypto) is currently open or closed. " +
      "Returns the open/close schedule and current status.",
    MarketStatusInputSchema.shape,
    async ({ market }) => {
      try {
        const schedule = MARKET_SCHEDULES[market];
        if (!schedule) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: `Unknown market: ${market}`,
                }),
              },
            ],
            isError: true,
          };
        }

        const isOpen = checkMarketOpen(market);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  market,
                  name: schedule.name,
                  isOpen,
                  schedule: {
                    timeZone: schedule.timeZone,
                    openTime: schedule.openTime,
                    closeTime: schedule.closeTime,
                    weekdaysOnly: schedule.weekdaysOnly,
                  },
                  currentUtcTime: new Date().toISOString(),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            { type: "text", text: JSON.stringify({ success: false, error: err.message }) },
          ],
          isError: true,
        };
      }
    }
  );

  // ─── get_symbol_metadata ─────────────────────────────────────────────────
  server.tool(
    "get_symbol_metadata",
    "Retrieve metadata for a ticker symbol: name, sector, and industry. " +
      "Data is fetched from the database cache or from the data provider if not found.",
    SymbolMetaInputSchema.shape,
    async ({ symbol }) => {
      try {
        const id = symbol.toUpperCase();

        // Try DB first
        let meta = await prisma.symbol.findUnique({ where: { id } });

        if (!meta) {
          // Trigger DataService which auto-creates the symbol record
          await DataService.getHistoricalData(id, 1, "1d");
          meta = await prisma.symbol.findUnique({ where: { id } });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  symbol: id,
                  name: meta?.name ?? id,
                  sector: meta?.sector ?? "Unknown",
                  industry: meta?.industry ?? "Unknown",
                  lastUpdated: meta?.updatedAt?.toISOString() ?? null,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            { type: "text", text: JSON.stringify({ success: false, error: err.message }) },
          ],
          isError: true,
        };
      }
    }
  );
}

// ─── Inline market open check (avoids cross-package dep on @quantomate/trade) ─

function checkMarketOpen(market: string): boolean {
  if (process.env.BYPASS_MARKET_HOURS === "true") return true;

  const schedule = MARKET_SCHEDULES[market.toLowerCase()];
  if (!schedule) return false;
  if (market.toLowerCase() === "crypto") return true;

  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: schedule.timeZone,
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const get = (t: string) =>
      parts.find((p) => p.type === t)?.value ?? "0";

    const weekday = get("weekday");
    if (
      schedule.weekdaysOnly &&
      (weekday === "Saturday" || weekday === "Sunday")
    ) {
      return false;
    }

    const hour = parseInt(get("hour"), 10);
    const minute = parseInt(get("minute"), 10);
    const [openH, openM] = schedule.openTime
      .split(":")
      .map((s) => parseInt(s, 10));
    const [closeH, closeM] = schedule.closeTime
      .split(":")
      .map((s) => parseInt(s, 10));

    const current = hour * 60 + minute;
    return current >= openH * 60 + openM && current < closeH * 60 + closeM;
  } catch {
    return false;
  }
}
