// import '@types/jest';
import { Dataset, Indicator, Strategy, Trader } from '../src';

describe('Trader', () => {
  const dataset = new Dataset([20, 25, 22, 28, 35, 30, 25, 18, 15]);
  const indicator = new Indicator(
    'sma2',
    (ds) => (((ds.at(-2) ?? ds.at(-1))?.value ?? 0) + (ds.at(-1)?.value ?? 0)) / 2
  );
  const strategy = new Strategy('buy-if-sma2-is-above-25', {
    entryWhen: (quote) => {
      const sma2 = quote.getIndicator('sma2');

      return !!sma2 && sma2 > 25;
    },
    exitWhen: (quote) => {
      const sma2 = quote.getIndicator('sma2');

      return !!sma2 && sma2 < 25;
    },
    indicators: [indicator],
  });

  describe('constructor', () => {
    it('Should apply a strategy over a given dataset.', async () => {
      const trader = new Trader(dataset, strategy);

      expect(trader.dataset.strategies).toStrictEqual([
        {
          name: 'buy-if-sma2-is-above-25',
          strategy,
        },
      ]);
    });
  });

  describe('tick', () => {
    it('Should calculate a new position for a new quote.', () => {
      const trader = new Trader(dataset, strategy);

      trader.tick(40).then((strategyValue) => {
        expect(strategyValue?.position.value).toBe('entry');
      });
    });
  });
});
