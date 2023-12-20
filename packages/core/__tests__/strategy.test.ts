// import '@types/jest'
import { Strategy, Indicator, Dataset } from '../src';
import { TradePosition } from '../src/position';
import { Quote } from '../src/quote';
import { StrategyValue } from '../src/strategy';
import { sampleStrategy, sampleBacktest } from './mocks/mock-data';

describe('Strategy', () => {
  describe('constructor', () => {
    it('Should create a valid Strategy object.', () => {
      const strategy = sampleStrategy('new-strategy');

      expect(strategy).toHaveProperty('name');
      expect(strategy.name).toBe('new-strategy');

      expect(strategy).toHaveProperty('options');
      expect(strategy.options.indicators).toHaveLength(1);
    });
  });

  describe('apply', () => {
    const indicator = new Indicator(
      'indicator',
      (ds: Dataset) => ds.valueAt(-1) + 1
    );

    it('Should update quote with entry when last-quote position was idle and entryWhen returns true', () => {
      const entryFn = jest.fn();
      const strategy = new Strategy('strategy', {
        entryWhen: entryFn.mockReturnValue(true),
        exitWhen: () => false,
        indicators: [indicator]
      });

      const quote = new Quote(1);
      quote.setIndicator('indicator', 2);

      strategy.apply(quote);

      expect(entryFn).toHaveBeenCalled();
      expect(entryFn).toHaveBeenCalledWith(quote);
    });

    it('Should update quote with exit when last-quote position was hold and exitWhen returns true', () => {
      const exitFn = jest.fn();
      const strategy = new Strategy('strategy', {
        entryWhen: () => false,
        exitWhen: exitFn.mockReturnValue(true),
        indicators: [indicator]
      });

      const quote = new Quote(1);
      quote.setIndicator('indicator', 2);

      strategy.apply(quote, new TradePosition('hold'));

      expect(exitFn).toHaveBeenCalled();
      expect(exitFn).toHaveBeenCalledWith(quote);
    });

    it('Should update quote with idle when when entryWhen or exitWhen return false', () => {
      const strategy = new Strategy('strategy', {
        entryWhen: () => false,
        exitWhen: () => false,
        indicators: [indicator]
      });

      const quote = new Quote(1);
      quote.setIndicator('indicator', 2);

      expect(strategy.apply(quote)).toStrictEqual(new StrategyValue(new TradePosition('idle', {})))
    });
  });

  describe('backtest', () => {
    it('Should return a back-tested report over a given dataset for a given configuration.', () => {
      const ds = new Dataset(sampleBacktest.dataset);
      const strategy = sampleBacktest.strategy;

      const backtestReport = strategy.backtest(
        ds,
        {
          config: sampleBacktest.configuration,
          onEntry: (quote) => quote.value * 1,
          onExit: (quote) => quote.value * 1,
        }
      );

      expect(backtestReport.currentCapital).toBe(83);
    });
  });
});
