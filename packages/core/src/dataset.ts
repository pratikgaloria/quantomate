import { Indicator, Strategy } from './';
import { TradePosition } from './position';
import { Quote } from './quote';
import { StrategyValue } from './strategy';

export type IndicatorMetadata<T> = {
  name: string;
  indicator: Indicator<unknown, T>;
};

export type StrategyMetadata<T> = {
  name: string;
  strategy: Strategy<unknown, T>;
};

/**
 * Creates a dataset out of data, where data is an array of any numeric values.
 */
export class Dataset<T = number> {
  protected _quotes: Quote<T>[];
  protected _indicators: IndicatorMetadata<T>[];
  protected _strategies: StrategyMetadata<T>[];

  /**
   * Creates a dataset after type-casting given data values to quotes.
   * @param data - Array of `any` type of values or `Quote`.
   */
  constructor(data?: T[]) {
    this._indicators = [];
    this._strategies = [];

    if (data) {
      this._quotes = data.map((d) => {
        if (d instanceof Quote) {
          return d;
        }

        return new Quote(d);
      });
    } else {
      this._quotes = [];
    }
  }

  get quotes() {
    return this._quotes;
  }

  get length() {
    return this._quotes.length;
  }

  get indicators() {
    return this._indicators;
  }

  get strategies() {
    return this._strategies;
  }

  setIndicator(metadata: IndicatorMetadata<T>) {
    this._indicators.push(metadata);

    return this;
  }

  setStrategy(metadata: StrategyMetadata<T>) {
    this._strategies.push(metadata);

    return this;
  }

  /**
   * Get quote at the given zero based position
   * @param position - number, where 0 is first index, and -1 is the last index.
   * @returns - `Quote` if found or undefined.
   */
  at(position: number) {
    if (position < 0) {
      return this.quotes[this.length + position];
    } else {
      return this.quotes[position];
    }
  }

  /**
   * Adds a given quote to the end of the dataset.
   * @param quote - `Quote`.
   * @returns self reference.
   */
  add(quote: Quote<T>) {
    this.quotes.push(quote);

    this.indicators.forEach((i) => {
      const quoteWithIndicator = quote.setIndicator(
        i.name,
        i.indicator.calculate(this)
      );

      this.mutateAt(-1, quoteWithIndicator);
    });

    this.strategies.forEach((s) => {
      const lastPosition =
        this.length > 1
          ? this.at(-2)?.getStrategy(s.name)?.position
          : new TradePosition('idle');
      const newPosition = s.strategy.apply(quote, lastPosition).position;
      const updatedPosition = TradePosition.update(lastPosition, newPosition);

      const quoteWithStrategy = quote.setStrategy(
        s.name,
        new StrategyValue(updatedPosition)
      );

      this.mutateAt(-1, quoteWithStrategy);
    });

    return this;
  }

  /**
   * Mutates the quote at the given position
   * @param at - number, where 0 is first index, and -1 is the last index.
   * @param quote - `Quote` to mutate with.
   * @returns self reference.
   */
  mutateAt(at: number, quote: Quote<T>) {
    if (at < 0) {
      this.quotes[this.length + at] = quote;
    } else {
      this.quotes[at] = quote;
    }

    return this;
  }

  /**
   * get Value of the quote at the given position
   * @param position - number, where 0 is first index, and -1 is the last index.
   * @param attribute - Value of a specific attribute if any (Optional)
   * @returns value.
   */
  valueAt(position: number, attribute?: string) {
    const relativePosition = position < 0 ? this.length + position : position;

    return attribute
      ? this.quotes[relativePosition].value[attribute]
      : this.quotes[relativePosition].value;
  }

  /**
   * Applies given indicators to every quotes of the dataset.
   * @param indicators - Array of `Indicator`.
   * @returns self reference.
   */
  apply(...indicators: Indicator<unknown, T>[]) {
    for (const indicator of indicators) {
      indicator.spread(this);

      this.setIndicator({
        name: indicator.name,
        indicator,
      });
    }

    return this;
  }

  /**
   * Applies given strategy (and its indicators) over the dataset.
   * @param strategy: `Strategy` to apply.
   */
  prepare(strategy: Strategy<unknown, T>) {
    if (strategy.options.indicators) {
      this.apply(...strategy.options.indicators);
    }

    this.quotes.forEach((quote: Quote<T>, index) => {
      const lastQuote = this.at(index - 1);
      const lastQuotePosition = lastQuote
        ? lastQuote?.getStrategy(strategy.name)?.position
        : new TradePosition('idle');

      quote.setStrategy(
        strategy.name,
        strategy.apply(quote, lastQuotePosition)
      );
    });

    this.setStrategy({
      name: strategy.name,
      strategy,
    });
  }

  /**
   * Flatten quote over an attribute
   * @param attribute - The attribute.
   * @returns flatten array.
   */
  flatten(attribute?: string) {
    return this.quotes.map((q) => (attribute ? q.value[attribute] : q.value));
  }
}
