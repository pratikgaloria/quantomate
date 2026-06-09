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
  commission?: number;
  slippage?: number;
};

export class BacktestReport<T = number> {
  currentCapital: number;
  sharesOwned: number;
  isShort: boolean = false;
  entryTradedValue: number = 0;
  activeEntryDate?: Date;

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
  totalCommissions: number = 0;
  totalSlippage: number = 0;
  private config: { commission?: number; slippage?: number };

  /**
   * Defines the initial capital for the back-test.
   * @param initialCapital - Initial capital for the back-test.
   * @param config - Optional configuration for costs.
   */
  constructor(initialCapital: number, config: { commission?: number; slippage?: number } = {}) {
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
    this.config = config;
  }

  private updateCapital(value: number) {
    this.finalCapital += value;
  }

  private updateTotals() {
    this.returns = this.finalCapital - this.initialCapital;
    this.returnsPercentage =
      ((this.finalCapital - this.initialCapital) * 100) / this.initialCapital;
  }

  /**
   * Updates the capital according to the traded value after executing the entry position.
   * @param tradedValue - Traded value at the time.
   */
  markEntry(tradedValue: number, quote: Quote<T>, strategyName: string) {
    const position = quote.getStrategy(strategyName).position;
    this.isShort = !!position.options?.short;
    this.activeEntryDate = (quote.value as any)?.date || (quote.timestamp ? new Date(quote.timestamp) : new Date());

    // Apply slippage to entry price
    const slippageFactor = this.isShort ? (1 - (this.config.slippage || 0)) : (1 + (this.config.slippage || 0));
    const effectiveEntryPrice = tradedValue * slippageFactor;
    const slippageCost = Math.abs(effectiveEntryPrice - tradedValue);

    this.entryTradedValue = effectiveEntryPrice;

    // Calculate shares with all available capital
    const shares = this.finalCapital / effectiveEntryPrice;
    this.sharesOwned = shares;

    // Apply commission
    const commissionCost = shares * (this.config.commission || 0);
    this.totalCommissions += commissionCost;
    this.totalSlippage += (shares * slippageCost);

    if (this.isShort) {
      // For short: selling shares we don't own. 
      this.finalCapital = this.finalCapital + (shares * effectiveEntryPrice) - commissionCost;
    } else {
      // For long: All capital used to buy shares plus commissions
      const totalCostPerShare = effectiveEntryPrice + (this.config.commission || 0);
      const adjustedShares = this.finalCapital / totalCostPerShare;
      this.sharesOwned = adjustedShares;
      this.finalCapital = 0;
    }

    this.trades.push({
      type: 'entry',
      quote,
      tradedValue: effectiveEntryPrice,
      shares: this.sharesOwned,
      short: this.isShort,
      currentCapital: this.finalCapital,
      commission: commissionCost,
      slippage: slippageCost,
    });
  }

  /**
   * Updates the capital according to the traded value after executing the exit position.
   * @param tradedValue - Traded value at the time.
   */
  markExit(tradedValue: number, quote: Quote<T>, strategyName: string) {
    const position = quote.getStrategy(strategyName).position;
    const exitReason = position.options?.exitReason;
    const exitRatio = Math.min(1.0, Math.max(0, position.options?.exitRatio ?? 1.0));

    if (exitReason === 'stop-loss') {
      this.stopLossExits++;
    } else if (exitReason === 'take-profit') {
      this.takeProfitExits++;
    } else if (exitReason === 'strategy') {
      this.strategyExits++;
    }

    const sharesToExit = this.sharesOwned * exitRatio;
    if (sharesToExit <= 0) return;

    // Apply slippage to exit price
    const slippageFactor = this.isShort ? (1 + (this.config.slippage || 0)) : (1 - (this.config.slippage || 0));
    const effectiveExitPrice = tradedValue * slippageFactor;
    const slippageCost = Math.abs(effectiveExitPrice - tradedValue);

    // Apply commission
    const commissionCost = sharesToExit * (this.config.commission || 0);
    this.totalCommissions += commissionCost;
    this.totalSlippage += (sharesToExit * slippageCost);

    const exitContext = this.buildExitContext(quote, position, effectiveExitPrice);

    let proceeds = 0;
    let costOfExitedShares = 0;

    if (this.isShort) {
      // For short exit: buying back shares.
      // Cash decreases by (sharesToExit * price) + commission
      proceeds = (sharesToExit * effectiveExitPrice) + commissionCost;
      this.finalCapital = this.finalCapital - proceeds;

      // Profit calculation: (EntryPrice * shares) - (ExitPrice * shares) - total commissions
      // For partial: (EntryPrice - ExitPrice) * sharesToExit - exitCommission
      // Note: Entry commission was already deducted from capital.
      costOfExitedShares = sharesToExit * this.entryTradedValue;
      const profitFromExit = costOfExitedShares - (sharesToExit * effectiveExitPrice) - commissionCost;
      this.recordProfit(profitFromExit);
    } else {
      // For long exit: selling shares.
      // Cash increases by proceeds minus commission
      const saleProceeds = (sharesToExit * effectiveExitPrice) - commissionCost;
      this.finalCapital += saleProceeds;

      costOfExitedShares = sharesToExit * this.entryTradedValue;
      const profitFromExit = saleProceeds - costOfExitedShares;
      this.recordProfit(profitFromExit);
    }

    this.trades.push({
      type: 'exit',
      quote,
      tradedValue: effectiveExitPrice,
      shares: sharesToExit,
      short: this.isShort,
      currentCapital: this.finalCapital,
      exitReason,
      exitContext,
      commission: commissionCost,
      slippage: slippageCost,
    });

    this.sharesOwned -= sharesToExit;

    if (this.sharesOwned <= 0.000001) { // Floating point safety
      this.sharesOwned = 0;
      this.isShort = false;
      this.currentCapital = this.finalCapital;
      this.numberOfTrades += 1;
    }

    this.updateTotals();
  }

  private recordProfit(profitAmount: number) {
    if (profitAmount > 0) {
      this.profit += profitAmount;
      this.numberOfWinningTrades += 1;
    } else {
      this.loss += Math.abs(profitAmount);
      this.numberOfLosingTrades += 1;
    }
    this.winningRate =
      this.numberOfWinningTrades /
      (this.numberOfWinningTrades + this.numberOfLosingTrades);
  }

  private buildExitContext<T>(
    quote: Quote<T>,
    position: any,
    exitPrice: number
  ): ExitContext | undefined {
    const entryPrice = position.options?.entryPrice || this.entryTradedValue;
    const entryDate = position.options?.entryDate || this.activeEntryDate;

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

  summary() {
    return {
      initialCapital: this.initialCapital,
      finalCapital: this.finalCapital,
      returnsPercentage: this.returnsPercentage,
      totalTrades: this.numberOfTrades,
      winningRate: this.winningRate,
      totalCommissions: this.totalCommissions,
      totalSlippage: this.totalSlippage,
      stopLossExits: this.stopLossExits,
      takeProfitExits: this.takeProfitExits,
    };
  }
}
