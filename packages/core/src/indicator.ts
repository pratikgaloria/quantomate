import { BarSeries } from './barSeries';
import { Series } from './series';

export interface Indicator<P = any, R = number> {
  readonly name: string;
  calculate(series: BarSeries): Series<R>;
}

export abstract class IndicatorBase<P = any, R = number> implements Indicator<P, R> {
  constructor(
    public readonly name: string,
    protected readonly params: P
  ) {}

  abstract calculate(series: BarSeries): Series<R>;
}

export class FunctionalIndicator<R = number> implements Indicator<any, R> {
  constructor(
    public readonly name: string,
    private readonly calcFn: (series: BarSeries) => Series<R>
  ) {}

  calculate(series: BarSeries): Series<R> {
    return this.calcFn(series);
  }
}
