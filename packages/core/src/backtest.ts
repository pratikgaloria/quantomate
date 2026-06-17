import { BarSeries } from './barSeries';
import { Strategy, StrategyContext } from './strategy';
import { PositionManager } from './position';
import { Series } from './series';
import { Bar } from './types';

export interface BacktestTrade {
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  entryTime: number;
  exitTime: number;
  profit: number;
  profitPercent: number;
}

export class Backtester {
  constructor(
    private readonly strategy: Strategy,
    private readonly indicatorSeriesMap = new Map<string, Series<any>>(),
    private readonly secondarySeriesMap = new Map<string, BarSeries>()
  ) {}

  run(series: BarSeries): BacktestTrade[] {
    const manager = new PositionManager();
    const trades: BacktestTrade[] = [];
    let activeTrade: Partial<BacktestTrade> | null = null;

    const context: StrategyContext = {
      getIndicatorSeries: (name) => this.indicatorSeriesMap.get(name),
      getSecondaryBarSeries: (id) => this.secondarySeriesMap.get(id),
    };

    // Simulate bar-by-bar processing
    for (let i = 0; i < series.length; i++) {
      const bar = series.at(i)!;
      const signal = this.strategy.evaluate(series, i, context);
      const transition = manager.processSignal(signal, bar);

      if (transition) {
        if (transition.type === 'entry') {
          activeTrade = {
            type: transition.direction,
            entryPrice: transition.price,
            entryTime: transition.time,
          };
        } else if (transition.type === 'exit' && activeTrade) {
          const entryPrice = activeTrade.entryPrice!;
          const exitPrice = transition.price;
          const profit = transition.direction === 'long' 
            ? exitPrice - entryPrice 
            : entryPrice - exitPrice;
          const profitPercent = (profit / entryPrice) * 100;

          trades.push({
            ...(activeTrade as BacktestTrade),
            exitPrice,
            exitTime: transition.time,
            profit,
            profitPercent,
          });
          activeTrade = null;
        }
      }
    }

    // Close any open trade at the end of the series
    if (activeTrade && series.length > 0) {
      const lastBar = series.at(-1)!;
      const entryPrice = activeTrade.entryPrice!;
      const exitPrice = lastBar.close;
      const profit = activeTrade.type === 'long'
        ? exitPrice - entryPrice
        : entryPrice - exitPrice;
      const profitPercent = (profit / entryPrice) * 100;

      trades.push({
        ...(activeTrade as BacktestTrade),
        exitPrice,
        exitTime: lastBar.timestamp,
        profit,
        profitPercent,
      });
    }

    return trades;
  }
}
