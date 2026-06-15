import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Dataset } from "@quantomate/core";
import { DataService } from "@quantomate/data";
import {
  ComputeIndicatorInputSchema,
  GetIndicatorValueInputSchema,
} from "../schemas/inputs.js";
import { INDICATOR_CATALOGUE } from "../catalogues.js";
import { createIndicator } from "../indicatorFactory.js";

/**
 * Registers all technical indicator tools on the MCP server.
 */
export function registerIndicatorTools(server: McpServer) {
  // ─── list_indicators ──────────────────────────────────────────────────────
  server.tool(
    "list_indicators",
    "List all available technical indicators with their IDs, descriptions, and parameter schemas. " +
      "Use this to discover indicator IDs and parameter names before calling compute_indicator.",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                count: INDICATOR_CATALOGUE.length,
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

  // ─── compute_indicator ────────────────────────────────────────────────────
  server.tool(
    "compute_indicator",
    "Compute a technical indicator on historical price data for a symbol. " +
      "Fetches OHLCV data, applies the indicator, and returns the full computed series. " +
      "Use list_indicators to see available indicator IDs and their parameters.",
    ComputeIndicatorInputSchema.shape,
    async ({ symbol, interval, indicator, params, limit }) => {
      try {
        const rawData = await DataService.getHistoricalData(
          symbol.toUpperCase(),
          limit,
          interval
        );

        if (!rawData || rawData.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: `No historical data for ${symbol} (${interval})`,
                }),
              },
            ],
            isError: true,
          };
        }

        const stockData = rawData.map((d: any) => ({
          date: d.date instanceof Date ? d.date : new Date(d.date),
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume),
        }));

        const dataset = new Dataset(stockData);
        const indicatorInstance = createIndicator(indicator as any, params || {});
        dataset.apply(indicatorInstance);

        const series: { date: string; value: any }[] = [];
        for (let i = 0; i < dataset.length; i++) {
          const quote = dataset.at(i)!;
          const val = quote.value as any;
          let indicatorValue: any;
          try {
            indicatorValue = quote.getIndicator(indicator);
          } catch {
            indicatorValue = null;
          }
          series.push({
            date: val.date instanceof Date ? val.date.toISOString() : val.date,
            value: typeof indicatorValue === "number" && isNaN(indicatorValue)
              ? null
              : indicatorValue,
          });
        }

        const lastValid = [...series].reverse().find((s) => s.value !== null);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  symbol: symbol.toUpperCase(),
                  interval,
                  indicator,
                  params: params ?? {},
                  barsUsed: stockData.length,
                  latestValue: lastValid?.value ?? null,
                  latestDate: lastValid?.date ?? null,
                  series,
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
              text: JSON.stringify({ success: false, error: err.message }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ─── get_indicator_value ─────────────────────────────────────────────────
  server.tool(
    "get_indicator_value",
    "Get the most recent N values of a technical indicator for a symbol. " +
      "Lighter-weight alternative to compute_indicator when you only need the tail of the series.",
    GetIndicatorValueInputSchema.shape,
    async ({ symbol, interval, indicator, params, limit, count }) => {
      try {
        const rawData = await DataService.getHistoricalData(
          symbol.toUpperCase(),
          limit,
          interval
        );

        if (!rawData || rawData.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: `No historical data for ${symbol} (${interval})`,
                }),
              },
            ],
            isError: true,
          };
        }

        const stockData = rawData.map((d: any) => ({
          date: d.date instanceof Date ? d.date : new Date(d.date),
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume),
        }));

        const dataset = new Dataset(stockData);
        const indicatorInstance = createIndicator(indicator as any, params || {});
        dataset.apply(indicatorInstance);

        const allValues: { date: string; value: any }[] = [];
        for (let i = 0; i < dataset.length; i++) {
          const quote = dataset.at(i)!;
          const val = quote.value as any;
          let indicatorValue: any;
          try {
            indicatorValue = quote.getIndicator(indicator);
          } catch {
            indicatorValue = null;
          }
          if (indicatorValue !== null && !(typeof indicatorValue === "number" && isNaN(indicatorValue))) {
            allValues.push({
              date: val.date instanceof Date ? val.date.toISOString() : val.date,
              value: indicatorValue,
            });
          }
        }

        const recent = allValues.slice(-count);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  symbol: symbol.toUpperCase(),
                  interval,
                  indicator,
                  params: params ?? {},
                  count: recent.length,
                  latestValue: recent[recent.length - 1]?.value ?? null,
                  latestDate: recent[recent.length - 1]?.date ?? null,
                  values: recent,
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
              text: JSON.stringify({ success: false, error: err.message }),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
