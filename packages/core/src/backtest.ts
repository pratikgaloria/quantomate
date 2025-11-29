import { Dataset, Strategy, StrategyValue } from './';
import { BacktestReport } from './backtestReport';
import { Quote } from './quote';
import { TradePosition } from './position';

export interface BacktestConfiguration {
  capital: number;
  name?: string;
  entryPriceField?: 'close' | 'open' | 'high' | 'low' | (<T>(quote: Quote<T>) => number);
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

    for (let i = 0; i < this._dataset.length; i++) {
      const quote = this._dataset.at(i)!;
      const position = quote.getStrategy(this.strategy.name).position;

      if (
        i === this._dataset.length - 1 &&
        (position.value === 'entry' || position.value === 'hold')
      ) {
        report.markExit(onExit(quote, i, []), quote, this.strategy.name);
      } else {
        if (position.value === 'entry') {
          const entryPrice = this.getEntryPrice(quote, config);
          const positionWithEntry = new TradePosition(position.value, {
            ...position.options,
            entryPrice,
            entryDate: new Date(),
          });

          quote.setStrategy(
            this.strategy.name,
            new StrategyValue(positionWithEntry)
          );

          report.markEntry(onEntry(quote, i, []), quote);
        } else if (position.value === 'exit') {
          report.markExit(onExit(quote, i, []), quote, this.strategy.name);
        }
      }
    }

    return report;
  }

  private getEntryPrice(quote: Quote<T>, config: BacktestConfiguration): number {
    if (typeof config.entryPriceField === 'function') {
      return config.entryPriceField(quote);
    }

    if (typeof quote.value === 'number') {
      return quote.value;
    }

    if (typeof quote.value === 'object' && quote.value !== null) {
      const field = config.entryPriceField || 'close';
      if (field in quote.value) {
        return quote.value[field] as number;
      }
    }

    throw new Error('Cannot determine entry price from quote');
  }
}
