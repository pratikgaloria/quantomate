import { ILiveFeed, TickCallback } from './ILiveFeed';
import { DataService } from '../DataService';

export interface HistoricalMockFeedConfig {
  startDate: string;
  endDate: string;
  interval: string;
  speedMs: number; // milliseconds between ticks
  symbols: string[];
}

export class HistoricalMockFeed implements ILiveFeed {
  private callbacks = new Map<string, Set<TickCallback>>();
  private isConnected = false;
  private onDisconnectCallback?: () => void;
  private timeoutId?: NodeJS.Timeout;
  private tickQueue: any[] = [];

  get queueLength(): number {
    return this.tickQueue.length;
  }
  private currentQueueIndex = 0;
  private onLogCallback?: (msg: string) => void;
  private onFinishedCallback?: () => void;
  private onTickProcessedCallback?: (tick: any) => void;
  private isPaused = false;
  
  constructor(
    private config: HistoricalMockFeedConfig, 
    public onLog?: (msg: string) => void, 
    public onFinished?: () => void,
    public onTickProcessed?: (tick: any) => void
  ) {
    this.onLogCallback = onLog;
    this.onFinishedCallback = onFinished;
    this.onTickProcessedCallback = onTickProcessed;
  }

  async connect(): Promise<void> {
    this.isConnected = true;
    this.log(`HistoricalMockFeed connected.`);
    await this.loadData();
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.stopPlayback();
    this.log(`HistoricalMockFeed disconnected.`);
  }

  subscribe(symbols: string[], callback: TickCallback): void {
    this.log(`Subscribing to symbols: ${symbols.join(', ')}`);
    for (const symbol of symbols) {
      if (!this.callbacks.has(symbol)) {
        this.callbacks.set(symbol, new Set());
      }
      this.callbacks.get(symbol)!.add(callback);
    }

    // Start play immediately (data is already loaded)
    this.startPlayback();
  }

  unsubscribe(symbols: string[]): void {
    for (const symbol of symbols) {
      this.callbacks.delete(symbol);
    }
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  /**
   * Adjust simulation speed dynamically
   */
  setSpeedMs(speedMs: number) {
    this.config.speedMs = speedMs;
    this.log(`Simulation speed adjusted to ${speedMs}ms per tick.`);
  }

  /**
   * Pause playback
   */
  pause() {
    if (this.isPaused) return;
    this.isPaused = true;
    this.stopPlayback();
    this.log(`Simulation paused.`);
  }

  /**
   * Resume playback
   */
  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.log(`Simulation resumed.`);
    this.startPlayback();
  }

  private log(msg: string) {
    if (this.onLogCallback) {
      this.onLogCallback(msg);
    } else {
      console.log(`[HistoricalMockFeed] ${msg}`);
    }
  }

  private async loadData() {
    try {
      this.log(`Loading historical data for simulation...`);
      const allQuotes: any[] = [];
      const symbols = this.config.symbols || [];

      for (const symbol of symbols) {
        // Fetch historical data
        const start = new Date(this.config.startDate);
        const end = new Date(this.config.endDate);

        // Fetch using DataService
        const history = await DataService.getHistoricalData(symbol, undefined, this.config.interval);
        
        const filtered = history.filter((item: any) => {
          const itemDate = new Date(item.date);
          return itemDate >= start && itemDate <= end;
        });

        this.log(`Loaded ${filtered.length} bars for ${symbol}`);

        for (const bar of filtered) {
          allQuotes.push({
            symbol,
            price: Number(bar.close),
            bid: Number(bar.close) * 0.9998, // simulate spread
            ask: Number(bar.close) * 1.0002,
            volume: Number(bar.volume),
            timestamp: new Date(bar.date).getTime(),
          });
        }
      }

      // Sort all quotes chronologically
      allQuotes.sort((a, b) => a.timestamp - b.timestamp);
      this.tickQueue = allQuotes;
      this.currentQueueIndex = 0;
      this.log(`Total quotes in queue: ${this.tickQueue.length}.`);
    } catch (err: any) {
      this.log(`Error loading historical data: ${err.message}`);
      if (this.onFinishedCallback) this.onFinishedCallback();
    }
  }

  private startPlayback() {
    this.stopPlayback();

    const playNext = () => {
      if (!this.isConnected) return;
      
      if (this.currentQueueIndex >= this.tickQueue.length) {
        this.log(`Simulation complete. All ticks processed.`);
        this.stopPlayback();
        if (this.onFinishedCallback) {
          this.onFinishedCallback();
        }
        return;
      }

      const tick = this.tickQueue[this.currentQueueIndex++];
      const callbacks = this.callbacks.get(tick.symbol);
      if (callbacks) {
        for (const cb of callbacks) {
          try {
            cb(tick);
          } catch (error) {
            console.error(`Error in tick callback during simulation:`, error);
          }
        }
      }

      if (this.onTickProcessedCallback) {
        this.onTickProcessedCallback(tick);
      }

      // Schedule next tick
      this.timeoutId = setTimeout(playNext, this.config.speedMs);
    };

    this.timeoutId = setTimeout(playNext, this.config.speedMs);
  }

  private stopPlayback() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
