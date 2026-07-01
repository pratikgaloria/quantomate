import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { runBacktest } from '../../ui/server/src/services/backtestRunner';

describe('Pivot Trend Stop-Loss Test Run', () => {
  it('should run backtest with fixed-atr stop-loss', async () => {
    const result = await runBacktest({
      strategyId: 'pivot-trend',
      parameters: {
        direction: 'both',
        stopLossType: 'fixed-atr',
        atrPeriod: 14,
        stopLossMultiplier: 1.5
      },
      stock: {
        symbol: '^NSEI',
        startDate: '2026-06-25',
        endDate: '2026-06-25',
        interval: '1m'
      },
      config: {
        capital: 100000
      }
    });

    console.log(`[Fixed ATR] Stop-Loss Exits: ${result.report.stopLossExits}`);
    console.log(`[Fixed ATR] Strategy Exits: ${result.report.strategyExits}`);
    
    expect(result.report.stopLossExits).toBeGreaterThanOrEqual(0);
    // Verify that the sum matches the exits logged in the trades array
    const exitTrades = result.report.trades.filter((t: any) => t.type === 'exit');
    const slExitsCount = exitTrades.filter((t: any) => t.exitReason === 'stop-loss').length;
    expect(result.report.stopLossExits).toBe(slExitsCount);
  });

  it('should run backtest with trailing-atr stop-loss', async () => {
    const result = await runBacktest({
      strategyId: 'pivot-trend',
      parameters: {
        direction: 'both',
        stopLossType: 'trailing-atr',
        atrPeriod: 14,
        stopLossMultiplier: 1.5
      },
      stock: {
        symbol: '^NSEI',
        startDate: '2026-06-25',
        endDate: '2026-06-25',
        interval: '1m'
      },
      config: {
        capital: 100000
      }
    });

    console.log(`[Trailing ATR] Stop-Loss Exits: ${result.report.stopLossExits}`);
    console.log(`[Trailing ATR] Strategy Exits: ${result.report.strategyExits}`);
    
    expect(result.report.stopLossExits).toBeGreaterThanOrEqual(0);
    const exitTrades = result.report.trades.filter((t: any) => t.type === 'exit');
    const slExitsCount = exitTrades.filter((t: any) => t.exitReason === 'stop-loss').length;
    expect(result.report.stopLossExits).toBe(slExitsCount);
  });

  it('should run backtest with pivot stop-loss', async () => {
    const result = await runBacktest({
      strategyId: 'pivot-trend',
      parameters: {
        direction: 'both',
        stopLossType: 'pivot'
      },
      stock: {
        symbol: '^NSEI',
        startDate: '2026-06-25',
        endDate: '2026-06-25',
        interval: '1m'
      },
      config: {
        capital: 100000
      }
    });

    console.log(`[Pivot SL] Stop-Loss Exits: ${result.report.stopLossExits}`);
    console.log(`[Pivot SL] Strategy Exits: ${result.report.strategyExits}`);
    
    expect(result.report.stopLossExits).toBeGreaterThanOrEqual(0);
    const exitTrades = result.report.trades.filter((t: any) => t.type === 'exit');
    const slExitsCount = exitTrades.filter((t: any) => t.exitReason === 'stop-loss').length;
    expect(result.report.stopLossExits).toBe(slExitsCount);
  });

  it('should produce identical trades between stopLossType: "none" and default configuration', async () => {
    const resultDefault = await runBacktest({
      strategyId: 'pivot-trend',
      parameters: {
        direction: 'both'
      },
      stock: {
        symbol: '^NSEI',
        startDate: '2026-06-25',
        endDate: '2026-06-25',
        interval: '1m'
      },
      config: {
        capital: 100000
      }
    });

    const resultNone = await runBacktest({
      strategyId: 'pivot-trend',
      parameters: {
        direction: 'both',
        stopLossType: 'none'
      },
      stock: {
        symbol: '^NSEI',
        startDate: '2026-06-25',
        endDate: '2026-06-25',
        interval: '1m'
      },
      config: {
        capital: 100000
      }
    });

    expect(resultNone.report.numberOfTrades).toBe(resultDefault.report.numberOfTrades);
    expect(resultNone.report.returns).toBe(resultDefault.report.returns);

    for (let i = 0; i < resultNone.report.trades.length; i++) {
      const tNone = resultNone.report.trades[i];
      const tDefault = resultDefault.report.trades[i];
      expect(tNone.type).toBe(tDefault.type);
      expect(tNone.tradedValue).toBe(tDefault.tradedValue);
      expect(tNone.exitReason).toBe(tDefault.exitReason);
    }
  });
});
