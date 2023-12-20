import { StrategyValue } from './strategy';

/**
 * Creates a quote out of any value.
 *
 * create a quote with new Quote<T>.
 * quote should have value:T
 * quote might have indicators, attributes.
 *
 * new Quote(1) = { value: 1 },
 * new Quote({ close: 1 }) = { value: { close: 1 }},
 */
export class Quote<T = number> {
  private _value: T;
  private _indicators: { [key: string | number]: number };
  private _strategies: { [key: string | number]: StrategyValue };

  /**
   * Creates a quote after type-casting the given value.
   * @param value - Any value.
   */
  constructor(value: T) {
    this._value = this.sanitize(value);
    this._indicators = {};
    this._strategies = {};
  }

  get value() {
    return this._value;
  }

  get indicators() {
    return this._indicators;
  }

  get strategies() {
    return this._strategies;
  }

  private sanitize<V = number>(valueToTransform: V): V {
    if (
      typeof valueToTransform === 'number' ||
      typeof valueToTransform === 'bigint' ||
      typeof valueToTransform === 'string' ||
      (valueToTransform &&
        typeof valueToTransform === 'object' &&
        !(valueToTransform instanceof Array))
    ) {
      return valueToTransform;
    } else {
      throw new Error(`Invalid quote value: ${valueToTransform}.`);
    }
  }

  /**
   * Get quote indicator value by indicator name.
   * @param indicatorName - Name of the `Indicator`.
   * @returns Value of indicator if exists, `undefined` otherwise.
   */
  getIndicator(indicatorName: string) {
    return this._indicators[indicatorName];
  }

  /**
   * Set indicator for a quote.
   * @param indicatorName - Name of the `Indicator`.
   * @param indicatorValue - Calculated value of the `Indicator`.
   * @returns self reference.
   */
  setIndicator(indicatorName: string, indicatorValue: number) {
    Object.assign(this._indicators, { [indicatorName]: indicatorValue });

    return this;
  }

  /**
   * Get strategy values for the given quote.
   * @param strategyName - Name of the strategy.
   * @returns `StrategyPoint` object if strategy exists, `undefined` otherwise.
   */
  getStrategy(strategyName: string) {
    return this._strategies[strategyName];
  }

  /**
   * Set strategy for a quote.
   * @param strategyName - Name of the `Strategy`.
   * @param strategyValue - Strategy value.
   * @returns self reference.
   */
  setStrategy(strategyName: string, strategyValue: StrategyValue) {
    Object.assign(this._strategies, { [strategyName]: strategyValue });

    return this;
  }
}
