import { Dataset, Indicator, Backtest, BacktestReport } from './';
import { BacktestRunner } from './backtest';
import { TradePosition, TradePositionType } from './position';
import { Quote } from './quote';

export class StrategyValue<O = unknown> {
  position: TradePosition<O>;

  constructor(position: TradePosition<O> = new TradePosition<O>('idle')) {
    this.position = position;
  }
}

type positionFn = <T>(quote: Quote<T>) => boolean;
type RiskFn = <T, O>(quote: Quote<T>, position: TradePosition<O>) => boolean;

export type StrategyDirection = 'long' | 'short' | 'both';

type StrategyOptionsCommon<P, T> = {
  indicators?: Indicator<P, T>[];
  onTrigger?: (positionType: TradePositionType, quote: Quote<T>) => void;
  stopLossWhen?: RiskFn;
  takeProfitWhen?: RiskFn;
  direction?: StrategyDirection;
};

export type StrategyOptions<P, T> = {
  entryWhen?: positionFn;
  exitWhen?: positionFn;
  entryShortWhen?: positionFn;
  exitShortWhen?: positionFn;
} & StrategyOptionsCommon<P, T>;

/**
 * Defines a strategy that can be back-tested.
 */
export class Strategy<P = unknown, T = number, O = unknown> {
  protected _name: string;
  protected _options: StrategyOptions<P, T>;

  constructor(name: string, options: StrategyOptions<P, T>) {
    this._name = name;
    this._options = options;
  }

  get name() {
    return this._name;
  }

  get options() {
    return this._options;
  }

  apply(
    quote: Quote<T>,
    position: TradePosition<O> = new TradePosition<O>('idle')
  ) {
    if (
      (position.value === 'hold' || position.value === 'entry') &&
      this._options.stopLossWhen?.(quote, position)
    ) {
      return new StrategyValue(
        new TradePosition('exit', {
          ...position.options,
          exitReason: 'stop-loss',
        })
      );
    }

    if (
      (position.value === 'hold' || position.value === 'entry') &&
      this._options.takeProfitWhen?.(quote, position)
    ) {
      return new StrategyValue(
        new TradePosition('exit', {
          ...position.options,
          exitReason: 'take-profit',
        })
      );
    }

    let newPositionValue: TradePositionType = 'idle';
    let isShort = position.options?.short;

    if (position.value === 'hold' || position.value === 'entry') {
      const exitFn = isShort ? this._options.exitShortWhen : this._options.exitWhen;
      if (exitFn?.(quote)) {
        newPositionValue = 'exit';
      }
    } else {
      const direction = this._options.direction || 'both';
      const canEnterLong = direction === 'long' || direction === 'both';
      const canEnterShort = direction === 'short' || direction === 'both';

      if (canEnterLong && this._options.entryWhen?.(quote)) {
        newPositionValue = 'entry';
        isShort = false;
      } else if (canEnterShort && this._options.entryShortWhen?.(quote)) {
        newPositionValue = 'entry';
        isShort = true;
      }
    }

    const updatedPosition = TradePosition.update(
      position,
      new TradePosition(newPositionValue, {
        ...position.options,
        ...(isShort !== undefined ? { short: isShort } : {}),
        exitReason: newPositionValue === 'exit' ? 'strategy' : undefined,
      }) as TradePosition<O>
    );
    this._options.onTrigger?.(updatedPosition.value, quote);

    return new StrategyValue(updatedPosition);
  }

  /**
   * Backtests the strategy over a given Dataset and configuration, and returns the report.
   * @param dataset - `Dataset` on which strategy should be applied over each quote.
   * @param configuration - `BacktestConfiguration` that configures the backtest.
   * @returns `BacktestReport`.
   */
  backtest(dataset: Dataset<T>, runner: BacktestRunner<T>): BacktestReport<T> {
    return new Backtest(dataset, this).run(runner);
  }

  /**
   * Scans the dataset for the most recent entry signal.
   * @param dataset - `Dataset` to scan.
   * @returns `Quote<T>` of the most recent entry signal or `undefined`.
   */
  scan(dataset: Dataset<T>): Quote<T> | undefined {
    dataset.prepare(this);

    for (let i = dataset.length - 1; i >= 0; i--) {
      const quote = dataset.at(i)!;
      const strategyValue = quote.getStrategy(this.name);
      if (strategyValue && strategyValue.position.value === 'entry') {
        return quote;
      }
    }

    return undefined;
  }
}
