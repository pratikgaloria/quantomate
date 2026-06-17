import { Bar, BarSeries, PositionManager } from '@quantomate/core';
import { SessionManager } from '../session/SessionManager';
import { CandleBuilder } from '../utils/CandleBuilder';
import { BotConfig } from './engineTypes';
import { LiveExecutor } from '../executor';
import { updateTickBarSeries, evaluateBotsOnTick } from './tickEvaluator';

export async function processTickUpdate(
  symbol: string,
  price: number,
  timestamp: number,
  bid: number | undefined,
  ask: number | undefined,
  volume: number | undefined,
  engine: {
    isRunning: boolean;
    broker: any;
    config: any;
    bots: BotConfig[];
    candleBuilders: Map<string, CandleBuilder>;
    baseSeriesMap: Map<string, BarSeries>;
    positionManagers: Map<string, PositionManager>;
    liveExecutors: Map<string, LiveExecutor>;
    lastTradedCandleTimestamp: Map<string, number>;
    processCandle: (symbol: string, intv: string, bar: Bar) => Promise<void>;
  }
): Promise<void> {
  if (!engine.isRunning) return;

  if (engine.broker.setLastPrice) {
    engine.broker.setLastPrice(symbol, price, bid, ask, timestamp);
  }

  SessionManager.getInstance().updateLastPrice(symbol, price);

  const mode = engine.config.executionMode || 'candle_close';
  const tickVolume = volume ?? 0;

  for (const [builderKey, builder] of engine.candleBuilders.entries()) {
    if (!builderKey.startsWith(`${symbol}:`)) continue;
    const [, intv] = builderKey.split(':');
    const { closedCandle, currentCandle } = builder.processTick(symbol, price, tickVolume, timestamp);

    const datasetKey = `${symbol}:${intv}`;
    const series = engine.baseSeriesMap.get(datasetKey);
    if (!series) continue;

    if (mode === 'candle_close') {
      if (closedCandle) {
        const newBar: Bar = {
          open: closedCandle.open,
          high: closedCandle.high,
          low: closedCandle.low,
          close: closedCandle.close,
          volume: closedCandle.volume,
          timestamp: closedCandle.timestamp,
        };
        series.push(newBar);
        await engine.processCandle(symbol, intv, newBar);
      }
    } else {
      updateTickBarSeries(series, closedCandle, currentCandle);
      await evaluateBotsOnTick(symbol, intv, currentCandle, series, engine);
    }
  }
}
