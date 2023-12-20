import { Dataset, Strategy } from './';
import { BacktestReport } from './backtestReport';
import { Quote } from './quote';

export interface BacktestConfiguration {
  capital: number;
  name?: string;
}

export type BacktestTrigger<T> = (
  quote: Quote<T>,
  index: number,
  quotes: Quote<T>[]
) => number;
export type BacktestRunner<T> = {
  config: BacktestConfiguration;
  onEntry: BacktestTrigger<T>;
  onExit: BacktestTrigger<T>;
};

/**
 * Back-tests the strategy over a given dataset.
 */
export class Backtest<P = unknown, T = number, O = unknown> {
  protected _dataset: Dataset<T>;
  protected _strategy: Strategy<P, T, O>;

  /**
   * Runs a back-test over a dataset for a given strategy.
   * @param dataset - `Dataset` over which strategy should be back-tested.
   * @param strategy - `Strategy` that should be back-tested.
   */
  constructor(dataset: Dataset<T>, strategy: Strategy<P, T, O>) {
    this._strategy = strategy;
    this._dataset = dataset;

    this._dataset.prepare(strategy);
  }

  get strategy() {
    return this._strategy;
  }

  get dataset() {
    return this._dataset;
  }

  /**
   * Runs the back-test over a dataset with the given configuration and returns report.
   * @param configuration - `BacktestConfiguration` with trading quantity and capital.
   * @returns `BacktestReport`.
   */
  run({ config, onEntry, onExit }: BacktestRunner<T>) {
    const report = new BacktestReport<T>(config.capital);

    this._dataset.quotes.forEach((quote: Quote<T>, index, array) => {
      const position = quote.getStrategy(this.strategy.name).position;

      if (
        index === array.length - 1 &&
        (position.value === 'entry' || position.value === 'hold')
      ) {
        report.markExit(onExit(quote, index, array), quote);
      } else {
        if (position.value === 'entry') {
          report.markEntry(onEntry(quote, index, array), quote);
        } else if (position.value === 'exit') {
          report.markExit(onExit(quote, index, array), quote);
        }
      }
    });

    return report;
  }
}
