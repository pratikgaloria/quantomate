import { Bar, BarSeries } from '@quantomate/core';
import { createStrategyContext } from './indicatorResolver';
import { SignalValidator } from './SignalValidator';

export function updateTickBarSeries(series: BarSeries, closedCandle: any, currentCandle: any): void {
  if (closedCandle) {
    const closedBar: Bar = {
      open: closedCandle.open,
      high: closedCandle.high,
      low: closedCandle.low,
      close: closedCandle.close,
      volume: closedCandle.volume,
      timestamp: closedCandle.timestamp,
    };

    if (series.length === 0) {
      series.push(closedBar);
    } else {
      series.set(-1, closedBar);
    }

    const currentBar: Bar = {
      open: currentCandle.open,
      high: currentCandle.high,
      low: currentCandle.low,
      close: currentCandle.close,
      volume: currentCandle.volume,
      timestamp: currentCandle.timestamp,
    };
    series.push(currentBar);
  } else {
    const currentBar: Bar = {
      open: currentCandle.open,
      high: currentCandle.high,
      low: currentCandle.low,
      close: currentCandle.close,
      volume: currentCandle.volume,
      timestamp: currentCandle.timestamp,
    };
    if (series.length === 0) {
      series.push(currentBar);
    } else {
      series.set(-1, currentBar);
    }
  }
}

export async function evaluateBotsOnTick(
  symbol: string,
  intv: string,
  currentCandle: any,
  series: BarSeries,
  engine: any
): Promise<void> {
  for (const bot of engine.bots) {
    if (bot.symbol.toUpperCase() !== symbol.toUpperCase() || bot.interval !== intv) {
      continue;
    }

    const manager = engine.positionManagers.get(bot.id);
    const executor = engine.liveExecutors.get(bot.id);
    if (!manager || !executor) continue;

    const lastTraded = engine.lastTradedCandleTimestamp.get(bot.id);
    if (lastTraded === currentCandle.timestamp) continue;

    const context = createStrategyContext(bot.strategy, series, engine.baseSeriesMap);
    const lastIndex = series.length - 1;
    const signal = bot.strategy.evaluate(series, lastIndex, context);

    if (signal.action === 'entry' || signal.action === 'exit') {
      console.log(`[Signal] Tick trigger (${signal.action}) for ${symbol} (${intv}) on bot ${bot.id}. Validating...`);
      const verified = await SignalValidator.validateSignalWithRest(
        bot,
        series,
        signal.action,
        currentCandle.timestamp,
        (b, s) => createStrategyContext(b.strategy, s, engine.baseSeriesMap)
      );
      if (verified) {
        engine.lastTradedCandleTimestamp.set(bot.id, currentCandle.timestamp);
        const transition = manager.processSignal(signal, series.at(-1)!);
        if (transition) {
          await executor.execute(transition, symbol);
        }
      }
    }
  }
}
