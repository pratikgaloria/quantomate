import { BacktestReport } from '../src';
import { Quote } from '../src/quote';

describe('BacktestReport Risk Analytics', () => {
  describe('getRiskMetrics', () => {
    it('should return correct risk metrics', () => {
      const report = new BacktestReport(1000);
      
      const quote1 = new Quote(1);
      const quote2 = new Quote(2);
      const quote3 = new Quote(3);
      
      quote1.setStrategy('test', { position: { value: 'entry', options: {} } } as any);
      quote2.setStrategy('test', { position: { value: 'exit', options: { exitReason: 'stop-loss' } } } as any);
      quote3.setStrategy('test', { position: { value: 'exit', options: { exitReason: 'take-profit' } } } as any);

      report.markEntry(50, quote1);
      report.markExit(40, quote2, 'test'); // Stop-loss
      report.markEntry(40, quote1);
      report.markExit(50, quote3, 'test'); // Take-profit

      const metrics = report.getRiskMetrics();
      
      expect(metrics.totalExits).toBe(2);
      expect(metrics.stopLossExits).toBe(1);
      expect(metrics.takeProfitExits).toBe(1);
      expect(metrics.strategyExits).toBe(0);
      expect(metrics.stopLossRate).toBe(0.5);
      expect(metrics.takeProfitRate).toBe(0.5);
      expect(metrics.strategyExitRate).toBe(0);
    });
  });

  describe('analyzeStopLossExits', () => {
    it('should analyze stop-loss exits', () => {
      const report = new BacktestReport(1000);
      
      const quote1 = new Quote(1);
      const quote2 = new Quote(2);
      
      quote1.setStrategy('test', { 
        position: { 
          value: 'entry', 
          options: { 
            entryPrice: 100,
            entryDate: new Date('2024-01-01')
          } 
        } 
      } as any);
      
      quote2.setStrategy('test', { 
        position: { 
          value: 'exit', 
          options: { 
            exitReason: 'stop-loss',
            entryPrice: 100,
            entryDate: new Date('2024-01-01')
          } 
        } 
      } as any);

      report.markEntry(100, quote1);
      report.markExit(90, quote2, 'test');

      const analysis = report.analyzeStopLossExits();
      
      expect(analysis).not.toBeNull();
      expect(analysis!.count).toBe(1);
      expect(analysis!.avgLossPercent).toBe(-10);
      expect(analysis!.trades).toHaveLength(1);
    });

    it('should return null when no stop-loss exits', () => {
      const report = new BacktestReport(1000);
      
      const analysis = report.analyzeStopLossExits();
      
      expect(analysis).toBeNull();
    });
  });

  describe('exit context', () => {
    it('should capture exit context with entry/exit prices and duration', () => {
      const report = new BacktestReport(1000);
      
      const entryDate = new Date('2024-01-01T10:00:00Z');
      const exitDate = new Date('2024-01-01T11:00:00Z');
      
      const quote1 = new Quote(1);
      const quote2 = new Quote(2);
      
      quote1.setStrategy('test', { 
        position: { 
          value: 'entry', 
          options: { 
            entryPrice: 100,
            entryDate: entryDate
          } 
        } 
      } as any);
      
      quote2.setStrategy('test', { 
        position: { 
          value: 'exit', 
          options: { 
            exitReason: 'stop-loss',
            entryPrice: 100,
            entryDate: entryDate
          } 
        } 
      } as any);

      report.markEntry(100, quote1);
      report.markExit(95, quote2, 'test');

      const exitTrade = report.trades.find(t => t.type === 'exit');
      
      expect(exitTrade?.exitContext).toBeDefined();
      expect(exitTrade?.exitContext?.entryPrice).toBe(100);
      expect(exitTrade?.exitContext?.exitPrice).toBe(95);
      expect(exitTrade?.exitContext?.priceChange).toBe(-5);
      expect(exitTrade?.exitContext?.priceChangePercent).toBe(-5);
    });
  });
});
