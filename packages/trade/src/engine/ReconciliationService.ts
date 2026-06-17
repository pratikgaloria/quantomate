import { DataService } from '@quantomate/data';
import { Bar, BarSeries } from '@quantomate/core';
import { BotConfig } from './engineTypes';

export class ReconciliationService {
  /**
   * Performs periodic reconciliation for all active bot symbols to fill in gaps.
   */
  static async runReconciliation(
    bots: BotConfig[],
    baseSeriesMap: Map<string, BarSeries>,
    isRunning: () => boolean
  ): Promise<void> {
    console.log('[BackgroundSync] Starting periodic dataset reconciliation...');
    let delay = 0;

    const uniqueSymbols = Array.from(new Set(bots.map(b => b.symbol.toUpperCase())));

    for (const symbol of uniqueSymbols) {
      const activeIntervals = new Set<string>();
      for (const bot of bots) {
        if (bot.symbol.toUpperCase() === symbol) {
          activeIntervals.add(bot.interval);
        }
      }

      for (const intv of activeIntervals) {
        setTimeout(async () => {
          if (!isRunning()) return;
          try {
            console.log(`[BackgroundSync] Reconciling ${symbol} (${intv})...`);
            const allQuotes = await DataService.getHistoricalData(symbol, 5, intv);
            if (!allQuotes || allQuotes.length === 0) return;

            const datasetKey = `${symbol}:${intv}`;
            const series = baseSeriesMap.get(datasetKey);
            if (!series || series.length === 0) return;

            for (let i = 0; i < Math.min(5, allQuotes.length); i++) {
              const officialCandle = allQuotes[allQuotes.length - 1 - i];
              const officialTs = new Date(officialCandle.date).getTime();

              let idx = -1;
              for (let j = series.length - 1; j >= Math.max(0, series.length - 10); j--) {
                if (series.at(j)?.timestamp === officialTs) {
                  idx = j;
                  break;
                }
              }

              if (idx !== -1) {
                const officialBar: Bar = {
                  open: Number(officialCandle.open),
                  high: Number(officialCandle.high),
                  low: Number(officialCandle.low),
                  close: Number(officialCandle.close),
                  volume: Number(officialCandle.volume),
                  timestamp: officialTs
                };
                series.set(idx, officialBar);
              }
            }
          } catch (err: any) {
            console.error(`[BackgroundSync] Failed reconciling ${symbol} (${intv}):`, err.message);
          }
        }, delay);

        delay += 5000;
      }
    }
  }
}
