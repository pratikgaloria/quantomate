import { BarSeries } from './barSeries';
import { TradeSignal } from './types';
import { Series } from './series';
import { PositionState } from './position';

export interface StrategyContext {
  getIndicatorSeries: (name: string) => Series<any> | undefined;
  getSecondaryBarSeries: (id: string) => BarSeries | undefined;
  getPositionStatus?: () => 'idle' | 'long' | 'short';
  getPosition?: () => PositionState | undefined;
}

export interface Strategy {
  readonly name: string;
  evaluate(series: BarSeries, index: number, context: StrategyContext): TradeSignal;
  getRequiredSecondaryIntervals?(baseInterval: string): string[];
}
