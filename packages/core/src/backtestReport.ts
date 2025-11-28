import { Quote } from './quote';

/**
 * Creates a back-test report.
 */
type BacktestReportTrades<T> = {
  type: 'entry' | 'exit';
  quote: Quote<T>;
  tradedValue: number;
  shares?: number;
  currentCapital: number;
};

export class BacktestReport<T = number> {
  currentCapital: number;
  sharesOwned: number;

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
  markEntry(tradedValue: number, quote: Quote<T>) {
    // Calculate shares with all available capital
    const shares = this.finalCapital / tradedValue;
    this.sharesOwned = shares;
    this.finalCapital = 0; // All capital used to buy shares
    
    this.trades.push({
      type: 'entry',
      quote,
      tradedValue,
      shares,
      currentCapital: this.finalCapital,
    });
  }

  /**
   * Updates the capital according to the traded value after executing the exit position.
   * @param tradedValue - Traded value at the time.
   */
  markExit(tradedValue: number, quote: Quote<T>) {
    // Calculate proceeds from selling all shares
    const proceeds = this.sharesOwned * tradedValue;
    this.finalCapital = proceeds;
    
    this.trades.push({
      type: 'exit',
      quote,
      tradedValue,
      shares: this.sharesOwned,
      currentCapital: this.finalCapital,
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
    this.currentCapital = this.finalCapital;
    this.updateTotals();
  }
}
