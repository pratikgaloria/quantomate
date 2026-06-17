import { BarSeries } from './barSeries';
import { TradeSignal } from './types';
import { Series } from './series';

export interface StrategyContext {
  getIndicatorSeries: (name: string) => Series<any> | undefined;
  getSecondaryBarSeries: (id: string) => BarSeries | undefined;
}

export interface Strategy {
  readonly name: string;
  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal;
}
