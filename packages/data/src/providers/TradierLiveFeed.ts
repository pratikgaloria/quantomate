import { ILiveFeed, TickCallback } from './ILiveFeed';

export class TradierLiveFeed implements ILiveFeed {
  private accessToken: string;
  private useSandbox: boolean;
  private socket: any = null;
  private sessionId: string = '';
  private callbacks = new Map<string, Set<TickCallback>>();
  private isConnectingOrConnected = false;
  private disconnectCallback?: () => void;
  private lastPrices = new Map<string, any>(); // Cache of last known ticks for merging trade/quote data

  constructor(accessToken?: string, useSandbox?: boolean) {
    this.accessToken = accessToken || process.env.TRADIER_API_KEY || '';
    this.useSandbox = useSandbox !== undefined ? useSandbox : process.env.TRADIER_ENV !== 'production';
  }

  async connect(): Promise<void> {
    if (this.isConnectingOrConnected) return;
    this.isConnectingOrConnected = true;

    const baseUrl = this.useSandbox ? 'https://sandbox.tradier.com/v1' : 'https://api.tradier.com/v1';

    try {
      console.log(`[TradierLiveFeed] Requesting streaming session...`);
      const response = await fetch(`${baseUrl}/markets/events/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Session request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = (await response.json()) as any;
      if (!data.stream || !data.stream.url || !data.stream.sessionid) {
        throw new Error(`Invalid session response structure: ${JSON.stringify(data)}`);
      }

      this.sessionId = data.stream.sessionid;
      const socketUrl = `${data.stream.url}?sessionid=${this.sessionId}`;

      console.log(`[TradierLiveFeed] Connecting to WebSocket: ${data.stream.url}`);

      return new Promise<void>((resolve, reject) => {
        let resolvedOrRejected = false;

        // @ts-ignore
        this.socket = new WebSocket(socketUrl);

        this.socket.onopen = () => {
          console.log('[TradierLiveFeed] WebSocket connection established.');
          resolvedOrRejected = true;
          resolve();

          // Resubscribe to existing symbols if we reconnected
          if (this.callbacks.size > 0) {
            this.sendSubscription();
          }
        };

        this.socket.onmessage = (event: any) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (err: any) {
            console.error('[TradierLiveFeed] Error parsing WebSocket message:', err.message);
          }
        };

        this.socket.onclose = () => {
          console.log('[TradierLiveFeed] WebSocket disconnected.');
          if (this.disconnectCallback) {
            this.disconnectCallback();
          }

          // Reconnect logic if not explicitly disconnected by user
          if (this.isConnectingOrConnected) {
            console.log('[TradierLiveFeed] Auto-reconnecting in 5 seconds...');
            setTimeout(() => {
              if (this.isConnectingOrConnected) {
                this.isConnectingOrConnected = false;
                this.connect().catch((err) => {
                  console.error('[TradierLiveFeed] Auto-reconnect failed:', err.message);
                });
              }
            }, 5000);
          }
        };

        this.socket.onerror = (err: any) => {
          console.error('[TradierLiveFeed] WebSocket error:', err.message || err);
          if (!resolvedOrRejected) {
            resolvedOrRejected = true;
            reject(err);
          }
        };
      });
    } catch (err: any) {
      this.isConnectingOrConnected = false;
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    this.isConnectingOrConnected = false;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  subscribe(symbols: string[], callback: TickCallback): void {
    let newSubscriptions = false;

    for (const symbol of symbols) {
      const upperSymbol = symbol.toUpperCase();
      if (!this.callbacks.has(upperSymbol)) {
        this.callbacks.set(upperSymbol, new Set());
        newSubscriptions = true;
      }
      this.callbacks.get(upperSymbol)!.add(callback);
    }

    if (newSubscriptions && this.socket && this.socket.readyState === 1 /* OPEN */) {
      this.sendSubscription();
    }
  }

  unsubscribe(symbols: string[]): void {
    let removedSubscriptions = false;

    for (const symbol of symbols) {
      const upperSymbol = symbol.toUpperCase();
      if (this.callbacks.has(upperSymbol)) {
        this.callbacks.delete(upperSymbol);
        this.lastPrices.delete(upperSymbol);
        removedSubscriptions = true;
      }
    }

    if (removedSubscriptions && this.socket && this.socket.readyState === 1 /* OPEN */) {
      this.sendSubscription();
    }
  }

  onDisconnect(callback: () => void): void {
    this.disconnectCallback = callback;
  }

  private sendSubscription(): void {
    if (!this.socket || this.socket.readyState !== 1 /* OPEN */) return;

    const payload = {
      symbols: Array.from(this.callbacks.keys()),
      sessionid: this.sessionId,
      linebreak: true,
    };

    console.log(`[TradierLiveFeed] Subscribing to: ${payload.symbols.join(', ')}`);
    this.socket.send(JSON.stringify(payload));
  }

  private handleMessage(message: any): void {
    if (!message || !message.symbol) return;

    const symbol = message.symbol.toUpperCase();
    const callbacks = this.callbacks.get(symbol);
    if (!callbacks || callbacks.size === 0) return;

    const cached = this.lastPrices.get(symbol) || {
      price: 0,
      bid: undefined,
      ask: undefined,
      volume: 0,
      timestamp: Date.now(),
    };

    if (message.type === 'quote') {
      cached.bid = message.bid !== undefined ? Number(message.bid) : cached.bid;
      cached.ask = message.ask !== undefined ? Number(message.ask) : cached.ask;
      cached.timestamp = Number(message.askdate || message.biddate || Date.now());
      if (cached.bid !== undefined && cached.ask !== undefined && !cached.price) {
        cached.price = (cached.bid + cached.ask) / 2;
      }
    } else if (message.type === 'trade') {
      cached.price = message.price !== undefined ? Number(message.price) : (message.last !== undefined ? Number(message.last) : cached.price);
      cached.volume = message.cvol !== undefined ? Number(message.cvol) : cached.volume;
      cached.timestamp = Number(message.date || Date.now());
    } else {
      // Ignore other event types (like summaries) unless they contain price data
      return;
    }

    this.lastPrices.set(symbol, cached);

    const formattedTick = {
      symbol,
      price: cached.price,
      bid: cached.bid,
      ask: cached.ask,
      volume: cached.volume,
      timestamp: cached.timestamp,
    };

    for (const cb of callbacks) {
      try {
        cb(formattedTick);
      } catch (err) {
        console.error(`[TradierLiveFeed] Error in subscriber callback for ${symbol}:`, err);
      }
    }
  }
}
