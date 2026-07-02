import { BarSeries } from '@quantomate/core';
import { runSimulation } from '../../../ui/server/src/services/simulation';

describe('runSimulation Return Calculations & Force-Exits', () => {
  const bars = Array.from({ length: 10 }, (_, i) => ({
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

  it('should force-close an open LONG position at the last bar', () => {
    const mockStrategy: any = {
      name: 'TestStrategy',
      evaluate: (series: BarSeries, index: number) => {
        // Enter LONG on bar 5 and never exit
        if (index === 5) return { action: 'entry', direction: 'long' };
        return { action: 'idle' };
      }
    };

    const initialCapital = 10000;
    const result = runSimulation(series, mockStrategy, context, initialCapital, 0, 0, {});

    // Entries / exits check
    expect(result.trades.length).toBe(2);
    expect(result.trades[0].type).toBe('entry');
    expect(result.trades[0].short).toBe(false);
    expect(result.trades[0].tradedValue).toBe(105); // bar index 5 close is 100 + 5 = 105

    expect(result.trades[1].type).toBe('exit');
    expect(result.trades[1].short).toBe(false);
    expect(result.trades[1].tradedValue).toBe(109); // last bar close is 100 + 9 = 109
    expect(result.trades[1].exitReason).toBe('strategy');

    // Return calculations
    // Entry cost = 100 shares * 105 = 10500 (reduced capital to -500)
    // Exit proceeds = 100 shares * 109 = 10900 (final capital = 10400)
    // Expected return = +400 (which is 10900 - 10500)
    expect(result.finalCapital).toBe(10400);
    expect(result.returns).toBe(400);
    expect(result.returnsPercentage).toBe(4.0);
  });

  it('should force-close an open SHORT position at the last bar', () => {
    const mockStrategy: any = {
      name: 'TestStrategy',
      evaluate: (series: BarSeries, index: number) => {
        // Enter SHORT on bar 5 and never exit
        if (index === 5) return { action: 'entry', direction: 'short' };
        return { action: 'idle' };
      }
    };

    const initialCapital = 20000;
    const result = runSimulation(series, mockStrategy, context, initialCapital, 0, 0, {});

    expect(result.trades.length).toBe(2);
    expect(result.trades[0].type).toBe('entry');
    expect(result.trades[0].short).toBe(true);

    expect(result.trades[1].type).toBe('exit');
    expect(result.trades[1].short).toBe(true);
    expect(result.trades[1].tradedValue).toBe(109); // last bar close

    // Return calculations
    // Entry proceeds = 100 shares * 105 = 10500 (capital = 20000 + 10500 = 30500)
    // Exit cost = 100 shares * 109 = 10900 (capital = 30500 - 10900 = 19600)
    // Expected return = -400 (which is 10500 - 10900)
    expect(result.finalCapital).toBe(19600);
    expect(result.returns).toBe(-400);
    expect(result.returnsPercentage).toBe(-2.0);
  });

  it('should not perform duplicate force-close if naturally exited on last bar', () => {
    const mockStrategy: any = {
      name: 'TestStrategy',
      evaluate: (series: BarSeries, index: number) => {
        if (index === 5) return { action: 'entry', direction: 'long' };
        if (index === 9) return { action: 'exit' }; // Exits naturally on last bar
        return { action: 'idle' };
      }
    };

    const initialCapital = 10000;
    const result = runSimulation(series, mockStrategy, context, initialCapital, 0, 0, {});

    // There should only be 1 entry and 1 exit (2 trades total)
    expect(result.trades.length).toBe(2);
    expect(result.trades[0].type).toBe('entry');
    expect(result.trades[1].type).toBe('exit');
    expect(result.trades[1].tradedValue).toBe(109);
    expect(result.finalCapital).toBe(10400);
  });
});
