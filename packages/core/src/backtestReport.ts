import { Quote } from './quote';

/**
 * Creates a back-test report.
 */
interface ExitContext {
  entryPrice: number;
  exitPrice: number;
  entryDate: Date;
  exitDate: Date;
  holdDuration: number;
  priceChange: number;
  priceChangePercent: number;
  indicators: { [key: string]: number };
}

type BacktestReportTrades<T> = {
  type: 'entry' | 'exit';
  quote: Quote<T>;
  tradedValue: number;
  shares?: number;
  currentCapital: number;
  short?: boolean;
  exitReason?: 'stop-loss' | 'take-profit' | 'strategy';
  exitContext?: ExitContext;
};

export class BacktestReport<T = number> {
  currentCapital: number;
  sharesOwned: number;
  isShort: boolean = false;
  entryTradedValue: number = 0;

  profit: number;
  loss: number;
  numberOfTrades: number;
  numberOfLosingTrades: number;
  numberOfWinningTrades: number;
  initialCapital: number;
  finalCapital: number;
  returns: number;
  returnsPercentage: number;
  winningRate: number;
  trades: BacktestReportTrades<T>[];
  stopLossExits: number;
  takeProfitExits: number;
  strategyExits: number;

  /**
   * Defines the initial capital for the back-test.
   * @param initialCapital - Initial capital for the back-test.
   */
  constructor(initialCapital: number) {
    this.profit = 0;
    this.loss = 0;
    this.numberOfTrades = 0;
    this.numberOfLosingTrades = 0;
    this.numberOfWinningTrades = 0;
    this.initialCapital = initialCapital;
    this.finalCapital = initialCapital;

    this.returns = 0;
    this.returnsPercentage = 0;
    this.winningRate = 0;
    this.trades = [];
    this.currentCapital = initialCapital;
    this.sharesOwned = 0;
    this.stopLossExits = 0;
    this.takeProfitExits = 0;
    this.strategyExits = 0;
  }

  private updateCapital(value: number) {
    this.finalCapital += value;
  }

  private updateTotals() {
    this.returns = this.finalCapital - this.initialCapital;
    this.returnsPercentage =
      ((this.finalCapital - this.initialCapital) * 100) / this.initialCapital;
    this.numberOfTrades += 1;
  }

  /**
   * Updates the capital according to the traded value after executing the entry position.
   * @param tradedValue - Traded value at the time.
   */
  markEntry(tradedValue: number, quote: Quote<T>, strategyName: string) {
    const position = quote.getStrategy(strategyName).position;
    this.isShort = !!position.options?.short;
    this.entryTradedValue = tradedValue;

    // Calculate shares with all available capital
    const shares = this.finalCapital / tradedValue;
    this.sharesOwned = shares;

    if (this.isShort) {
      // For short: selling shares we don't own. 
      // We get cash from sale, but we'll need to buy them back later.
      // Simplification: We hold the initial capital + sale proceeds as cash.
      this.finalCapital = this.finalCapital + (shares * tradedValue);
    } else {
      this.finalCapital = 0; // All capital used to buy shares
    }
    
    this.trades.push({
      type: 'entry',
      quote,
      tradedValue,
      shares,
      short: this.isShort,
      currentCapital: this.finalCapital,
    });
  }

  /**
   * Updates the capital according to the traded value after executing the exit position.
   * @param tradedValue - Traded value at the time.
   */
  markExit(tradedValue: number, quote: Quote<T>, strategyName: string) {
    const position = quote.getStrategy(strategyName).position;
    const exitReason = position.options?.exitReason;

    if (exitReason === 'stop-loss') {
      this.stopLossExits++;
    } else if (exitReason === 'take-profit') {
      this.takeProfitExits++;
    } else if (exitReason === 'strategy') {
      this.strategyExits++;
    }

    const exitContext = this.buildExitContext(quote, position, tradedValue);
    
    if (this.isShort) {
      // For short exit: buying back shares.
      // Cash decreases by (shares * tradedValue)
      this.finalCapital = this.finalCapital - (this.sharesOwned * tradedValue);
    } else {
      // For long exit: selling shares.
      // Cash becomes the proceeds.
      const proceeds = this.sharesOwned * tradedValue;
      this.finalCapital = proceeds;
    }
    
    this.trades.push({
      type: 'exit',
      quote,
      tradedValue,
      shares: this.sharesOwned,
      short: this.isShort,
      currentCapital: this.finalCapital,
      exitReason,
      exitContext,
    });
    
    const hasWon = this.finalCapital > this.currentCapital;

    if (hasWon) {
      this.profit += this.finalCapital - this.currentCapital;
      this.numberOfWinningTrades += 1;
    } else {
      this.loss += this.currentCapital - this.finalCapital;
      this.numberOfLosingTrades += 1;
    }

    this.winningRate =
      this.numberOfWinningTrades /
      (this.numberOfWinningTrades + this.numberOfLosingTrades);

    this.sharesOwned = 0; // Reset shares after exit
    this.isShort = false;
    this.currentCapital = this.finalCapital;
    this.updateTotals();
  }

  private buildExitContext<T>(
    quote: Quote<T>,
    position: any,
    exitPrice: number
  ): ExitContext | undefined {
    const entryPrice = position.options?.entryPrice;
    const entryDate = position.options?.entryDate;

    if (!entryPrice || !entryDate) {
      return undefined;
    }

    const exitDate = new Date();
    const holdDuration = exitDate.getTime() - entryDate.getTime();
    const isShort = !!position.options?.short;
    const priceChange = isShort ? entryPrice - exitPrice : exitPrice - entryPrice;
    const priceChangePercent = (priceChange / entryPrice) * 100;

    const indicators: { [key: string]: number } = {};
    const indicatorNames = ['rsi', 'atr', 'sma', 'ema', 'macd', 'bb'];
    indicatorNames.forEach((name) => {
      try {
        indicators[name] = quote.getIndicator(name);
      } catch {
        // Indicator not present
      }
    });

    return {
      entryPrice,
      exitPrice,
      entryDate,
      exitDate,
      holdDuration,
      priceChange,
      priceChangePercent,
      indicators,
    };
  }

  getRiskMetrics() {
    return {
      totalExits:
        this.stopLossExits + this.takeProfitExits + this.strategyExits,
      stopLossExits: this.stopLossExits,
      takeProfitExits: this.takeProfitExits,
      strategyExits: this.strategyExits,
      stopLossRate:
        this.numberOfTrades > 0 ? this.stopLossExits / this.numberOfTrades : 0,
      takeProfitRate:
        this.numberOfTrades > 0
          ? this.takeProfitExits / this.numberOfTrades
          : 0,
      strategyExitRate:
        this.numberOfTrades > 0
          ? this.strategyExits / this.numberOfTrades
          : 0,
    };
  }

  analyzeStopLossExits() {
    const stopLossTrades = this.trades.filter(
      (t) => t.exitReason === 'stop-loss'
    );

    if (stopLossTrades.length === 0) {
      return null;
    }

    const avgLoss =
      stopLossTrades.reduce(
        (sum, t) => sum + (t.exitContext?.priceChangePercent || 0),
        0
      ) / stopLossTrades.length;

    const avgHoldTime =
      stopLossTrades.reduce(
        (sum, t) => sum + (t.exitContext?.holdDuration || 0),
        0
      ) / stopLossTrades.length;

    return {
      count: stopLossTrades.length,
      avgLossPercent: avgLoss,
      avgHoldTimeMs: avgHoldTime,
      trades: stopLossTrades,
    };
  }
}
