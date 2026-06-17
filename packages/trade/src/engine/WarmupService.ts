import { DataService } from '@quantomate/data';
import { Bar } from '@quantomate/core';
import { BotConfig, LiveEngineConfig } from './LiveTradingEngine';

export class WarmupService {
  /**
   * Fetches historical quotes for warming up a bot's candle series
   */
  static async fetchWarmupBars(bot: BotConfig, config: LiveEngineConfig): Promise<Bar[]> {
    const symbol = bot.symbol;
    const intv = bot.interval;
    let warmupQuotes: any[] = [];

    try {
      const startDateStr = config.startDate || new Date().toISOString();
      const warmupDays = intv === '1d' ? 100 : 30;
      const warmupStartDate = new Date(startDateStr);
      warmupStartDate.setDate(warmupStartDate.getDate() - warmupDays);
      const startLimit = warmupStartDate.getTime();
      const endLimit = new Date(startDateStr).getTime();

      console.log(`[Warm-up] Fetching historical warm-up quotes for ${symbol} (${intv})`);
      const allQuotes = await DataService.getHistoricalData(symbol, undefined, intv);
      
      warmupQuotes = allQuotes.filter((q: any) => {
        const qTime = new Date(q.date).getTime();
        return qTime >= startLimit && qTime < endLimit;
      });
      console.log(`[Warm-up] Loaded ${warmupQuotes.length} warm-up quotes for ${symbol} (${intv})`);
    } catch (err: any) {
      console.warn(`[Warm-up] Failed to load warm-up data for ${symbol} (${intv}): ${err.message}`);
    }

    return warmupQuotes.map((q: any) => ({
      open: Number(q.open),
      high: Number(q.high),
      low: Number(q.low),
      close: Number(q.close),
      volume: Number(q.volume),
      timestamp: new Date(q.date).getTime()
    }));
  }
}
