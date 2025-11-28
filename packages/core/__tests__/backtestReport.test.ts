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
      // Entry at 50: buy 1000/50 = 20 shares, capital becomes 0
      expect(backtestReport.finalCapital).toBe(0);
      expect(backtestReport.sharesOwned).toBe(20);
      expect(backtestReport.trades).toStrictEqual([{
        type: 'entry',
        quote,
        tradedValue: 50,
        shares: 20,
        currentCapital: 0,
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

      // Entry at 50: buy 1000/50 = 20 shares
      // Exit at 100: sell 20*100 = 2000
      // Profit: 2000 - 1000 = 1000
      expect(backtestReport.finalCapital).toBe(2000);
      expect(backtestReport.profit).toBe(1000);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.numberOfLosingTrades).toBe(0);
      expect(backtestReport.numberOfWinningTrades).toBe(1);
      expect(backtestReport.winningRate).toBe(1);
      expect(backtestReport.returns).toBe(1000);
      expect(backtestReport.returnsPercentage).toBe(100);
      expect(backtestReport.trades).toStrictEqual([
        { type: 'entry', quote: quote1, tradedValue: 50, shares: 20, currentCapital: 0 },
        { type: 'exit', quote: quote2, tradedValue: 100, shares: 20, currentCapital: 2000 }
      ])
    });

    it('Should update capital and other metrics accordingly for exit position in case of loss.', () => {
      const backtestReport = new BacktestReport(1000);

      backtestReport.markEntry(50, new Quote(1));
      backtestReport.markExit(25, new Quote(0));

      // Entry at 50: buy 1000/50 = 20 shares
      // Exit at 25: sell 20*25 = 500
      // Loss: 500 - 1000 = -500
      expect(backtestReport.finalCapital).toBe(500);
      expect(backtestReport.loss).toBe(500);
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.numberOfLosingTrades).toBe(1);
      expect(backtestReport.numberOfWinningTrades).toBe(0);
      expect(backtestReport.winningRate).toBe(0);
      expect(backtestReport.returns).toBe(-500);
      expect(backtestReport.returnsPercentage).toBe(-50);
    });
  });
});
