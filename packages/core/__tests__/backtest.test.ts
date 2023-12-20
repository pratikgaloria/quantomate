// import '@types/jest'
import { Backtest, Dataset, Strategy } from '../src';
import { sampleBacktest } from './mocks/mock-data';
import { SMA } from './mocks/mock-sma';


describe('Backtest', () => {
  const dataset = new Dataset(sampleBacktest.dataset);
  const strategy = sampleBacktest.strategy;

  describe('constructor', () => {
    it('Should run back-test over a given dataset for a given strategy.', async () => {
      const backtest = new Backtest(dataset, strategy);

      expect(backtest.dataset.strategies).toStrictEqual([
        {
          name: strategy.name,
          strategy,
        },
      ]);
    });
  });

  describe('run', () => {
    it('Should return a report over a back-tested dataset for a given configuration.', () => {
      const backtest = new Backtest(dataset, strategy);
      const backtestReport = backtest.run({
        config: { capital: 100 },
        onEntry: (quote) => quote.value * 1,
        onExit: (quote) => quote.value * 1,
      });

      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBe(17);
      expect(backtestReport.returns).toBe(-17);
      expect(backtestReport.finalCapital).toBe(83);
    });

    it('Should exit the last trade and return a report if it was on hold.', () => {
      const dataset2 = new Dataset([20, 25, 22, 28, 35, 30, 25, 28, 32]);
      const backtest = new Backtest(dataset2, strategy);
      const backtestReport = backtest.run({
        config: { capital: 100 },
        onEntry: (quote) => quote.value * 1,
        onExit: (quote) => quote.value * 1,
      });

      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBe(3);
      expect(backtestReport.returns).toBe(-3);
      expect(backtestReport.finalCapital).toBe(97);
    });

    it('Should run over a dataset with objects.', () => {
      const dataset2 = new Dataset(
        sampleBacktest.dataset.map((v) => ({ close: v }))
      );

      const strategy2 = new Strategy<unknown, { close: number }>('close-strategy', {
        entryWhen: (quote) => {
          const sma2 = quote.getIndicator('sma2');

          return !!sma2 && sma2 > 25;
        },
        exitWhen: (quote) => {
          const sma2 = quote.getIndicator('sma2');

          return !!sma2 && sma2 < 25;
        },
        indicators: [new SMA('sma2', { period: 2, attribute: 'close' })],
      });

      const backtest = new Backtest(dataset2, strategy2);
      const backtestReport = backtest.run({
        config: { capital: 100 },
        onEntry: (quote) => quote.value.close * 1,
        onExit: (quote) => quote.value.close * 1,
      });

      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBe(17);
      expect(backtestReport.returns).toBe(-17);
      expect(backtestReport.finalCapital).toBe(83);
    });
  });
});
