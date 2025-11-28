import { Dataset } from './';
import { Quote } from './quote';

export interface IndicatorOptions<P, T = number> {
  params?: P;
  beforeCalculate?: (dataset: Dataset<T>) => void;
}

/**
 * Creates a indicator that can be calculated over a dataset.
 */
export class Indicator<P, T = number> {
  private _name: string;
  private _calculate: (dataset: Dataset<T>) => number;
  private _calculateIncremental?: (
    previousValue: number,
    newQuote: Quote<T>,
    dataset: Dataset<T>
  ) => number;
  private _options?: IndicatorOptions<P, T>;

  /**
   * Creates an indicator with definition and configuration.
   * @param name - Name of the indicator.
   * @param calculate - Indicator definition function that accepts the `Dataset` and returns a number.
   * @param options - Indicator configuration object.
   */
  constructor(
    name: string,
    calculate: (dataset: Dataset<T>) => number,
    options?: IndicatorOptions<P, T>
  ) {
    this._name = name;
    this._calculate = calculate;
    this._options = options;
  }

  get name() {
    return this._name;
  }

  get options() {
    return this._options;
  }

  get params() {
    return this._options?.params;
  }

  /**
   * Sets an incremental calculation function for performance optimization.
   * This allows updating the indicator value based on the previous value and new quote,
   * instead of recalculating over the entire dataset.
   * @param fn - Incremental calculation function
   * @returns this indicator instance for chaining
   */
  withIncremental(
    fn: (previousValue: number, newQuote: Quote<T>, dataset: Dataset<T>) => number
  ): this {
    this._calculateIncremental = fn;
    return this;
  }

  /**
   * Checks if this indicator supports incremental calculation
   * @returns true if incremental calculation is available
   */
  hasIncremental(): boolean {
    return this._calculateIncremental !== undefined;
  }

  /**
   * Calculates an indicator over a given dataset
   * @param dataset - `Dataset`.
   * @returns the value of indicator.
   */
  calculate(dataset: Dataset<T>) {
    if (this.options?.beforeCalculate) {
      this.options.beforeCalculate(dataset);
    }

    return this._calculate(dataset);
  }

  /**
   * Calculates indicator incrementally based on previous value and new quote.
   * Falls back to full calculation if incremental is not available.
   * @param previousValue - Previous indicator value
   * @param newQuote - New quote being added
   * @param dataset - Current dataset (with new quote already added)
   * @returns updated indicator value
   */
  calculateIncremental(
    previousValue: number,
    newQuote: Quote<T>,
    dataset: Dataset<T>
  ): number {
    if (this._calculateIncremental) {
      return this._calculateIncremental(previousValue, newQuote, dataset);
    }
    // Fallback to full calculation if incremental not available
    return this.calculate(dataset);
  }

  /**
   * Mutates each quote of the given dataset with a calculated indicator value.
   * @param dataset - `Dataset`.
   * @returns `Dataset`.
   */
  spread(dataset: Dataset<T>) {
    if (this.options && this.options.beforeCalculate) {
      this.options.beforeCalculate(dataset);
    }

    const tempDataset = new Dataset<T>();
    
    for (let i = 0; i < dataset.length; i++) {
      const quote = dataset.at(i)!;
      tempDataset.add(quote);
      
      const indicatorValue = this.calculate(tempDataset);
      const quoteWithIndicator = quote.setIndicator(this.name, indicatorValue);
      
      // We don't need to update tempDataset as add() already added the quote
      // But we need to update the original dataset
      dataset.mutateAt(i, quoteWithIndicator);
    }

    return dataset;
  }
}
