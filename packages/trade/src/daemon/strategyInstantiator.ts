import { Strategy as V2Strategy } from '@quantomate/core';
import {
  GoldenCrossStrategy,
  RSIMeanReversionStrategy,
  PivotTrendStrategy,
  WeeklyAvwapOptionStrategy,
  VwapRvolOptionStrategy,
  VsaClimacticOptionStrategy,
  ChandelierTrendOptionStrategy,
  IndexOptionMomentumStrategy,
  IndexOptionRsiReversionStrategy,
  LongStraddleStrategy,
  LongStrangleStrategy
} from '@quantomate/library';

export function instantiateStrategy(
  strategyType: string,
  botName: string,
  symbol: string,
  parameters: any
): V2Strategy {
  const name = `${strategyType}_${symbol}_${botName}`;
  const params = parameters || {};

  switch (strategyType) {
    case "GoldenCross":
      return new GoldenCrossStrategy(name, {
        fastPeriod: params.fastPeriod ?? 9,
        slowPeriod: params.slowPeriod ?? 20,
      });
    case "RSIMeanReversion":
      return new RSIMeanReversionStrategy(name, {
        rsiPeriod: params.rsiPeriod ?? 14,
        oversoldThreshold: params.oversoldThreshold ?? 30,
        overboughtThreshold: params.overboughtThreshold ?? 70,
      });
    case "IndexOptionMomentum":
      return new IndexOptionMomentumStrategy(name, {
        fastPeriod: params.fastPeriod ?? 9,
        slowPeriod: params.slowPeriod ?? 20,
      });
    case "IndexOptionRsiReversion":
      return new IndexOptionRsiReversionStrategy(name, {
        rsiPeriod: params.rsiPeriod ?? 14,
        oversoldThreshold: params.oversoldThreshold ?? 30,
        overboughtThreshold: params.overboughtThreshold ?? 70,
      });
    case "PivotTrend":
    case "PivotTrendOption":
      return new PivotTrendStrategy(name, {
        direction: params.direction ?? "both",
        useTrendFilter: params.useTrendFilter ?? false,
        trendFilterInterval: params.trendFilterInterval ?? "1d",
        stopLossType: params.stopLossType ?? "none",
        atrPeriod: params.atrPeriod ?? 14,
        stopLossMultiplier: params.stopLossMultiplier ?? 2.0,
      });
    case "VwapRvolOption":
      return new VwapRvolOptionStrategy(name, {
        rvolThreshold: params.rvolThreshold ?? 2.0,
      });
    case "VsaClimacticOption":
      return new VsaClimacticOptionStrategy(name, {
        bbPeriod: params.bbPeriod ?? 20,
        bbStdDev: params.bbStdDev ?? 2.0,
        rvolThreshold: params.rvolThreshold ?? 2.0,
        bodyMultiplier: params.bodyMultiplier ?? 0.8,
      });
    case "WeeklyAvwapOption":
      return new WeeklyAvwapOptionStrategy(name, {
        volumeSmaPeriod: params.volumeSmaPeriod ?? 20,
      });
    case "ChandelierTrendOption":
      return new ChandelierTrendOptionStrategy(name, {
        period: params.period ?? 22,
        multiplier: params.multiplier ?? 3.0,
        rvolThreshold: params.rvolThreshold ?? 2.0,
      });
    case "LongStraddle":
      return new LongStraddleStrategy(name, {
        rsiPeriod: params.rsiPeriod ?? 14,
        lowerThreshold: params.lowerThreshold ?? 35,
        upperThreshold: params.upperThreshold ?? 65,
      });
    case "LongStrangle":
      return new LongStrangleStrategy(name, {
        rsiPeriod: params.rsiPeriod ?? 14,
        lowerThreshold: params.lowerThreshold ?? 35,
        upperThreshold: params.upperThreshold ?? 65,
        strikeOffset: params.strikeOffset ?? 2,
      });
    default:
      throw new Error(`Unsupported strategy type: ${strategyType}`);
  }
}
