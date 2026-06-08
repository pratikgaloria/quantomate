import { HistoricalMockFeed, MemoryBroker } from '@quantomate/data';
import { LiveTradingEngine } from '@quantomate/trade';
import { createStrategy } from './backtestRunner';
import { BrokerAccount, BrokerPosition, OrderResult } from '@quantomate/core';

export interface SimulationSession {
  id: string;
  symbol: string;
  strategyId: string;
  parameters: Record<string, any>;
  startDate: string;
  endDate: string;
  interval: string;
  speedMs: number;
  status: 'running' | 'paused' | 'completed' | 'stopped';
  progress: {
    current: number;
    total: number;
  };
  logs: string[];
  prices: { timestamp: number; price: number }[];
  initialCapital: number;
  feed: HistoricalMockFeed;
  broker: MemoryBroker;
  engine: LiveTradingEngine;
}

class SimulationManager {
  private activeSession: SimulationSession | null = null;

  async start(config: {
    symbol: string;
    strategyId: string;
    parameters: Record<string, any>;
    startDate: string;
    endDate: string;
    interval: string;
    speedMs: number;
    initialCapital: number;
  }): Promise<SimulationSession> {
    // Stop any existing simulation
    if (this.activeSession) {
      await this.stop();
    }

    const { symbol, strategyId, parameters, startDate, endDate, interval, speedMs, initialCapital } = config;
    const sessionId = `sim-${Date.now()}`;
    const accountName = `Sim-${symbol}-${strategyId}`;
    
    const logs: string[] = [];
    const prices: { timestamp: number; price: number }[] = [];
    
    const log = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString();
      logs.push(`[${timestamp}] ${msg}`);
      console.log(`[Simulation][${sessionId}] ${msg}`);
    };

    log(`Initializing simulation for ${symbol} using ${strategyId}...`);

    // 1. Create Memory Broker
    const broker = new MemoryBroker(accountName, initialCapital, 20);

    // 2. Create Historical Mock Feed
    const feed = new HistoricalMockFeed(
      {
        startDate,
        endDate,
        interval,
        speedMs,
        symbols: [symbol],
      },
      (feedLogMsg: string) => {
        log(feedLogMsg);
      },
      () => {
        // Finished callback
        if (this.activeSession && this.activeSession.id === sessionId) {
          this.activeSession.status = 'completed';
          log('Simulation completed successfully.');
          this.activeSession.engine.stop().catch(err => {
            log(`Error stopping engine: ${err.message}`);
          });
        }
      },
      (tick: { symbol: string; price: number; timestamp: number }) => {
        // Intercept ticks to populate progress and prices
        if (this.activeSession && this.activeSession.id === sessionId) {
          this.activeSession.progress.current++;
          if (!this.activeSession.progress.total || this.activeSession.progress.total === 0) {
            this.activeSession.progress.total = feed.queueLength;
          }
          prices.push({
            timestamp: tick.timestamp,
            price: tick.price,
          });
        }
      }
    );

    // 3. Instantiate the strategy using helper
    const strategy = createStrategy(strategyId, parameters);

    // 4. Create Live Trading Engine
    const engine = new LiveTradingEngine(feed, broker, {
      symbols: [symbol],
      strategies: [strategy],
      interval,
      startDate,
    });

    const session: SimulationSession = {
      id: sessionId,
      symbol,
      strategyId,
      parameters,
      startDate,
      endDate,
      interval,
      speedMs,
      status: 'running',
      progress: {
        current: 0,
        total: 0, // will be updated when feed starts playback
      },
      logs,
      prices,
      initialCapital,
      feed,
      broker,
      engine,
    };

    this.activeSession = session;

    // Start engine in background (it will connect feed and start subscribe flow)
    engine.start()
      .then(() => {
        const totalTicks = feed.queueLength;
        session.progress.total = totalTicks;
        log(`LiveTradingEngine started with ${totalTicks} ticks to process.`);
      })
      .catch((error) => {
        log(`Engine startup failed: ${error.message}`);
        session.status = 'stopped';
      });

    return session;
  }

  async pause(): Promise<boolean> {
    if (!this.activeSession || this.activeSession.status !== 'running') {
      return false;
    }
    this.activeSession.status = 'paused';
    this.activeSession.feed.pause();
    return true;
  }

  async resume(): Promise<boolean> {
    if (!this.activeSession || this.activeSession.status !== 'paused') {
      return false;
    }
    this.activeSession.status = 'running';
    this.activeSession.feed.resume();
    return true;
  }

  async stop(): Promise<boolean> {
    if (!this.activeSession) return false;
    
    this.activeSession.status = 'stopped';
    this.activeSession.feed.disconnect().catch(() => {});
    await this.activeSession.engine.stop().catch(() => {});
    
    this.activeSession.logs.push(`[${new Date().toLocaleTimeString()}] Simulation stopped by user.`);
    return true;
  }

  async setSpeed(speedMs: number): Promise<boolean> {
    if (!this.activeSession) return false;
    this.activeSession.speedMs = speedMs;
    this.activeSession.feed.setSpeedMs(speedMs);
    return true;
  }

  async getStatus(): Promise<any> {
    if (!this.activeSession) {
      return { status: 'idle' };
    }

    const { broker } = this.activeSession;
    let accountInfo: BrokerAccount;
    let positions: BrokerPosition[] = [];
    let orders: OrderResult[] = [];

    try {
      accountInfo = await broker.getAccountInfo();
      positions = await broker.getPositions();
      orders = await broker.getOrders();
    } catch (e: any) {
      console.error('Error fetching broker info for simulation:', e);
      accountInfo = {
        accountId: 'unknown',
        cashBalance: this.activeSession.initialCapital,
        portfolioValue: this.activeSession.initialCapital,
        marginBuyingPower: this.activeSession.initialCapital,
        currency: 'INR',
        isPaper: true,
      };
    }

    return {
      id: this.activeSession.id,
      symbol: this.activeSession.symbol,
      strategyId: this.activeSession.strategyId,
      parameters: this.activeSession.parameters,
      startDate: this.activeSession.startDate,
      endDate: this.activeSession.endDate,
      interval: this.activeSession.interval,
      speedMs: this.activeSession.speedMs,
      status: this.activeSession.status,
      progress: this.activeSession.progress,
      logs: this.activeSession.logs,
      prices: this.activeSession.prices,
      initialCapital: this.activeSession.initialCapital,
      accountInfo,
      positions,
      orders,
    };
  }
}

export const simulationManager = new SimulationManager();
