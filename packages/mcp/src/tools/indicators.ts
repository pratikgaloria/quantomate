import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Bar, BarSeries } from "@quantomate/core";
import { MACD, MACDSignal, BB, Stochastic } from "@quantomate/library";
import { DataService } from "@quantomate/data";
import {
  ComputeIndicatorInputSchema,
  GetIndicatorValueInputSchema,
} from "../schemas/inputs.js";
import { INDICATOR_CATALOGUE } from "../catalogues.js";
import { createIndicator } from "../indicatorFactory.js";

/**
 * Helper to compute an indicator values array statelessly
 */
function computeStatelessIndicator(
  indicator: string,
  series: BarSeries,
  params: Record<string, any>
): any[] {
  const values: any[] = [];

  if (indicator === "MACD") {
    const field = params.attribute || "close";
    const fastPeriod = params.fastPeriod || 12;
    const slowPeriod = params.slowPeriod || 26;
    const signalPeriod = params.signalPeriod || 9;

    const macdSeries = new MACD("macd", { fastPeriod, slowPeriod, field }).calculate(series);
    const signalSeries = new MACDSignal("signal", { fastPeriod, slowPeriod, signalPeriod, field }).calculate(series);

    for (let i = 0; i < series.length; i++) {
      const macdVal = macdSeries.at(i) ?? NaN;
      const sigVal = signalSeries.at(i) ?? NaN;
      const histVal = isNaN(macdVal) || isNaN(sigVal) ? NaN : macdVal - sigVal;

      values.push(
        isNaN(macdVal) && isNaN(sigVal)
          ? null
          : { macd: macdVal, signal: sigVal, histogram: histVal }
      );
    }
  } else if (indicator === "BB") {
    const period = params.period || 20;
    const multiplier = params.multiplier || 2.0;
    const field = params.attribute || "close";

    const upper = new BB("upper", { period, multiplier, band: "upper", field }).calculate(series);
    const middle = new BB("middle", { period, multiplier, band: "middle", field }).calculate(series);
    const lower = new BB("lower", { period, multiplier, band: "lower", field }).calculate(series);

    for (let i = 0; i < series.length; i++) {
      const u = upper.at(i) ?? NaN;
      const m = middle.at(i) ?? NaN;
      const l = lower.at(i) ?? NaN;

      values.push(
        isNaN(m)
          ? null
          : { upper: u, middle: m, lower: l }
      );
    }
  } else if (indicator === "Stochastic") {
    const kPeriod = params.kPeriod || params.period || 14;
    const dPeriod = params.dPeriod || 3;

    const stoch = new Stochastic("stoch", { kPeriod, dPeriod }).calculate(series);

    for (let i = 0; i < series.length; i++) {
      const val = stoch.at(i);
      values.push(
        !val || (isNaN(val.k) && isNaN(val.d))
          ? null
          : { k: val.k, d: val.d }
      );
    }
  } else {
    const inst = createIndicator(indicator as any, params);
    const calculated = inst.calculate(series);

    for (let i = 0; i < series.length; i++) {
      const val = calculated.at(i) ?? NaN;
      values.push(isNaN(val) ? null : val);
    }
  }

  return values;
}

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

        const bars: Bar[] = rawData.map((d: any) => ({
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume),
          timestamp: d.date instanceof Date ? d.date.getTime() : new Date(d.date).getTime(),
        }));

        const series = new BarSeries(bars);
        const indicatorValues = computeStatelessIndicator(indicator, series, params || {});

        const resultSeries: { date: string; value: any }[] = [];
        for (let i = 0; i < series.length; i++) {
          const date = new Date(series.at(i)!.timestamp).toISOString();
          resultSeries.push({
            date,
            value: indicatorValues[i],
          });
        }

        const lastValid = [...resultSeries].reverse().find((s) => s.value !== null);

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
                  barsUsed: bars.length,
                  latestValue: lastValid?.value ?? null,
                  latestDate: lastValid?.date ?? null,
                  series: resultSeries,
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

        const bars: Bar[] = rawData.map((d: any) => ({
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume),
          timestamp: d.date instanceof Date ? d.date.getTime() : new Date(d.date).getTime(),
        }));

        const series = new BarSeries(bars);
        const indicatorValues = computeStatelessIndicator(indicator, series, params || {});

        const allValues: { date: string; value: any }[] = [];
        for (let i = 0; i < series.length; i++) {
          const val = indicatorValues[i];
          if (val !== null) {
            const date = new Date(series.at(i)!.timestamp).toISOString();
            allValues.push({
              date,
              value: val,
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
