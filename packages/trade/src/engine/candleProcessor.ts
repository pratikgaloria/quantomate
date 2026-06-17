import { Bar } from '@quantomate/core';
import { BotConfig } from './engineTypes';
import { createStrategyContext } from './indicatorResolver';
import { SignalValidator } from './SignalValidator';

export async function processCandleClose(
  symbol: string,
  intv: string,
  bar: Bar,
  engine: {
    bots: BotConfig[];
    positionManagers: any;
    liveExecutors: any;
    baseSeriesMap: any;
    lastTradedCandleTimestamp: Map<string, number>;
  }
): Promise<void> {
  for (const bot of engine.bots) {
    if (bot.symbol.toUpperCase() !== symbol.toUpperCase() || bot.interval !== intv) {
      continue;
    }

    const manager = engine.positionManagers.get(bot.id);
    const executor = engine.liveExecutors.get(bot.id);
    const series = engine.baseSeriesMap.get(`${symbol}:${intv}`);
    if (!manager || !executor || !series) continue;

    try {
      const lastTraded = engine.lastTradedCandleTimestamp.get(bot.id);
      if (lastTraded === bar.timestamp) continue;

      const context = createStrategyContext(bot.strategy, series, engine.baseSeriesMap);
      const lastIndex = series.length - 1;
      const signal = bot.strategy.evaluate(series, lastIndex, context);

      if (signal.action === 'entry' || signal.action === 'exit') {
        console.log(`[Signal] Closed candle trigger (${signal.action}) for ${symbol} (${intv}) on bot ${bot.id}. Validating...`);
        const verified = await SignalValidator.validateSignalWithRest(
          bot,
          series,
          signal.action,
          bar.timestamp,
          (b, s) => createStrategyContext(b.strategy, s, engine.baseSeriesMap)
        );
        if (verified) {
          engine.lastTradedCandleTimestamp.set(bot.id, bar.timestamp);
          const transition = manager.processSignal(signal, bar);
          if (transition) {
            await executor.execute(transition, symbol);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing closed candle for ${symbol} (${intv}) on bot ${bot.id}:`, error);
    }
  }
}
