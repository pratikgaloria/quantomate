import { ILiveFeed } from '@quantomate/data';
import { CandleBuilder, intervalToMs } from '../utils/CandleBuilder';
import { Bar, BarSeries, PositionManager, OptionSelector } from '@quantomate/core';
import { IBroker } from '../broker';
import { LiveExecutor } from '../executor';
import { SessionManager } from '../session/SessionManager';
import { WarmupService } from './WarmupService';
import { ReconciliationService } from './ReconciliationService';
import { BotConfig, LiveEngineConfig } from './engineTypes';
import { processTickUpdate } from './tickProcessor';
import { processCandleClose } from './candleProcessor';
import { configureDataProvider } from './dataProviderConfig';

export { BotConfig, LiveEngineConfig } from './engineTypes';

export class LiveTradingEngine {
  public bots: BotConfig[] = [];
  public positionManagers = new Map<string, PositionManager>();
  public liveExecutors = new Map<string, LiveExecutor>();
  public baseSeriesMap = new Map<string, BarSeries>();
  public candleBuilders = new Map<string, CandleBuilder>();
  public isRunning = false;
  public tickPromiseChain = Promise.resolve();
  public syncTimer: NodeJS.Timeout | null = null;
  public lastTradedCandleTimestamp = new Map<string, number>();

  constructor(public feed: ILiveFeed, public broker: IBroker, public config: LiveEngineConfig) {
    this.bots = config.bots || [];
  }

  get running(): boolean { return this.isRunning; }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    configureDataProvider(this.feed.constructor.name, this.config);
    await this.feed.connect();

    const callbacks = {
      getVirtualCash: (id: string) => SessionManager.getInstance().getVirtualCash(id),
      canPlaceOrder: (id: string, cap: number, bal: number) => SessionManager.getInstance().canPlaceOrder(id, cap, bal),
      recordFill: (id: string, sym: string, side: string, qty: number, px: number, comm: number) =>
        SessionManager.getInstance().recordFill(id, sym, side as 'buy' | 'sell', qty, px, comm),
      resolveOptionSymbol: (und: string, type: 'CE' | 'PE', px: number, sel?: OptionSelector) =>
        this.config.resolveOptionSymbol?.(und, type, px, sel),
    };

    for (const bot of this.bots) {
      const datasetKey = `${bot.symbol}:${bot.interval}`;
      if (!this.baseSeriesMap.has(datasetKey)) {
        const warmupBars = await WarmupService.fetchWarmupBars(bot, this.config);
        this.baseSeriesMap.set(datasetKey, new BarSeries(warmupBars));
      }
      this.positionManagers.set(bot.id, new PositionManager());
      this.liveExecutors.set(bot.id, new LiveExecutor(this.broker, bot.executorConfig, callbacks));
    }

    const volumeMode = (this.feed.constructor.name === 'HistoricalMockFeed') ? 'delta' : 'cumulative';
    for (const bot of this.bots) {
      const builderKey = `${bot.symbol}:${bot.interval}`;
      if (!this.candleBuilders.has(builderKey)) {
        this.candleBuilders.set(builderKey, new CandleBuilder(intervalToMs(bot.interval), volumeMode));
      }
    }

    this.feed.subscribe(Array.from(new Set(this.bots.map(b => b.symbol))), (tick) => this.enqueueTick(tick));
    this.feed.onDisconnect(() => {
      this.isRunning = false;
      if (this.syncTimer) { clearInterval(this.syncTimer); this.syncTimer = null; }
    });

    this.syncTimer = setInterval(() => {
      ReconciliationService.runReconciliation(this.bots, this.baseSeriesMap, () => this.isRunning);
    }, 300000);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    if (this.syncTimer) { clearInterval(this.syncTimer); this.syncTimer = null; }
    await this.tickPromiseChain;
    this.isRunning = false;
    await this.feed.disconnect();
  }

  private enqueueTick(tick: { symbol: string; price: number; bid?: number; ask?: number; timestamp: number; volume?: number }) {
    this.tickPromiseChain = this.tickPromiseChain.then(async () => {
      try {
        await processTickUpdate(tick.symbol, tick.price, tick.timestamp, tick.bid, tick.ask, tick.volume, this as any);
      } catch (error) {
        console.error(`Error in sequential tick queue for ${tick.symbol}:`, error);
      }
    });
  }

  async processCandle(symbol: string, intv: string, bar: Bar) {
    return processCandleClose(symbol, intv, bar, this as any);
  }
}
