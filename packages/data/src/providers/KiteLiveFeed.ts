import { ILiveFeed, TickCallback } from './ILiveFeed';
// @ts-ignore
import { KiteTicker } from 'kiteconnect';
import { KiteInstrumentMapper } from './KiteProvider';

export class KiteLiveFeed implements ILiveFeed {
  private ticker: any;
  private callbacks = new Map<string, Set<TickCallback>>(); // symbol -> callbacks
  private symbolToToken = new Map<string, number>();
  private tokenToSymbol = new Map<number, string>();
  private activeTokens: number[] = [];

  private isConnectingOrConnected = false;

  constructor(private apiKey: string, private accessToken: string) {}

  async connect(): Promise<void> {
    this.isConnectingOrConnected = true;

    // Ensure mapper is loaded
    await KiteInstrumentMapper.load(this.apiKey);

    this.ticker = new KiteTicker({
      api_key: this.apiKey,
      access_token: this.accessToken,
      reconnect: false, // Disable built-in autoReconnect to prevent process.exit(1) on failure
    });

    return new Promise((resolve, reject) => {
      let resolvedOrRejected = false;

      this.ticker.connect();

      this.ticker.on('connect', () => {
        console.log('Kite WebSocket connection established.');
        if (!resolvedOrRejected) {
          resolvedOrRejected = true;
          resolve();
        }
      });

      this.ticker.on('disconnect', () => {
        console.log('Kite WebSocket disconnected.');
        if (this.isConnectingOrConnected) {
          console.log('Custom Auto-Reconnect: Retrying connection in 5 seconds...');
          setTimeout(() => {
            if (this.isConnectingOrConnected) {
              try {
                this.ticker.connect();
              } catch (err: any) {
                console.error('Kite WebSocket custom reconnect attempt failed:', err.message);
              }
            }
          }, 5000);
        }
      });

      this.ticker.on('error', (err: any) => {
        console.error('Kite WebSocket error:', err.message || err);
        if (!resolvedOrRejected) {
          resolvedOrRejected = true;
          reject(err);
        }
      });

      this.ticker.on('ticks', (ticks: any[]) => {
        this.handleTicks(ticks);
      });
    });
  }

  async disconnect(): Promise<void> {
    this.isConnectingOrConnected = false;
    if (this.ticker) {
      this.ticker.disconnect();
    }
  }

  subscribe(symbols: string[], callback: TickCallback): void {
    const tokensToSubscribe: number[] = [];

    for (const symbol of symbols) {
      const token = KiteInstrumentMapper.getInstrumentToken(symbol);
      if (!token) {
        console.warn(`Could not find instrument token for symbol: ${symbol}`);
        continue;
      }

      this.symbolToToken.set(symbol, token);
      this.tokenToSymbol.set(token, symbol);

      if (!this.callbacks.has(symbol)) {
        this.callbacks.set(symbol, new Set());
      }
      this.callbacks.get(symbol)!.add(callback);

      if (!this.activeTokens.includes(token)) {
        this.activeTokens.push(token);
        tokensToSubscribe.push(token);
      }
    }

    if (this.ticker && tokensToSubscribe.length > 0) {
      this.ticker.subscribe(tokensToSubscribe);
      // Set default mode to quote (which includes LTP, volume, bid/ask)
      this.ticker.setMode(this.ticker.modeQuote, tokensToSubscribe);
    }
  }

  unsubscribe(symbols: string[]): void {
    const tokensToUnsubscribe: number[] = [];

    for (const symbol of symbols) {
      const token = this.symbolToToken.get(symbol);
      if (token) {
        this.callbacks.delete(symbol);
        this.activeTokens = this.activeTokens.filter((t) => t !== token);
        tokensToUnsubscribe.push(token);
      }
    }

    if (this.ticker && tokensToUnsubscribe.length > 0) {
      this.ticker.unsubscribe(tokensToUnsubscribe);
    }
  }

  onDisconnect(callback: () => void): void {
    if (this.ticker) {
      this.ticker.on('noreconnect', callback);
      this.ticker.on('disconnect', callback);
    }
  }

  private handleTicks(ticks: any[]) {
    for (const tick of ticks) {
      const token = tick.instrument_token;
      const symbol = this.tokenToSymbol.get(token);
      if (!symbol) continue;

      const callbacks = this.callbacks.get(symbol);
      if (!callbacks) continue;

      // Extract bid/ask from the quote depth
      const bid = tick.depth?.buy?.[0]?.price || undefined;
      const ask = tick.depth?.sell?.[0]?.price || undefined;

      const formattedTick = {
        symbol,
        price: tick.last_price,
        bid,
        ask,
        volume: tick.volume_traded || 0,
        timestamp: tick.timestamp ? new Date(tick.timestamp).getTime() : Date.now(),
      };

      for (const cb of callbacks) {
        try {
          cb(formattedTick);
        } catch (error) {
          console.error(`Error in live tick callback for ${symbol}:`, error);
        }
      }
    }
  }
}
