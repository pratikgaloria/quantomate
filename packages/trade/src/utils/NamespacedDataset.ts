import {
  Dataset,
  Quote,
  IndicatorMetadata,
  StrategyMetadata,
  Indicator,
  Strategy,
  StrategyValue,
  StrategyContext,
  TradePosition
} from '@quantomate/core';

export class BotQuoteView<T = number> extends Quote<T> {
  private wrapped: Quote<T>;
  private botId: string;

  constructor(botId: string, wrapped: Quote<T>) {
    super(wrapped.value, wrapped.timestamp);
    this.botId = botId;
    this.wrapped = wrapped;
  }

  get value(): T {
    return this.wrapped.value;
  }

  get timestamp(): number | undefined {
    return this.wrapped.timestamp;
  }

  set timestamp(val: number | undefined) {
    this.wrapped.timestamp = val;
  }

  get indicators() {
    return this.wrapped.indicators;
  }

  get strategies() {
    const filtered: { [key: string | number]: StrategyValue } = {};
    for (const [key, val] of Object.entries(this.wrapped.strategies)) {
      if (typeof key === 'string' && key.startsWith(`${this.botId}:`)) {
        const originalName = key.slice(this.botId.length + 1);
        filtered[originalName] = val;
      }
    }
    return filtered;
  }

  getIndicator(indicatorName: string) {
    return this.wrapped.getIndicator(indicatorName);
  }

  setIndicator(indicatorName: string, indicatorValue: number) {
    this.wrapped.setIndicator(indicatorName, indicatorValue);
    return this;
  }

  getStrategy(strategyName: string) {
    return this.wrapped.getStrategy(`${this.botId}:${strategyName}`);
  }

  setStrategy(strategyName: string, strategyValue: StrategyValue) {
    this.wrapped.setStrategy(`${this.botId}:${strategyName}`, strategyValue);
    return this;
  }
}

export class ChildDataset<T = number> extends Dataset<T> {
  protected parent: Dataset<T>;
  protected botId: string;

  constructor(botId: string, parent: Dataset<T>) {
    super(undefined, {
      id: parent.id,
      timeframe: parent.timeframe,
      timestampField: (parent as any)._options?.timestampField,
    });
    this.botId = botId;
    this.parent = parent;
    // Share the columnar storage
    this.storage = (parent as any).storage;
  }

  get id(): string | undefined {
    return this.parent.id;
  }

  get timeframe(): string | undefined {
    return this.parent.timeframe;
  }

  get length(): number {
    return this.parent.length;
  }

  get indicators(): IndicatorMetadata<T>[] {
    return this.parent.indicators;
  }

  get strategies(): StrategyMetadata<T>[] {
    return this._strategies;
  }

  setIndicator(metadata: IndicatorMetadata<T>): this {
    this.parent.setIndicator(metadata);
    return this;
  }

  setStrategy(metadata: StrategyMetadata<T>): this {
    const namespacedName = `${this.botId}:${metadata.name}`;
    this.storage.ensureStrategyColumn(namespacedName);
    this._strategies.push(metadata);
    return this;
  }

  at(position: number): Quote<T> | undefined {
    const quote = this.parent.at(position);
    if (!quote) return undefined;
    return new BotQuoteView(this.botId, quote);
  }

  get quotes(): Quote<T>[] {
    const result: Quote<T>[] = [];
    for (let i = 0; i < this.length; i++) {
      result.push(this.at(i)!);
    }
    return result;
  }

  sync(timestamp: number): Quote<T> | undefined {
    const quote = this.parent.sync(timestamp);
    if (!quote) return undefined;
    return new BotQuoteView(this.botId, quote);
  }

  syncBefore(timestamp: number): Quote<T> | undefined {
    const quote = this.parent.syncBefore(timestamp);
    if (!quote) return undefined;
    return new BotQuoteView(this.botId, quote);
  }

  apply(...indicators: Indicator<unknown, T>[]): this {
    for (const indicator of indicators) {
      this.parent.getOrRegisterIndicator(indicator.name, () => indicator);
    }
    return this;
  }

  add(quote: Quote<T> | T, timestamp?: number, secondaryDatasets: Dataset<T>[] = []): this {
    const value = quote instanceof Quote ? quote.value : quote;
    const ts = timestamp ?? (quote instanceof Quote ? quote.timestamp : (this.parent as any).extractTimestamp(quote));

    let newIndex = -1;
    let alreadyExists = false;

    if (this.parent.length > 0) {
      const lastTs = this.storage.getTimestamp(this.parent.length - 1);
      if (lastTs === ts) {
        alreadyExists = true;
        newIndex = this.parent.length - 1;
      }
    }

    if (!alreadyExists) {
      this.parent.add(quote, ts, secondaryDatasets);
      newIndex = this.parent.length - 1;
    }

    // Run strategy calculations for this child dataset
    for (let i = 0; i < this._strategies.length; i++) {
      const strat = this._strategies[i];
      const lastStrategyValue =
        newIndex > 0
          ? this.storage.getStrategy(newIndex - 1, `${this.botId}:${strat.name}`)
          : undefined;

      const lastPosition = lastStrategyValue
        ? lastStrategyValue.position
        : new TradePosition('idle');

      const rawQuote = this.parent.at(newIndex);
      if (!rawQuote) continue;

      const tempQuote = new BotQuoteView(this.botId, rawQuote);

      const context: StrategyContext<T> = {
        primaryQuote: tempQuote,
        previousPrimaryQuote: newIndex > 0 ? this.at(newIndex - 1) : undefined,
        getQuote: (id: string) => {
          const ds = secondaryDatasets?.find((d) => d.id === id);
          return ts !== undefined ? ds?.sync(ts) : undefined;
        },
        getQuoteBefore: (id: string) => {
          const ds = secondaryDatasets?.find((d) => d.id === id);
          return ts !== undefined ? ds?.syncBefore(ts) : undefined;
        },
      };

      const newPosition = strat.strategy.apply(tempQuote, lastPosition, context).position;
      const updatedPosition = TradePosition.update(lastPosition, newPosition);

      this.storage.setStrategy(newIndex, `${this.botId}:${strat.name}`, new StrategyValue(updatedPosition));
    }

    return this;
  }

  mutateAt(at: number, quote: Quote<T>): this {
    const actualIndex = at < 0 ? this.length + at : at;

    this.storage.mutateValue(actualIndex, quote.value, quote.timestamp);

    for (const [name, value] of Object.entries(quote.indicators)) {
      this.storage.setIndicator(actualIndex, name, value);
    }

    for (const [name, value] of Object.entries(quote.strategies)) {
      const key = name.toString().startsWith(`${this.botId}:`) ? name : `${this.botId}:${name}`;
      this.storage.setStrategy(actualIndex, key, value);
    }

    return this;
  }

  prepare(strategy: Strategy<unknown, T>, secondaryDatasets: Dataset<T>[] = []): this {
    if (strategy.options.indicators) {
      for (const indicator of strategy.options.indicators) {
        this.apply(indicator);
      }
    }

    this.setStrategy({ name: strategy.name, strategy });

    for (let i = 0; i < this.length; i++) {
      const quote = this.at(i)!;
      const lastStrategyValue =
        i > 0
          ? this.storage.getStrategy(i - 1, `${this.botId}:${strategy.name}`)
          : undefined;

      const lastPosition = lastStrategyValue
        ? lastStrategyValue.position
        : new TradePosition('idle');

      const context: StrategyContext<T> = {
        primaryQuote: quote,
        previousPrimaryQuote: i > 0 ? this.at(i - 1) : undefined,
        getQuote: (id: string) => {
          const ds = secondaryDatasets.find((d) => d.id === id);
          return quote.timestamp !== undefined ? ds?.sync(quote.timestamp) : undefined;
        },
        getQuoteBefore: (id: string) => {
          const ds = secondaryDatasets.find((d) => d.id === id);
          return quote.timestamp !== undefined ? ds?.syncBefore(quote.timestamp) : undefined;
        },
      };

      const newPosition = strategy.apply(quote, lastPosition, context).position;
      const updatedPosition = TradePosition.update(lastPosition, newPosition);

      this.storage.setStrategy(
        i,
        `${this.botId}:${strategy.name}`,
        new StrategyValue(updatedPosition)
      );
    }

    return this;
  }
}
