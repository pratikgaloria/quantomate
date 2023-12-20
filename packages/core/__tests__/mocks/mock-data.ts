import { Dataset, Strategy, Indicator } from '../../src';
import { SMA } from './mock-sma';

export const sampleIndicatorFn = (ds: Dataset) =>
  ds.quotes[ds.length - 1].value * 5;

export const sampleStrategy = (name: string) =>
  new Strategy(name, {
    entryWhen: () => true,
    exitWhen: () => false,
    indicators: [new Indicator('indicator1', sampleIndicatorFn)],
  });

export const sampleBacktest = {
  dataset: [20, 25, 22, 28, 35, 30, 25, 18, 15],
  strategy: new Strategy(
    'new-strategy',
    {
      entryWhen: (quote) => {
        const sma2 = quote.getIndicator('sma2');

        return !!sma2 && sma2 > 25;
      },
      exitWhen: (quote) => {
        const sma2 = quote.getIndicator('sma2');

        return !!sma2 && sma2 < 25;
      },
      indicators: [new SMA('sma2', { period: 2 })]
    }
  ),
  configuration: {
    capital: 100,
  },
  report: {
    currentCapital: 83,
    finalCapital: 83,
    initialCapital: 100,
    loss: 17,
    numberOfTrades: 1,
    profit: 0,
    returns: -17,
    numberOfLosingTrades: 1,
    numberOfWinningTrades: 0,
    winningRate: 0,
  },
};
