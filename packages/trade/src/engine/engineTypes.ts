import { Strategy as V2Strategy, OptionSelector } from '@quantomate/core';
import { ExecutorConfig } from '../executor';

export interface BotConfig {
  id: string;
  strategy: V2Strategy;
  symbol: string;
  symbols: string[];
  interval: string;
  executorConfig: ExecutorConfig;
}

export interface LiveEngineConfig {
  bots: BotConfig[];
  initialCapital?: number;
  resolveOptionSymbol?: (
    underlying: string,
    optionType: 'CE' | 'PE',
    underlyingPrice: number,
    selector?: OptionSelector
  ) => Promise<string | undefined> | string | undefined;
  interval?: string;
  startDate?: string;
  executionMode?: 'candle_close' | 'tick';
  kiteApiKey?: string;
  kiteAccessToken?: string;
  tradierAccessToken?: string;
  tradierUseSandbox?: boolean;
}
