import {
  GoldenCrossStrategy,
  RSIMeanReversionStrategy,
  BollingerBandsStrategy,
  MACDStrategy,
  PivotTrendStrategy,
} from "@quantomate/library";
import { Strategy } from "@quantomate/core";
import { StrategyId } from "./catalogues.js";

/**
 * Instantiates a pre-built strategy by its catalogue ID,
 * merging user params with sensible defaults.
 */
export function createStrategy(
  id: StrategyId,
  params: Record<string, any> = {}
): Strategy {
  const name = `${id}_mcp`;

  switch (id) {
    case "golden-cross":
      return new GoldenCrossStrategy(name, {
        fastPeriod: params.fastPeriod ?? 50,
        slowPeriod: params.slowPeriod ?? 200,
        direction: params.direction ?? "long",
      });

    case "rsi-mean-reversion":
      return new RSIMeanReversionStrategy(name, {
        rsiPeriod: params.rsiPeriod ?? 14,
        oversoldThreshold: params.oversoldThreshold ?? 30,
        overboughtThreshold: params.overboughtThreshold ?? 70,
        direction: params.direction ?? "long",
      });

    case "bollinger-bands":
      return new BollingerBandsStrategy(name, {
        period: params.period ?? 20,
        multiplier: params.multiplier ?? 2,
        direction: params.direction ?? "long",
      });

    case "macd":
      return new MACDStrategy(name, {
        signalPeriod: params.signalPeriod ?? 9,
        direction: params.direction ?? "long",
      });

    case "pivot-trend":
      return new PivotTrendStrategy(name, {
        direction: params.direction ?? "both",
      });

    default:
      throw new Error(`Unknown strategy: ${id}`);
  }
}
