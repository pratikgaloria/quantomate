import { ILiveFeed, DataService } from '@quantomate/data';
import { IBroker, OrderRequest, Trader, Strategy, Dataset, Quote } from '@quantomate/core';

export interface LiveEngineConfig {
  symbols: string[];
  strategies: Strategy<any, any, any>[];
  initialCapital?: number;
  resolveOptionSymbol?: (underlying: string, optionType: 'CE' | 'PE', underlyingPrice: number) => Promise<string | undefined> | string | undefined;
  interval?: string;
  startDate?: string;
}

export class LiveTradingEngine {
  private activeTraders = new Map<string, Trader>(); // symbol:strategy -> Trader
  private isRunning = false;
  private tickPromiseChain = Promise.resolve();

  constructor(
    private feed: ILiveFeed,
    private broker: IBroker,
    private config: LiveEngineConfig
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log(`Starting LiveTradingEngine for symbols: ${this.config.symbols.join(', ')}`);

    // 1. Establish connection to live stream
    await this.feed.connect();

    // 2. Initialize strategies & datasets for each symbol
    for (const symbol of this.config.symbols) {
      let warmupQuotes: any[] = [];
      if (this.config.interval) {
        try {
          const interval = this.config.interval;
          const startDateStr = this.config.startDate || new Date().toISOString();
          const warmupDays = interval === '1d' ? 100 : 30;
          const warmupStartDate = new Date(startDateStr);
          warmupStartDate.setDate(warmupStartDate.getDate() - warmupDays);
          const startLimit = warmupStartDate.getTime();
          const endLimit = new Date(startDateStr).getTime();

          console.log(`[Warm-up] Fetching historical warm-up quotes for ${symbol} (${interval})`);
          const allQuotes = await DataService.getHistoricalData(symbol, undefined, interval);
          
          warmupQuotes = allQuotes.filter((q: any) => {
            const qTime = new Date(q.date).getTime();
            return qTime >= startLimit && qTime < endLimit;
          });
          console.log(`[Warm-up] Loaded ${warmupQuotes.length} warm-up quotes for ${symbol}`);
        } catch (err: any) {
          console.warn(`[Warm-up] Failed to load warm-up data for ${symbol}: ${err.message}`);
        }
      }

      for (const strategy of this.config.strategies) {
        // Initialize dataset with warm-up quotes
        const mappedQuotes = warmupQuotes.map(
          (q: any) => new Quote(Number(q.close), new Date(q.date).getTime())
        );
        const dataset = new Dataset<number>(mappedQuotes, { id: symbol });
        const trader = new Trader(dataset, strategy);
        this.activeTraders.set(`${symbol}:${strategy.name}`, trader);
      }
    }

    // 3. Subscribe to the feed ticks
    this.feed.subscribe(this.config.symbols, (tick) => {
      this.enqueueTick(tick);
    });

    this.feed.onDisconnect(() => {
      console.warn('LiveTradingEngine disconnected from feed.');
      this.isRunning = false;
    });
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    await this.tickPromiseChain;
    this.isRunning = false;
    await this.feed.disconnect();
    console.log('LiveTradingEngine stopped.');
  }

  private enqueueTick(tick: { symbol: string; price: number; bid?: number; ask?: number; timestamp: number }) {
    this.tickPromiseChain = this.tickPromiseChain.then(async () => {
      try {
        await this.handleTick(tick.symbol, tick.price, tick.timestamp, tick.bid, tick.ask);
      } catch (error) {
        console.error(`Error in sequential tick queue for ${tick.symbol}:`, error);
      }
    });
  }

  private async handleTick(symbol: string, price: number, timestamp: number, bid?: number, ask?: number) {
    if (!this.isRunning) return;

    // Feed current price to PaperBroker if it has setLastPrice
    if (this.broker.setLastPrice) {
      this.broker.setLastPrice(symbol, price, bid, ask, timestamp);
    }

    for (const strategy of this.config.strategies) {
      const traderKey = `${symbol}:${strategy.name}`;
      const trader = this.activeTraders.get(traderKey);
      if (!trader) continue;

      try {
        // Process tick in Strategy & Dataset
        const signal = await trader.tick(price, timestamp);
        const isShort = !!signal.position.options?.short;

        // Evaluate signal value: 'entry' or 'exit'
        if (signal.position.value === 'entry') {
          await this.executeEntry(symbol, price, strategy.name, isShort);
        } else if (signal.position.value === 'exit') {
          await this.executeExit(symbol, price, strategy.name, isShort);
        }
      } catch (error) {
        console.error(`Error processing tick for ${symbol} on strategy ${strategy.name}:`, error);
      }
    }
  }

  private async executeEntry(symbol: string, currentPrice: number, strategyName: string, isShort: boolean) {
    let orderSymbol = symbol;

    if (this.config.resolveOptionSymbol) {
      const optionType = isShort ? 'PE' : 'CE';
      const resolved = await this.config.resolveOptionSymbol(symbol, optionType, currentPrice);
      if (resolved) {
        orderSymbol = resolved;
        console.log(`[OptionMapper] Mapped entry signal on ${symbol} to ATM ${optionType} option: ${orderSymbol}`);
      } else {
        console.warn(`[OptionMapper] Could not find ATM option contract for ${symbol} at price ${currentPrice}`);
        return;
      }
    }

    const positions = await this.broker.getPositions();
    const hasPosition = positions.some((pos) => pos.symbol === orderSymbol && pos.qty > 0);

    if (hasPosition) {
      return; // Already in position
    }

    console.log(`[Signal] Entry triggered for ${orderSymbol} by strategy ${strategyName} at price ${currentPrice}`);

    const account = await this.broker.getAccountInfo();
    const allocation = this.config.resolveOptionSymbol ? 0.05 : 1.0;
    const tradeCapital = account.cashBalance * allocation;
    
    // Determine option premium price for sizing
    let optionPrice = currentPrice;
    if (this.config.resolveOptionSymbol && 'lastPrices' in (this.broker as any)) {
      optionPrice = (this.broker as any).lastPrices?.get(orderSymbol) || 100; // default to 100 premium if not ticked yet
    }
    
    const qty = Math.floor(tradeCapital / optionPrice);

    if (qty <= 0) {
      console.warn(`Position sizing computed quantity 0 for ${orderSymbol} (allocation capital: INR ${tradeCapital})`);
      return;
    }

    const orderReq: OrderRequest = {
      symbol: orderSymbol,
      qty,
      side: 'buy',
      type: 'market',
    };

    try {
      const res = await this.broker.placeOrder(orderReq);
      console.log(`[Order] Successfully entered ${orderSymbol} (Qty: ${qty}) - Order ID: ${res.id}`);
    } catch (err) {
      console.error(`[Order] Failed to enter position for ${orderSymbol}:`, err);
    }
  }

  private async executeExit(symbol: string, currentPrice: number, strategyName: string, isShort: boolean) {
    let orderSymbol = symbol;

    if (this.config.resolveOptionSymbol) {
      const prefix = (symbol.toUpperCase().includes('NIFTY 50') || symbol.toUpperCase() === 'NIFTY') ? 'NIFTY' :
                     (symbol.toUpperCase().includes('BANK') || symbol.toUpperCase() === 'BANKNIFTY') ? 'BANKNIFTY' :
                     symbol.toUpperCase();
      const suffix = isShort ? 'PE' : 'CE';
      const usSuffix = isShort ? 'P' : 'C';
      
      const positions = await this.broker.getPositions();
      const openPosition = positions.find(
        (pos) => {
          const posSym = pos.symbol.toUpperCase();
          const isIndianMatch = posSym.startsWith(prefix) && posSym.endsWith(suffix);
          const isUSMatch = posSym.startsWith(prefix) && (
            posSym.substring(prefix.length + 6, prefix.length + 7) === usSuffix
          );
          return (isIndianMatch || isUSMatch) && pos.qty > 0;
        }
      );
      if (openPosition) {
        orderSymbol = openPosition.symbol;
        console.log(`[OptionMapper] Mapped exit signal on ${symbol} to active position: ${orderSymbol}`);
      } else {
        return; // No active position to close
      }
    }

    const positions = await this.broker.getPositions();
    const openPosition = positions.find((pos) => pos.symbol === orderSymbol && pos.qty > 0);

    if (!openPosition) {
      return; // No position to exit
    }

    console.log(`[Signal] Exit triggered for ${orderSymbol} by strategy ${strategyName} at price ${currentPrice}`);

    const orderReq: OrderRequest = {
      symbol: orderSymbol,
      qty: openPosition.qty,
      side: 'sell',
      type: 'market',
    };

    try {
      const res = await this.broker.placeOrder(orderReq);
      console.log(`[Order] Successfully exited ${orderSymbol} (Qty: ${openPosition.qty}) - Order ID: ${res.id}`);
    } catch (err) {
      console.error(`[Order] Failed to exit position for ${orderSymbol}:`, err);
    }
  }
}
