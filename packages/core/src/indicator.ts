import { Dataset } from './';

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
   * Mutates each quote of the given dataset with a calculated indicator value.
   * @param dataset - `Dataset`.
   * @returns `Dataset`.
   */
  spread(dataset: Dataset<T>) {
    if (this.options && this.options.beforeCalculate) {
      this.options.beforeCalculate(dataset);
    }

    const emptyDataset = new Dataset<T>();
    dataset.quotes.forEach((quote) => {
      const quoteWithIndicator = quote.setIndicator(
        this.name,
        this.calculate(emptyDataset.add(quote))
      );

      emptyDataset.mutateAt(-1, quoteWithIndicator);
    });

    return dataset;
  }
}
