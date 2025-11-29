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

type StrategyCommonOptions<P, T> = {
  indicators?: Indicator<P, T>[];
  onTrigger?: (positionType: TradePositionType, quote: Quote<T>) => void;
  stopLossWhen?: RiskFn;
  takeProfitWhen?: RiskFn;
};

type LongPositionOptions<P, T> = {
  entryWhen: positionFn;
  exitWhen: positionFn;
} & StrategyCommonOptions<P, T>;

type ShortPositionOptions<P, T> = {
  entryShortWhen: positionFn;
  exitShortWhen: positionFn;
} & StrategyCommonOptions<P, T>;

export type StrategyOptions<P, T> =
  | LongPositionOptions<P, T>
  | ShortPositionOptions<P, T>;

function isShortPosition<P, T>(
  position: TradePosition,
  options: StrategyOptions<P, T>
): options is ShortPositionOptions<P, T> {
  return !!position.options?.short;
}

/**
 * Defines a strategy that can be back-tested.
 */
export class Strategy<P = unknown, T = number, O = unknown> {
  protected _name: string;
  protected _options: StrategyOptions<P, T>;

  /**
   * Creates a strategy with definition and indicators.
   * @param name - Name of the strategy.
   * @param options - StrategyOptions.
   */
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

  /**
   * Applies the strategy over a given quote and returns the strategy values.
   * @param quote - `Quote` on which strategy should be applied.
   * @param position - TradePositionType of the quote.
   * @returns `StrategyValue`.
   */
  apply(
    quote: Quote<T>,
    position: TradePosition<O> = new TradePosition<O>('idle')
  ) {
    // STEP 1: Check stop-loss FIRST (highest priority)
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

    // STEP 2: Check take-profit
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

    // STEP 3: Check strategy exit conditions (lower priority)
    let newPositionValue: TradePositionType = 'idle';

    let entryFn: positionFn, exitFn: positionFn;
    if (isShortPosition(position, this._options)) {
      entryFn = this._options.entryShortWhen;
      exitFn = this._options.exitShortWhen;
    } else {
      entryFn = this._options.entryWhen;
      exitFn = this._options.exitWhen;
    }

    if (
      (position.value === 'hold' || position.value === 'entry') &&
      exitFn(quote)
    ) {
      newPositionValue = 'exit';
    } else if (entryFn(quote)) {
      newPositionValue = 'entry';
    }

    const updatedPosition = TradePosition.update(
      position,
      new TradePosition(newPositionValue, {
        ...position.options,
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
}
