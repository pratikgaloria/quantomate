import { DataService } from '@quantomate/data';
import { Bar, BarSeries } from '@quantomate/core';
import { BotConfig } from './engineTypes';

export class SignalValidator {
  static async validateSignalWithRest(
    symbol: string,
    bot: BotConfig,
    series: BarSeries,
    localSignalValue: 'entry' | 'exit',
    closedTimestamp: number,
    createStrategyContext: (bot: BotConfig, series: BarSeries) => any
  ): Promise<boolean> {
    try {
      console.log(`[Validation] Querying REST historical data for ${symbol} (${bot.interval}) to verify signal`);
      const allQuotes = await DataService.getHistoricalData(symbol, undefined, bot.interval);

      const officialCandle = allQuotes.find((q: any) => new Date(q.date).getTime() === closedTimestamp);
      if (!officialCandle) {
        console.warn(`[Validation] Official REST candle not found yet for ${symbol} (${bot.interval}) at timestamp ${closedTimestamp}. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const retryQuotes = await DataService.getHistoricalData(symbol, undefined, bot.interval);
        const retryCandle = retryQuotes.find((q: any) => new Date(q.date).getTime() === closedTimestamp);
        if (!retryCandle) {
          console.warn(`[Validation] Failed to find official REST candle after retry for ${symbol} (${bot.interval}). Using local.`);
          return true;
        }
        return this.verifyAndApplyOfficialCandle(symbol, bot, series, localSignalValue, retryCandle, createStrategyContext);
      }

      return this.verifyAndApplyOfficialCandle(symbol, bot, series, localSignalValue, officialCandle, createStrategyContext);
    } catch (err: any) {
      console.error(`[Validation] Error during REST validation for ${symbol}:`, err.message);
      return true;
    }
  }

  private static verifyAndApplyOfficialCandle(
    symbol: string,
    bot: BotConfig,
    series: BarSeries,
    localSignalValue: 'entry' | 'exit',
    officialCandle: any,
    createStrategyContext: (bot: BotConfig, series: BarSeries) => any
  ): boolean {
    const officialTs = new Date(officialCandle.date).getTime();
    
    let index = -1;
    for (let i = series.length - 1; i >= 0; i--) {
      if (series.at(i)?.timestamp === officialTs) {
        index = i;
        break;
      }
    }

    if (index === -1) return false;

    const officialBar: Bar = {
      open: Number(officialCandle.open),
      high: Number(officialCandle.high),
      low: Number(officialCandle.low),
      close: Number(officialCandle.close),
      volume: Number(officialCandle.volume),
      timestamp: officialTs
    };

    series.set(index, officialBar);

    const context = createStrategyContext(bot, series);
    const signal = bot.strategy.evaluate(series, index, context);
    
    if (signal.action === localSignalValue) {
      console.log(`[Validation] Signal CONFIRMED for ${symbol} via REST API.`);
      return true;
    } else {
      console.warn(`[Validation] Signal REJECTED. Local was ${localSignalValue}, but Official REST is ${signal.action}.`);
      return false;
    }
  }
}
