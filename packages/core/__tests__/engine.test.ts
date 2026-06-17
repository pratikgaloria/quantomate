import { Series, BarSeries, PositionManager, Backtester, Strategy } from '../src';

describe('Trading Core v2 tests', () => {
  test('Series typed array and pagination checks', () => {
    const s = new Series([10, 20, 30]);
    expect(s.length).toBe(3);
    expect(s.at(0)).toBe(10);
    expect(s.at(-1)).toBe(30);
    expect(s.toArray()).toEqual([10, 20, 30]);
  });

  test('BarSeries columnar typed array checks', () => {
    const bars = [
      { open: 1, high: 2, low: 0.5, close: 1.5, volume: 10, timestamp: 1000 },
      { open: 1.5, high: 3, low: 1, close: 2.5, volume: 20, timestamp: 2000 }
    ];
    const bs = new BarSeries(bars);
    expect(bs.length).toBe(2);
    expect(bs.closes).toEqual(new Float64Array([1.5, 2.5]));
    expect(bs.opens).toEqual(new Float64Array([1, 1.5]));
    expect(bs.highs).toEqual(new Float64Array([2, 3]));
    expect(bs.lows).toEqual(new Float64Array([0.5, 1]));
    expect(bs.volumes).toEqual(new Float64Array([10, 20]));
    expect(bs.timestamps).toEqual(new Float64Array([1000, 2000]));
    
    // Test push
    bs.push({ open: 2.5, high: 4, low: 2, close: 3.5, volume: 30, timestamp: 3000 });
    expect(bs.length).toBe(3);
    expect(bs.closes).toEqual(new Float64Array([1.5, 2.5, 3.5]));
    expect(bs.at(-1)).toEqual({ open: 2.5, high: 4, low: 2, close: 3.5, volume: 30, timestamp: 3000 });
  });

  test('PositionManager state transitions', () => {
    const pm = new PositionManager();
    expect(pm.getState().status).toBe('idle');

    const bar1 = { open: 10, high: 12, low: 9, close: 11, volume: 100, timestamp: 1000 };
    const trans1 = pm.processSignal({ action: 'entry', direction: 'long' }, bar1);
    expect(trans1).toEqual({ type: 'entry', direction: 'long', price: 11, time: 1000 });
    expect(pm.getState()).toEqual({ status: 'long', entryPrice: 11, entryTime: 1000 });

    // Idle checks when already in long
    const trans2 = pm.processSignal({ action: 'entry', direction: 'long' }, bar1);
    expect(trans2).toBeNull();

    const bar2 = { open: 11, high: 15, low: 10, close: 14, volume: 120, timestamp: 2000 };
    const trans3 = pm.processSignal({ action: 'exit' }, bar2);
    expect(trans3).toEqual({ type: 'exit', direction: 'long', price: 14, time: 2000 });
    expect(pm.getState().status).toBe('idle');
  });

  test('Backtester strategy simulation', () => {
    const mockStrat: Strategy = {
      name: 'MockStrat',
      evaluate: (series, index, context) => {
        if (index === 0) return { action: 'entry', direction: 'long' };
        if (index === 1) return { action: 'exit' };
        return { action: 'idle' };
      }
    };

    const tester = new Backtester(mockStrat);
    const bars = [
      { open: 10, high: 12, low: 9, close: 11, volume: 100, timestamp: 1000 },
      { open: 11, high: 15, low: 10, close: 14, volume: 120, timestamp: 2000 },
      { open: 14, high: 16, low: 13, close: 15, volume: 130, timestamp: 3000 }
    ];
    const bs = new BarSeries(bars);
    const trades = tester.run(bs);

    expect(trades.length).toBe(1);
    expect(trades[0]).toEqual({
      type: 'long',
      entryPrice: 11,
      exitPrice: 14,
      entryTime: 1000,
      exitTime: 2000,
      profit: 3,
      profitPercent: (3 / 11) * 100
    });
  });
});
