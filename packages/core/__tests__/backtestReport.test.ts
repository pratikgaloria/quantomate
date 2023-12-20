// import '@types/jest';
import { BacktestReport } from '../src';
import { Quote } from '../src/quote';

describe('BacktestReport', () => {
  describe('constructor', () => {
    it('Should initialize with initialCapital and other default values.', () => {
      const backtestReport = new BacktestReport(1000);

      expect(backtestReport.initialCapital).toBe(1000);
      expect(backtestReport.profit).toBe(0);
      expect(backtestReport.loss).toBe(0);
      expect(backtestReport.numberOfTrades).toBe(0);
      expect(backtestReport.returns).toBe(0);
      expect(backtestReport.finalCapital).toBe(1000);
    });
  });

  describe('markEntry', () => {
    it('Should update capital accordingly for entry position.', () => {
      const backtestReport = new BacktestReport(1000);
      const quote = new Quote(1);

      backtestReport.markEntry(50, quote);
      expect(backtestReport.finalCapital).toBe(950);
      expect(backtestReport.trades).toStrictEqual([{
        type: 'entry',
        quote,
        tradedValue: 50,
        currentCapital: 950,
      }]);
    });
  });

  describe('markExit', () => {
    it('Should update capital and other metrics accordingly for exit position in case of profit.', () => {
      const backtestReport = new BacktestReport(1000);
      const quote1 = new Quote(1);
      const quote2 = new Quote(2);

      backtestReport.markEntry(50, quote1);
      backtestReport.markExit(100, quote2);

      expect(backtestReport.finalCapital).toBe(1050);
      expect(backtestReport.profit).toBe(50);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.numberOfLosingTrades).toBe(0);
      expect(backtestReport.numberOfWinningTrades).toBe(1);
      expect(backtestReport.winningRate).toBe(1);
      expect(backtestReport.returns).toBe(5);
      expect(backtestReport.trades).toStrictEqual([
        { type: 'entry', quote: quote1, tradedValue: 50, currentCapital: 950 },
        { type: 'exit', quote: quote2, tradedValue: 100, currentCapital: 1050 }
      ])
    });

    it('Should update capital and other metrics accordingly for exit position in case of loss.', () => {
      const backtestReport = new BacktestReport(1000);

      backtestReport.markEntry(50, new Quote(1));
      backtestReport.markExit(0, new Quote(0));

      expect(backtestReport.finalCapital).toBe(950);
      expect(backtestReport.loss).toBe(50);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.numberOfLosingTrades).toBe(1);
      expect(backtestReport.numberOfWinningTrades).toBe(0);
      expect(backtestReport.winningRate).toBe(0);
      expect(backtestReport.returns).toBe(-5);
    });
  });
});
