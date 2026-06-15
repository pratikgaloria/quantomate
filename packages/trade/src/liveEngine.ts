import { ILiveFeed, DataService, KiteDataProvider, TradierDataProvider, RoutingDataProvider } from '@quantomate/data';
import { Candle, CandleBuilder, intervalToMs } from './utils/CandleBuilder';
import { IBroker, OrderRequest, Trader, Strategy, Dataset, Quote, OptionSelector, TradePosition, StrategyValue } from '@quantomate/core';
import { SessionManager } from './sessionManager';
import { ChildDataset } from './utils/NamespacedDataset';

export interface LiveEngineConfig {
  symbols: string[];
  strategies: Strategy<any, any, any>[];
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

export class LiveTradingEngine {
  private activeTraders = new Map<string, Trader<any, any>>(); // symbol:interval:strategy -> Trader
  private baseDatasets = new Map<string, Dataset<any>>(); // symbol:interval -> Dataset
  private candleBuilders = new Map<string, CandleBuilder>(); // symbol:interval -> CandleBuilder
  private isRunning = false;
  private tickPromiseChain = Promise.resolve();
  private syncTimer: NodeJS.Timeout | null = null;
  private lastTradedCandleTimestamp = new Map<string, number>(); // symbol:interval:strategy -> timestamp

  constructor(
    private feed: ILiveFeed,
    private broker: IBroker,
    private config: LiveEngineConfig
  ) {}

  get running(): boolean {
    return this.isRunning;
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    // 0. Configure the appropriate trading data provider for DataService
    const feedName = this.feed.constructor.name;
    if (feedName === 'KiteLiveFeed') {
      const apiKey = this.config.kiteApiKey || process.env.ZERODHA_API_KEY || '';
      const accessToken = this.config.kiteAccessToken || '';
      DataService.provider = new KiteDataProvider(apiKey, accessToken);
      console.log('[Engine] Configured DataService to use KiteDataProvider');
    } else if (feedName === 'TradierLiveFeed') {
      const token = this.config.tradierAccessToken || process.env.TRADIER_API_KEY || '';
      const useSandbox = this.config.tradierUseSandbox !== undefined ? this.config.tradierUseSandbox : (process.env.TRADIER_ENV !== 'production');
      DataService.provider = new TradierDataProvider(token, useSandbox);
      console.log('[Engine] Configured DataService to use TradierDataProvider');
    } else if (feedName === 'CompositeLiveFeed') {
      const kiteApiKey = this.config.kiteApiKey || process.env.ZERODHA_API_KEY || '';
      const kiteAccessToken = this.config.kiteAccessToken || '';
      const tradierToken = this.config.tradierAccessToken || process.env.TRADIER_API_KEY || '';
      const tradierUseSandbox = this.config.tradierUseSandbox !== undefined ? this.config.tradierUseSandbox : (process.env.TRADIER_ENV !== 'production');
      
      DataService.provider = new RoutingDataProvider({
        kite: new KiteDataProvider(kiteApiKey, kiteAccessToken),
        tradier: new TradierDataProvider(tradierToken, tradierUseSandbox)
      });
      console.log('[Engine] Configured DataService to use RoutingDataProvider (Kite + Tradier)');
    }

    console.log(`Starting LiveTradingEngine for symbols: ${this.config.symbols.join(', ')}`);

    // 1. Establish connection to live stream
    await this.feed.connect();

    // 2. Initialize strategies & datasets for each symbol and required intervals
    for (const symbol of this.config.symbols) {
      for (const strategy of this.config.strategies) {
        // Only run strategy on its configured symbol
        if (strategy.symbol && strategy.symbol.toUpperCase() !== symbol.toUpperCase()) {
          continue;
        }

        const requiredIntervals = strategy.intervals && strategy.intervals.length > 0 
          ? strategy.intervals 
          : [this.config.interval || '1m'];

        for (const intv of requiredIntervals) {
          const datasetKey = `${symbol}:${intv}`;
          let baseDataset = this.baseDatasets.get(datasetKey);

          if (!baseDataset) {
            let warmupQuotes: any[] = [];
            try {
              const startDateStr = this.config.startDate || new Date().toISOString();
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

            // Initialize dataset with warm-up quotes using full Candle objects (OHLCV)
            const mappedQuotes = warmupQuotes.map(
              (q: any) => new Quote({
                open: Number(q.open),
                high: Number(q.high),
                low: Number(q.low),
                close: Number(q.close),
                volume: Number(q.volume),
                timestamp: new Date(q.date).getTime()
              }, new Date(q.date).getTime())
            );

            baseDataset = new Dataset<any>(mappedQuotes, { id: datasetKey });
            this.baseDatasets.set(datasetKey, baseDataset);
          }

          // Create a ChildDataset view wrapping the Base Dataset for this bot
          const botId = strategy.options.allocationSessionId || strategy.name;
          const childDataset = new ChildDataset<any>(botId, baseDataset);

          // Instantiate the strategy runner over this ChildDataset view
          const trader = new Trader(childDataset, strategy);
          this.activeTraders.set(`${symbol}:${intv}:${strategy.name}`, trader);
        }
      }
    }

    // 2.5 Initialize CandleBuilders for all needed symbol-interval pairs
    const volumeMode = (this.feed.constructor.name === 'HistoricalMockFeed') ? 'delta' : 'cumulative';
    for (const symbol of this.config.symbols) {
      for (const strategy of this.config.strategies) {
        if (strategy.symbol && strategy.symbol.toUpperCase() !== symbol.toUpperCase()) {
          continue;
        }

        const requiredIntervals = strategy.intervals && strategy.intervals.length > 0 
          ? strategy.intervals 
          : [this.config.interval || '1m'];

        for (const intv of requiredIntervals) {
          const builderKey = `${symbol}:${intv}`;
          if (!this.candleBuilders.has(builderKey)) {
            const intervalMs = intervalToMs(intv);
            this.candleBuilders.set(builderKey, new CandleBuilder(intervalMs, volumeMode));
          }
        }
      }
    }

    // 3. Subscribe to the feed ticks
    this.feed.subscribe(this.config.symbols, (tick) => {
      this.enqueueTick(tick);
    });

    this.feed.onDisconnect(() => {
      console.warn('LiveTradingEngine disconnected from feed.');
      this.isRunning = false;
      if (this.syncTimer) {
        clearInterval(this.syncTimer);
        this.syncTimer = null;
      }
    });

    // 4. Start periodic background reconciliation
    this.startBackgroundSync();
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    await this.tickPromiseChain;
    this.isRunning = false;
    await this.feed.disconnect();
    console.log('LiveTradingEngine stopped.');
  }

  private enqueueTick(tick: { symbol: string; price: number; bid?: number; ask?: number; timestamp: number; volume?: number }) {
    this.tickPromiseChain = this.tickPromiseChain.then(async () => {
      try {
        await this.handleTick(tick.symbol, tick.price, tick.timestamp, tick.bid, tick.ask, tick.volume);
      } catch (error) {
        console.error(`Error in sequential tick queue for ${tick.symbol}:`, error);
      }
    });
  }

  private async handleTick(
    symbol: string,
    price: number,
    timestamp: number,
    bid?: number,
    ask?: number,
    volume?: number
  ) {
    if (!this.isRunning) return;

    // Feed current price to PaperBroker if it has setLastPrice
    if (this.broker.setLastPrice) {
      this.broker.setLastPrice(symbol, price, bid, ask, timestamp);
    }

    // Feed current price to SessionManager
    SessionManager.getInstance().updateLastPrice(symbol, price);

    const mode = this.config.executionMode || 'candle_close';
    const tickVolume = volume ?? 0;

    // Process tick in all builders registered for this symbol
    for (const [builderKey, builder] of this.candleBuilders.entries()) {
      if (!builderKey.startsWith(`${symbol}:`)) {
        continue;
      }
      const [, intv] = builderKey.split(':');
      const { closedCandle, currentCandle } = builder.processTick(symbol, price, tickVolume, timestamp);

      if (mode === 'candle_close') {
        if (closedCandle) {
          await this.processCandle(symbol, intv, closedCandle);
        }
      } else {
        // 'tick' mode: update the current forming candle in the dataset
        if (closedCandle) {
          // Finalize the closed candle in dataset by overwriting the last element
          for (const strategy of this.config.strategies) {
            if (strategy.symbol && strategy.symbol.toUpperCase() !== symbol.toUpperCase()) {
              continue;
            }
            const requiredIntervals = strategy.intervals && strategy.intervals.length > 0 
              ? strategy.intervals 
              : [this.config.interval || '1m'];
            if (!requiredIntervals.includes(intv)) continue;

            const traderKey = `${symbol}:${intv}:${strategy.name}`;
            const trader = this.activeTraders.get(traderKey);
            if (!trader) continue;

            const dataset = trader.dataset;
            if (dataset.length === 0) {
              dataset.add(new Quote(closedCandle, closedCandle.timestamp));
            } else {
              const lastIndex = dataset.length - 1;
              const closedQuote = new Quote(closedCandle, closedCandle.timestamp);
              dataset.mutateAt(lastIndex, closedQuote);
              this.recalculateIndex(dataset, lastIndex, strategy, closedQuote);
            }

            // Append the new currentCandle as a new element
            dataset.add(new Quote(currentCandle, currentCandle.timestamp));
          }
        } else {
          // Within the same candle: mutate the last element
          for (const strategy of this.config.strategies) {
            if (strategy.symbol && strategy.symbol.toUpperCase() !== symbol.toUpperCase()) {
              continue;
            }
            const requiredIntervals = strategy.intervals && strategy.intervals.length > 0 
              ? strategy.intervals 
              : [this.config.interval || '1m'];
            if (!requiredIntervals.includes(intv)) continue;

            const traderKey = `${symbol}:${intv}:${strategy.name}`;
            const trader = this.activeTraders.get(traderKey);
            if (!trader) continue;

            const dataset = trader.dataset;
            if (dataset.length === 0) {
              dataset.add(new Quote(currentCandle, currentCandle.timestamp));
            } else {
              const lastIndex = dataset.length - 1;
              const currentQuote = new Quote(currentCandle, currentCandle.timestamp);
              dataset.mutateAt(lastIndex, currentQuote);
              this.recalculateIndex(dataset, lastIndex, strategy, currentQuote);
            }

            // ONLY run signal check on primary interval
            const primaryInterval = requiredIntervals[0];
            if (intv !== primaryInterval) {
              continue;
            }

            const lastIndex = dataset.length - 1;
            const strategyValue = dataset.at(lastIndex)?.getStrategy(strategy.name);
            if (strategyValue) {
              const signalValue = strategyValue.position.value;
              const isShort = !!strategyValue.position.options?.short;

              if (signalValue === 'entry' || signalValue === 'exit') {
                // Check throttle/cooldown (maximum 1 trade per candle)
                const lastTraded = this.lastTradedCandleTimestamp.get(traderKey);
                if (lastTraded === currentCandle.timestamp) {
                  continue;
                }

                console.log(`[Signal] Tick trigger (${signalValue}) for ${symbol} (${intv}) on strategy ${strategy.name}. Validating with broker REST API...`);
                const verified = await this.validateSignalWithRest(symbol, intv, strategy, trader, signalValue, currentCandle.timestamp);
                if (verified) {
                  // Update cooldown
                  this.lastTradedCandleTimestamp.set(traderKey, currentCandle.timestamp);

                  if (signalValue === 'entry') {
                    await this.executeEntry(symbol, price, strategy.name, isShort);
                  } else {
                    await this.executeExit(symbol, price, strategy.name, isShort);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private async processCandle(symbol: string, intv: string, candle: Candle) {
    for (const strategy of this.config.strategies) {
      if (strategy.symbol && strategy.symbol.toUpperCase() !== symbol.toUpperCase()) {
        continue;
      }
      const requiredIntervals = strategy.intervals && strategy.intervals.length > 0 
        ? strategy.intervals 
        : [this.config.interval || '1m'];
      if (!requiredIntervals.includes(intv)) continue;

      const traderKey = `${symbol}:${intv}:${strategy.name}`;
      const trader = this.activeTraders.get(traderKey);
      if (!trader) continue;

      try {
        // Run strategy calculations by appending the closed candle to the dataset
        const signal = await trader.tick(candle, candle.timestamp);

        // Only evaluate signal and execute trade on the primary interval close
        const primaryInterval = requiredIntervals[0];
        if (intv !== primaryInterval) {
          continue;
        }

        const isShort = !!signal.position.options?.short;

        if (signal.position.value === 'entry' || signal.position.value === 'exit') {
          // Check throttle/cooldown (maximum 1 trade per candle)
          const lastTraded = this.lastTradedCandleTimestamp.get(traderKey);
          if (lastTraded === candle.timestamp) {
            continue;
          }

          console.log(`[Signal] Closed candle trigger (${signal.position.value}) for ${symbol} (${intv}) on strategy ${strategy.name}. Validating with broker REST API...`);

          const verified = await this.validateSignalWithRest(symbol, intv, strategy, trader, signal.position.value, candle.timestamp);
          if (verified) {
            // Update cooldown
            this.lastTradedCandleTimestamp.set(traderKey, candle.timestamp);

            if (signal.position.value === 'entry') {
              await this.executeEntry(symbol, candle.close, strategy.name, isShort);
            } else if (signal.position.value === 'exit') {
              await this.executeExit(symbol, candle.close, strategy.name, isShort);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing closed candle for ${symbol} (${intv}) on strategy ${strategy.name}:`, error);
      }
    }
  }

  private async validateSignalWithRest(
    symbol: string,
    interval: string,
    strategy: Strategy<any, any, any>,
    trader: Trader<any, any>,
    localSignalValue: 'entry' | 'exit',
    closedTimestamp: number
  ): Promise<boolean> {
    try {
      console.log(`[Validation] Querying REST historical data for ${symbol} (${interval}) to verify signal`);
      const allQuotes = await DataService.getHistoricalData(symbol, undefined, interval);

      const officialCandle = allQuotes.find((q: any) => new Date(q.date).getTime() === closedTimestamp);
      if (!officialCandle) {
        console.warn(`[Validation] Official REST candle not found yet for ${symbol} (${interval}) at timestamp ${closedTimestamp}. Retrying in 1.5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const retryQuotes = await DataService.getHistoricalData(symbol, undefined, interval);
        const retryCandle = retryQuotes.find((q: any) => new Date(q.date).getTime() === closedTimestamp);
        if (!retryCandle) {
          console.warn(`[Validation] Failed to find official REST candle after retry for ${symbol} (${interval}). Using local aggregation.`);
          return true; // Fallback to local aggregation rather than failing to execute a valid signal
        }
        return this.verifyAndApplyOfficialCandle(symbol, strategy, trader, localSignalValue, retryCandle);
      }

      return this.verifyAndApplyOfficialCandle(symbol, strategy, trader, localSignalValue, officialCandle);
    } catch (err: any) {
      console.error(`[Validation] Error during REST validation for ${symbol} (${interval}):`, err.message);
      return true; // Fallback to local aggregation in case of API errors
    }
  }

  private verifyAndApplyOfficialCandle(
    symbol: string,
    strategy: Strategy<any, any, any>,
    trader: Trader<any, any>,
    localSignalValue: 'entry' | 'exit',
    officialCandle: any
  ): boolean {
    const dataset = trader.dataset;
    const lastIndex = dataset.length - 1;

    // 1. Construct the official quote
    const officialQuote = new Quote({
      open: Number(officialCandle.open),
      high: Number(officialCandle.high),
      low: Number(officialCandle.low),
      close: Number(officialCandle.close),
      volume: Number(officialCandle.volume),
      timestamp: new Date(officialCandle.date).getTime()
    }, new Date(officialCandle.date).getTime());

    // 2. Mutate the last value in dataset and recalculate indicators & strategy
    this.recalculateIndex(dataset, lastIndex, strategy, officialQuote);

    // 3. Compare official signal with local signal
    const strategyValue = dataset.at(lastIndex)?.getStrategy(strategy.name);
    const officialSignalValue = strategyValue ? strategyValue.position.value : 'idle';

    if (officialSignalValue === localSignalValue) {
      console.log(`[Validation] Signal CONFIRMED for ${symbol} via REST API.`);
      return true;
    } else {
      console.warn(`[Validation] Signal REJECTED. Local was ${localSignalValue}, but Official REST is ${officialSignalValue}.`);
      return false;
    }
  }

  private recalculateIndex(dataset: Dataset<any>, index: number, strategy: Strategy<any, any, any>, quote: Quote<any>) {
    // Apply temporary mutation to dataset so indicators can calculate over it
    dataset.mutateAt(index, quote);

    // 1. Recalculate indicators
    for (const ind of dataset.indicators) {
      const val = ind.indicator.calculate(dataset);
      quote.setIndicator(ind.name, val);
    }

    // 2. Recalculate strategy
    const lastQuote = index > 0 ? dataset.at(index - 1) : undefined;
    const lastPosition = lastQuote ? lastQuote.getStrategy(strategy.name)?.position || new TradePosition('idle') : new TradePosition('idle');

    // Context stubs implemented to query other datasets managed by the engine
    const context = {
      primaryQuote: quote,
      previousPrimaryQuote: lastQuote,
      getQuote: (datasetId: string) => {
        for (const [, trader] of this.activeTraders.entries()) {
          if (trader.dataset.id === datasetId) {
            return trader.dataset.at(-1);
          }
        }
        return undefined;
      },
      getQuoteBefore: (datasetId: string) => {
        for (const [, trader] of this.activeTraders.entries()) {
          if (trader.dataset.id === datasetId) {
            const len = trader.dataset.length;
            return len > 1 ? trader.dataset.at(len - 2) : undefined;
          }
        }
        return undefined;
      }
    };

    const newPosition = strategy.apply(quote, lastPosition, context).position;
    const updatedPosition = TradePosition.update(lastPosition, newPosition);

    quote.setStrategy(strategy.name, new StrategyValue(updatedPosition));

    // Apply finalized mutation with calculated indicators & strategy values
    dataset.mutateAt(index, quote);
  }

  private async executeEntry(symbol: string, currentPrice: number, strategyName: string, isShort: boolean) {
    let orderSymbol = symbol;

    const strategy = this.config.strategies.find((s) => s.name === strategyName);
    if (!strategy) return;
    const shouldTradeOptions = strategy.options.tradeOptions ?? false;
    const selector = strategy.options.optionSelector;

    if (shouldTradeOptions && this.config.resolveOptionSymbol) {
      const optionType = isShort ? 'PE' : 'CE';
      const resolved = await this.config.resolveOptionSymbol(symbol, optionType, currentPrice, selector);
      if (resolved) {
        orderSymbol = resolved;
        console.log(`[OptionMapper] Mapped entry signal on ${symbol} to option: ${orderSymbol}`);
      } else {
        console.warn(`[OptionMapper] Could not find option contract matching selector for ${symbol} at price ${currentPrice}`);
        return;
      }
    }

    const positions = await this.broker.getPositions();
    const hasPosition = positions.some((pos) => {
      if (pos.symbol !== orderSymbol) return false;
      if (shouldTradeOptions) return pos.qty > 0;
      return isShort ? pos.qty < 0 : pos.qty > 0;
    });

    if (hasPosition) {
      return; // Already in position
    }

    console.log(`[Signal] Entry triggered for ${orderSymbol} by strategy ${strategyName} at price ${currentPrice}`);

    const account = await this.broker.getAccountInfo();
    const allocation = shouldTradeOptions ? 0.05 : 0.95;

    // SIZING & CAPITAL CHECKS VIA SESSION MANAGER
    const sessionId = strategy.options.allocationSessionId;
    let targetCapital = account.cashBalance;

    if (sessionId) {
      targetCapital = SessionManager.getInstance().getVirtualCash(sessionId);
    }

    const tradeCapital = targetCapital * allocation;

    // Determine target premium/stock price for sizing
    let tradePrice = currentPrice;
    if (shouldTradeOptions && 'lastPrices' in (this.broker as any)) {
      tradePrice = (this.broker as any).lastPrices?.get(orderSymbol) || 100; // default to 100 premium if not ticked yet
    }

    const qty = Math.floor(tradeCapital / tradePrice);

    if (qty <= 0) {
      console.warn(`Position sizing computed quantity 0 for ${orderSymbol} (allocation capital: INR ${tradeCapital})`);
      return;
    }

    const requiredCapital = qty * tradePrice;

    // Run constraint checks in SessionManager
    if (sessionId) {
      const preTradeCheck = SessionManager.getInstance().canPlaceOrder(
        sessionId,
        requiredCapital,
        account.cashBalance
      );
      if (!preTradeCheck.allowed) {
        console.warn(`[SessionManager] Blocked order for ${orderSymbol}: ${preTradeCheck.reason}`);
        return;
      }
    }

    const side = (isShort && !shouldTradeOptions) ? 'sell' : 'buy';
    const orderReq: OrderRequest = {
      symbol: orderSymbol,
      qty,
      side,
      type: 'market',
    };

    try {
      const res = await this.broker.placeOrder(orderReq);
      console.log(`[Order] Successfully entered ${orderSymbol} (Qty: ${qty}) - Order ID: ${res.id}`);

      // Record fill in SessionManager
      if (sessionId) {
        const fillPrice = res.avgFillPrice || tradePrice;
        const fillQty = res.filledQty || qty;
        const commission = res.commissionPaid || 0;
        await SessionManager.getInstance().recordFill(
          sessionId,
          orderSymbol,
          side,
          fillQty,
          fillPrice,
          commission
        );
      }
    } catch (err) {
      console.error(`[Order] Failed to enter position for ${orderSymbol}:`, err);
    }
  }

  private async executeExit(symbol: string, currentPrice: number, strategyName: string, isShort: boolean) {
    let orderSymbol = symbol;

    const strategy = this.config.strategies.find((s) => s.name === strategyName);
    if (!strategy) return;
    const shouldTradeOptions = strategy.options.tradeOptions ?? false;

    if (shouldTradeOptions && this.config.resolveOptionSymbol) {
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
    const openPosition = positions.find((pos) => {
      if (pos.symbol !== orderSymbol) return false;
      if (shouldTradeOptions) return pos.qty > 0;
      return isShort ? pos.qty < 0 : pos.qty > 0;
    });

    if (!openPosition) {
      return; // No position to exit
    }

    console.log(`[Signal] Exit triggered for ${orderSymbol} by strategy ${strategyName} at price ${currentPrice}`);

    const exitSide = (isShort && !shouldTradeOptions) ? 'buy' : 'sell';
    const exitQty = Math.abs(openPosition.qty);
    const orderReq: OrderRequest = {
      symbol: orderSymbol,
      qty: exitQty,
      side: exitSide,
      type: 'market',
    };

    try {
      const res = await this.broker.placeOrder(orderReq);
      console.log(`[Order] Successfully exited ${orderSymbol} (Qty: ${exitQty}) - Order ID: ${res.id}`);

      // Record fill in SessionManager
      const sessionId = strategy.options.allocationSessionId;
      if (sessionId) {
        const fillPrice = res.avgFillPrice || currentPrice;
        const fillQty = res.filledQty || exitQty;
        const commission = res.commissionPaid || 0;
        await SessionManager.getInstance().recordFill(
          sessionId,
          orderSymbol,
          exitSide,
          fillQty,
          fillPrice,
          commission
        );
      }
    } catch (err) {
      console.error(`[Order] Failed to exit position for ${orderSymbol}:`, err);
    }
  }

  private startBackgroundSync() {
    // Run background sync every 5 minutes
    this.syncTimer = setInterval(() => {
      this.runReconciliation();
    }, 5 * 60 * 1000);
  }

  private runReconciliation() {
    console.log('[BackgroundSync] Starting periodic dataset reconciliation...');
    let delay = 0;

    for (const symbol of this.config.symbols) {
      const activeIntervals = new Set<string>();
      for (const strategy of this.config.strategies) {
        if (strategy.symbol && strategy.symbol.toUpperCase() !== symbol.toUpperCase()) {
          continue;
        }
        const requiredIntervals = strategy.intervals && strategy.intervals.length > 0 
          ? strategy.intervals 
          : [this.config.interval || '1m'];
        for (const intv of requiredIntervals) {
          activeIntervals.add(intv);
        }
      }

      for (const intv of activeIntervals) {
        setTimeout(async () => {
          if (!this.isRunning) return;
          try {
            console.log(`[BackgroundSync] Reconciling ${symbol} (${intv})...`);
            const allQuotes = await DataService.getHistoricalData(symbol, 5, intv);
            if (!allQuotes || allQuotes.length === 0) return;

            // Align the last 5 candles in memory
            for (const strategy of this.config.strategies) {
              if (strategy.symbol && strategy.symbol.toUpperCase() !== symbol.toUpperCase()) {
                continue;
              }
              const requiredIntervals = strategy.intervals && strategy.intervals.length > 0 
                ? strategy.intervals 
                : [this.config.interval || '1m'];
              if (!requiredIntervals.includes(intv)) continue;

              const traderKey = `${symbol}:${intv}:${strategy.name}`;
              const trader = this.activeTraders.get(traderKey);
              if (!trader) continue;

              const dataset = trader.dataset;
              if (dataset.length === 0) continue;

              // Loop backwards over the last 5 official quotes and mutate dataset matching them
              for (let i = 0; i < Math.min(5, allQuotes.length); i++) {
                const officialCandle = allQuotes[allQuotes.length - 1 - i];
                const officialTs = new Date(officialCandle.date).getTime();

                // Find index in dataset
                let datasetIndex = -1;
                for (let idx = dataset.length - 1; idx >= Math.max(0, dataset.length - 10); idx--) {
                  if (dataset.at(idx)?.timestamp === officialTs) {
                    datasetIndex = idx;
                    break;
                  }
                }

                if (datasetIndex !== -1) {
                  const officialQuote = new Quote({
                    open: Number(officialCandle.open),
                    high: Number(officialCandle.high),
                    low: Number(officialCandle.low),
                    close: Number(officialCandle.close),
                    volume: Number(officialCandle.volume),
                    timestamp: officialTs
                  }, officialTs);

                  this.recalculateIndex(dataset, datasetIndex, strategy, officialQuote);
                }
              }
            }
          } catch (err: any) {
            console.error(`[BackgroundSync] Failed reconciling ${symbol} (${intv}):`, err.message);
          }
        }, delay);

        delay += 5000; // Stagger requests by 5 seconds
      }
    }
  }
}
