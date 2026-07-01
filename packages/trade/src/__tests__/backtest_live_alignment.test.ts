import { BarSeries, PositionManager } from '@quantomate/core';
import { runSimulation } from '../../../ui/server/src/services/simulation';

describe('Backtest vs Live Execution Alignment', () => {
  it('should produce identical entry/exit timestamps for a strategy', () => {
    const mockStrategy: any = {
      name: 'RsiMeanReversion',
      evaluate: (series: BarSeries, index: number, context: any) => {
        if (index === 15) return { action: 'entry', direction: 'long' };
        if (index === 30) return { action: 'exit' };
        return { action: 'idle' };
      }
    };

    const bars = Array.from({ length: 50 }, (_, i) => ({
      open: 100 + i,
      high: 105 + i,
      low: 95 + i,
      close: 100 + i,
      volume: 1000,
      timestamp: 1780000000 + i * 15 * 60 * 1000
    }));
    const series = new BarSeries(bars);

    const context: any = {
      getIndicatorSeries: () => null,
      getSecondaryBarSeries: () => null,
    };
    const startTs = 1780000000;
    const backtestResult = runSimulation(series, mockStrategy, context, 100000, 0, 0, {}, startTs);

    const manager = new PositionManager();
    const liveSignals: any[] = [];
    for (let i = 0; i < series.length; i++) {
      const bar = series.at(i)!;
      context.getPositionStatus = () => manager.getState().status;
      context.getPosition = () => manager.getState();
      const sig = mockStrategy.evaluate(series, i, context);
      const transition = manager.processSignal(sig, bar);
      if (transition) liveSignals.push(transition);
    }

    const backtestExits = backtestResult.trades;
    expect(backtestExits.length).toBe(2);
    expect(liveSignals.length).toBe(2);

    expect(backtestExits[0].type).toBe('entry');
    expect(liveSignals[0].type).toBe('entry');
    expect(backtestExits[0].date.getTime()).toBe(liveSignals[0].time);

    expect(backtestExits[1].type).toBe('exit');
    expect(liveSignals[1].type).toBe('exit');
    expect(backtestExits[1].date.getTime()).toBe(liveSignals[1].time);
  });
});
