import { Indicator, Strategy } from './';
import { TradePosition } from './position';
import { Quote } from './quote';
import { StrategyValue, StrategyContext } from './strategy';
import { ColumnarStorage } from './utils/columnarStorage';

export type IndicatorMetadata<T> = {
  name: string;
  indicator: Indicator<unknown, T>;
};

export type StrategyMetadata<T> = {
  name: string;
  strategy: Strategy<unknown, T>;
};

export interface DatasetOptions<T> {
  id?: string;
  timeframe?: string;
  timestampField?: T extends object ? keyof T : string;
}

/**
 * Creates a dataset using columnar storage for efficient memory usage.
 * Uses typed arrays internally instead of Quote objects.
 */
export class Dataset<T = number> {
  protected storage: ColumnarStorage<T>;
  protected _indicators: IndicatorMetadata<T>[];
  protected _strategies: StrategyMetadata<T>[];
  protected _options: DatasetOptions<T>;
  protected indicatorRegistry = new Map<string, Indicator<unknown, T>>();

  /**
   * Creates a dataset after type-casting given data values.
   * @param data - Array of values or Quote objects.
   * @param options - Optional configuration (id, timeframe, timestampField).
   */
  constructor(data?: T[] | Quote<T>[], options: DatasetOptions<T> = {}) {
    this._indicators = [];
    this._strategies = [];
    this._options = options;
    this.storage = new ColumnarStorage<T>();

    if (data) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item instanceof Quote) {
          const timestamp = item.timestamp ?? this.extractTimestamp(item.value);
          this.storage.addValue(item.value, timestamp);
        } else {
          this.storage.addValue(item, this.extractTimestamp(item));
        }
      }
    }
  }

  get id(): string | undefined {
    return this._options.id;
  }

  get timeframe(): string | undefined {
    return this._options.timeframe;
  }

  private extractTimestamp(value: T): number | undefined {
    if (typeof value === 'object' && value !== null) {
      const field = (this._options.timestampField as string) || 'timestamp';
      const ts = (value as any)[field];
      if (ts instanceof Date) return ts.getTime();
      if (typeof ts === 'number') return ts;
      if (typeof ts === 'string') return new Date(ts).getTime();
    }
    return undefined;
  }

  /**
   * Get quotes array (creates Quote objects on-the-fly)
   * @deprecated Use at() or iterate with for-loop for better performance
   */
  get quotes(): Quote<T>[] {
    const result: Quote<T>[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      result.push(this.createQuoteAt(i));
    }
    return result;
  }

  get length(): number {
    return this.storage.length;
  }

  get indicators(): IndicatorMetadata<T>[] {
    return this._indicators;
  }

  get strategies(): StrategyMetadata<T>[] {
    return this._strategies;
  }

  getOrRegisterIndicator(
    key: string,
    createFn: () => Indicator<unknown, T>
  ): Indicator<unknown, T> {
    let indicator = this.indicatorRegistry.get(key);
    if (!indicator) {
      indicator = createFn();
      this.indicatorRegistry.set(key, indicator);
      this.apply(indicator);
    }
    return indicator;
  }

  setIndicator(metadata: IndicatorMetadata<T>): this {
    this._indicators.push(metadata);
    this.storage.ensureIndicatorColumn(metadata.name);
    return this;
  }

  setStrategy(metadata: StrategyMetadata<T>): this {
    this._strategies.push(metadata);
    this.storage.ensureStrategyColumn(metadata.name);
    return this;
  }

  /**
   * Get quote at the given position (creates Quote object on-the-fly)
   * @param position - number, where 0 is first index, and -1 is the last index.
   * @returns - `Quote` if found or undefined.
   */
  at(position: number): Quote<T> | undefined {
    const actualIndex = position < 0 ? this.length + position : position;
    if (actualIndex < 0 || actualIndex >= this.length) {
      return undefined;
    }
    return this.createQuoteAt(actualIndex);
  }

  /**
   * Create a Quote object from columnar storage at given index
   */
  private createQuoteAt(index: number): Quote<T> {
    const value = this.storage.getValue(index);
    const timestamp = this.storage.getTimestamp(index);
    const quote = new Quote(value, isNaN(timestamp) ? undefined : timestamp);

    // Populate indicators
    for (const name of this.storage.getIndicatorNames()) {
      const indicatorValue = this.storage.getIndicator(index, name);
      quote.setIndicator(name, indicatorValue);
    }

    // Populate strategies
    for (const name of this.storage.getStrategyNames()) {
      const strategyValue = this.storage.getStrategy(index, name);
      if (strategyValue) {
        quote.setStrategy(name, strategyValue);
      }
    }

    return quote;
  }

  /**
   * Adds a given quote to the end of the dataset.
   * @param quote - `Quote` or value.
   * @param timestamp - Optional Unix timestamp (ms).
   * @param secondaryDatasets - Optional secondary datasets for MTF strategy calculation.
   * @returns self reference.
   */
  add(quote: Quote<T> | T, timestamp?: number, secondaryDatasets: Dataset<T>[] = []): this {
    const value = quote instanceof Quote ? quote.value : quote;
    const ts = timestamp ?? (quote instanceof Quote ? quote.timestamp : this.extractTimestamp(quote));

    this.storage.addValue(value, ts);
    const newIndex = this.storage.length - 1;

    // If adding a Quote object, preserve its existing indicators and strategies
    if (quote instanceof Quote) {
      for (const [name, val] of Object.entries(quote.indicators)) {
        this.storage.setIndicator(newIndex, name, val);
      }
      for (const [name, val] of Object.entries(quote.strategies)) {
        this.storage.setStrategy(newIndex, name, val);
      }
    }

    // Calculate and store indicators
    for (let i = 0; i < this.indicators.length; i++) {
      const ind = this.indicators[i];
      let indicatorValue: number;

      // Try incremental calculation first (O(1) instead of O(n))
      if (ind.indicator.hasIncremental() && this.length > 1) {
        const prevValue = this.storage.getIndicator(newIndex - 1, ind.name);

        if (prevValue !== undefined && !isNaN(prevValue)) {
          // Create temporary quote for incremental calculation
          const tempQuote = new Quote(value);
          indicatorValue = ind.indicator.calculateIncremental(
            prevValue,
            tempQuote,
            this
          );
        } else {
          indicatorValue = ind.indicator.calculate(this);
        }
      } else {
        indicatorValue = ind.indicator.calculate(this);
      }

      this.storage.setIndicator(newIndex, ind.name, indicatorValue);
    }

    // Calculate and store strategies
    for (let i = 0; i < this.strategies.length; i++) {
      const strat = this.strategies[i];
      const lastStrategyValue =
        this.length > 1
          ? this.storage.getStrategy(newIndex - 1, strat.name)
          : undefined;

      const lastPosition = lastStrategyValue
        ? lastStrategyValue.position
        : new TradePosition('idle');

      const tempQuote = new Quote(value);
      if (ts !== undefined) tempQuote.timestamp = ts;

      // Populate indicators on tempQuote so strategy can use them
      for (const ind of this.indicators) {
        const val = this.storage.getIndicator(newIndex, ind.name);
        tempQuote.setIndicator(ind.name, val);
      }

      const context: StrategyContext<T> = {
        primaryQuote: tempQuote,
        previousPrimaryQuote: this.at(newIndex - 1),
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

      this.storage.setStrategy(newIndex, strat.name, new StrategyValue(updatedPosition));
    }

    return this;
  }

  /**
   * Synchronizes with another dataset by timestamp.
   * Returns the quote at or before the given timestamp.
   * Useful for multi-timeframe analysis.
   * @param timestamp - target Unix timestamp (ms).
   * @returns Synchronized Quote or undefined.
   */
  sync(timestamp: number): Quote<T> | undefined {
    const timestamps = this.storage.getTimestamps();
    if (timestamps.length === 0) return undefined;

    // Binary search to find the last index where timestamps[index] <= timestamp
    let low = 0;
    let high = timestamps.length - 1;
    let resultIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (timestamps[mid] <= timestamp) {
        resultIndex = mid; // Found a candidate
        low = mid + 1; // Try to find a later one
      } else {
        high = mid - 1;
      }
    }

    if (resultIndex === -1) return undefined;
    return this.createQuoteAt(resultIndex);
  }

  /**
   * Synchronizes with another dataset by timestamp, returning the quote strictly BEFORE the given timestamp.
   * Useful for avoiding lookahead bias in multi-timeframe analysis.
   * @param timestamp - target Unix timestamp (ms).
   * @returns Synchronized Quote or undefined.
   */
  syncBefore(timestamp: number): Quote<T> | undefined {
    const timestamps = this.storage.getTimestamps();
    if (timestamps.length === 0) return undefined;

    // Binary search to find the last index where timestamps[index] < timestamp
    let low = 0;
    let high = timestamps.length - 1;
    let resultIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (timestamps[mid] < timestamp) {
        resultIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (resultIndex === -1) return undefined;
    return this.createQuoteAt(resultIndex);
  }

  /**
   * Prepares the dataset for the given strategy.
   * @param strategy - `Strategy`.
   * @param secondaryDatasets - Optional array of additional datasets for multi-timeframe rules.
   * @returns self reference.
   */
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
        i > 0 ? this.storage.getStrategy(i - 1, strategy.name) : undefined;

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
        strategy.name,
        new StrategyValue(updatedPosition)
      );
    }

    return this;
  }

  /**
   * Mutates the quote at the given position
   * @param at - number, where 0 is first index, and -1 is the last index.
   * @param quote - `Quote` to mutate with.
   * @returns self reference.
   */
  mutateAt(at: number, quote: Quote<T>): this {
    const actualIndex = at < 0 ? this.length + at : at;

    // Update value and timestamp
    this.storage.mutateValue(actualIndex, quote.value, quote.timestamp);

    // Update indicators
    for (const [name, value] of Object.entries(quote.indicators)) {
      this.storage.setIndicator(actualIndex, name, value);
    }

    // Update strategies
    for (const [name, value] of Object.entries(quote.strategies)) {
      this.storage.setStrategy(actualIndex, name, value);
    }

    return this;
  }

  /**
   * Get value at position (optimized, no Quote object creation)
   * @param position - number, where 0 is first index, and -1 is the last index.
   * @param attribute - optional attribute name for object values
   * @returns value
   */
  valueAt(position: number, attribute?: string): number {
    const actualIndex = position < 0 ? this.length + position : position;
    if (actualIndex < 0 || actualIndex >= this.length) {
      return NaN;
    }

    const value = this.storage.getValue(actualIndex);

    if (attribute && typeof value === 'object' && value !== null) {
      return (value as any)[attribute];
    }

    return typeof value === 'number' ? value : 0;
  }

  /**
   * Flatten dataset to array of numbers
   */
  flatten(attribute?: string): number[] {
    const result: number[] = [];
    for (let i = 0; i < this.length; i++) {
      result.push(this.valueAt(i, attribute));
    }
    return result;
  }

  /**
   * Apply indicators to the dataset
   */
  apply(...indicators: Indicator<unknown, T>[]): this {
    for (const indicator of indicators) {
      this.setIndicator({ name: indicator.name, indicator });
      indicator.spread(this);
    }
    return this;
  }
}
