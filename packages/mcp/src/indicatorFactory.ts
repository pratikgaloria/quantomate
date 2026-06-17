import {
  SMA,
  EMA,
  WMA,
  DEMA,
  TEMA,
  RSI,
  ATR,
  CCI,
  WilliamsR,
  PivotTrend,
  AVWAP,
  RVOL,
  Slope,
  VWAP,
  ROC,
  MOM,
} from "@quantomate/library";
import { Indicator } from "@quantomate/core";
import { IndicatorId } from "./catalogues.js";

/**
 * Instantiates a single-valued stateless Indicator class by its catalogue ID.
 * Multi-valued indicators (MACD, BB, Stochastic) are handled separately in the tool logic.
 */
export function createIndicator(
  id: IndicatorId,
  params: Record<string, any> = {}
): Indicator<any, any> {
  const name = id;
  const field = params.attribute || "close";

  switch (id) {
    case "SMA":
      return new SMA(name, { period: params.period ?? 14, field });
    case "EMA":
      return new EMA(name, { period: params.period ?? 14, field });
    case "WMA":
      return new WMA(name, { period: params.period ?? 14, field });
    case "DEMA":
      return new DEMA(name, { period: params.period ?? 14, field });
    case "TEMA":
      return new TEMA(name, { period: params.period ?? 14, field });
    case "RSI":
      return new RSI(name, { period: params.period ?? 14, field });
    case "ATR":
      return new ATR(name, { period: params.period ?? 14 });
    case "CCI":
      return new CCI(name, { period: params.period ?? 20 });
    case "WilliamsR":
      return new WilliamsR(name, { period: params.period ?? 14 });
    case "PivotTrend":
      return new PivotTrend(name);
    case "AVWAP":
      return new AVWAP(name, { anchorIndex: params.anchorIndex ?? 0, field });
    case "RVOL":
      return new RVOL(name, { period: params.period ?? 20 });
    case "Slope":
      return new Slope(name, { period: params.period ?? 14, field });
    case "VWAP":
      return new VWAP(name, { field });
    case "ROC":
      return new ROC(name, { period: params.period ?? 14, field });
    case "MOM":
      return new MOM(name, { period: params.period ?? 14, field });
    case "MACD":
    case "BB":
    case "Stochastic":
      throw new Error(`${id} is a multi-valued indicator and must be calculated using dedicated logic.`);
    default:
      throw new Error(`Unknown indicator: ${id}`);
  }
}
