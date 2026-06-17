import { LiveTradingEngine } from '../engine/LiveTradingEngine';
import { IBroker } from '../broker';
import { MemoryBroker } from '../brokers/MemoryBroker';

export const PORT = process.env.DAEMON_PORT ? parseInt(process.env.DAEMON_PORT, 10) : 8082;

export interface Settings {
  tradingMode: 'paper' | 'live';
  enabledMarkets: string[];
  candleInterval: string;
  executionMode: 'candle_close' | 'tick';
}

export const daemonState = {
  engine: null as LiveTradingEngine | null,
  currentFeed: null as any,
  currentBroker: null as IBroker | null,
  globalMemoryBroker: null as MemoryBroker | null,
  isEngineRunning: false,
  activeEngineBotsCount: 0,
  lastOpenBotsHash: ""
};
