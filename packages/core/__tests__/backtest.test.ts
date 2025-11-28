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

      // Entry at 35: buy 100/35 = 2.857 shares
      // Exit at 18: sell 2.857*18 = 51.43
      // Loss: 51.43 - 100 = -48.57
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBeCloseTo(48.57, 1);
      expect(backtestReport.returns).toBeCloseTo(-48.57, 1);
      expect(backtestReport.finalCapital).toBeCloseTo(51.43, 1);
    });

    it('Should exit the last trade and return a report if it was on hold.', () => {
      const dataset2 = new Dataset([20, 25, 22, 28, 35, 30, 25, 28, 32]);
      const backtest = new Backtest(dataset2, strategy);
      const backtestReport = backtest.run({
        config: { capital: 100 },
        onEntry: (quote) => quote.value * 1,
        onExit: (quote) => quote.value * 1,
      });

      // Entry at 35: buy 100/35 = 2.857 shares  
      // Exit at 32 (forced): sell 2.857*32 = 91.43
      // Loss: 91.43 - 100 = -8.57
      expect(backtestReport.numberOfTrades).toBe(1);
      expect(backtestReport.loss).toBeCloseTo(8.57, 1);
      expect(backtestReport.returns).toBeCloseTo(-8.57, 1);
      expect(backtestReport.finalCapital).toBeCloseTo(91.43, 1);
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
      // Entry at 35: buy 100/35 = 2.857 shares
      // Exit at 18: sell 2.857*18 = 51.43
      // Loss: 51.43 - 100 = -48.57
      expect(backtestReport.returns).toBeCloseTo(-48.57, 1);
      expect(backtestReport.finalCapital).toBeCloseTo(51.43, 1);
    });
  });
});

