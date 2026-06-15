import {
  SMA,
  EMA,
  WMA,
  DEMA,
  TEMA,
  RSI,
  MACD,
  BB,
  ATR,
  CCI,
  Stochastic,
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
 * Instantiates an Indicator class by its catalogue ID, merging user params
 * with sensible defaults. Returns an Indicator instance ready for dataset.apply().
 */
export function createIndicator(
  id: IndicatorId,
  params: Record<string, any> = {}
): Indicator<any, any> {
  const name = id;

  switch (id) {
    case "SMA":
      return new SMA(name, { period: params.period ?? 14, attribute: params.attribute });
    case "EMA":
      return new EMA(name, { period: params.period ?? 14, attribute: params.attribute });
    case "WMA":
      return new WMA(name, { period: params.period ?? 14, attribute: params.attribute });
    case "DEMA":
      return new DEMA(name, { period: params.period ?? 14, attribute: params.attribute });
    case "TEMA":
      return new TEMA(name, { period: params.period ?? 14, attribute: params.attribute });
    case "RSI":
      return new RSI(name, { period: params.period ?? 14, attribute: params.attribute });
    case "MACD":
      // The MACD indicator in @quantomate/library uses fixed EMA-12/EMA-26 periods internally.
      // The only configurable param is the field to compute on (attribute).
      return new MACD(name, {
        attribute: params.attribute,
      } as any);
    case "BB":
      return new BB(name, {
        period: params.period ?? 20,
        multiplier: params.multiplier ?? 2,
        attribute: params.attribute,
      });
    case "ATR":
      return new ATR(name, { period: params.period ?? 14 });
    case "CCI":
      return new CCI(name, { period: params.period ?? 20 });
    case "Stochastic":
      return new Stochastic(name, {
        kPeriod: params.kPeriod ?? params.period ?? 14,
        dPeriod: params.dPeriod ?? 3,
      });
    case "WilliamsR":
      return new WilliamsR(name, { period: params.period ?? 14 });
    case "PivotTrend":
      // PivotTrend only accepts field-name overrides for high/low/close.
      return new PivotTrend(name, {
        high: params.high,
        low: params.low,
        close: params.close,
      });
    case "AVWAP":
      return new AVWAP(name, { anchorIndex: params.anchorIndex ?? 0 });
    case "RVOL":
      return new RVOL(name, { period: params.period ?? 20 });
    case "Slope":
      return new Slope(name, { period: params.period ?? 14, attribute: params.attribute });
    case "VWAP":
      return new VWAP(name, {});
    case "ROC":
      return new ROC(name, { period: params.period ?? 14, attribute: params.attribute });
    case "MOM":
      return new MOM(name, { period: params.period ?? 14, attribute: params.attribute });
    default:
      throw new Error(`Unknown indicator: ${id}`);
  }
}
