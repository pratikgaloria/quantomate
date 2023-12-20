import { Dataset, Strategy } from './';
import { Quote } from './quote';
import { StrategyValue } from './strategy';

/**
 * Outputs trading signals based on a strategy over a live feed
 */
export class Trader<P = unknown, T = number> {
  protected _dataset: Dataset<T>;
  protected _strategy: Strategy<P, T>;

  /**
   * Applies a given strategy over an initial dataset.
   * @param initialDataset - Initial `Dataset` over which the given strategy should be applied.
   * @param strategy - `Strategy` that should be applied.
   */
  constructor(initialDataset: Dataset<T>, strategy: Strategy<P, T>) {
    this._strategy = strategy;
    this._dataset = initialDataset;

    this._dataset.prepare(strategy);
  }

  get strategy() {
    return this._strategy;
  }

  get dataset() {
    return this._dataset;
  }

  /**
   * Adds a new quote to the dataset, applies a given strategy, and returns a new trade position.
   * @param quote new `Quote`.
   * @returns a promise that resolves with StrategyValue.
   */
  tick(quote: T) {
    return new Promise<StrategyValue>((resolve, reject) => {
      try {
        this._dataset.add(new Quote(quote));
        resolve(this.dataset.at(-1)?.getStrategy(this._strategy.name));
      } catch (error) {
        reject(error);
      }
    });
  }
}
