import { LiveTradingEngine } from '../engine/LiveTradingEngine';
import { BotConfig } from '../engine/engineTypes';
import { BarSeries } from '@quantomate/core';

describe('LiveTradingEngine Multi-Symbol', () => {
  it('should initialize dataset and managers for multiple symbols separately', async () => {
    const mockFeed: any = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn(),
      onDisconnect: jest.fn(),
      constructor: { name: 'HistoricalMockFeed' }
    };

    const mockBroker: any = {};

    const mockStrategy: any = {
      name: 'TestStrat',
      evaluate: jest.fn().mockReturnValue({ action: 'none' })
    };

    const botConfig: BotConfig = {
      id: 'bot_1',
      strategy: mockStrategy,
      symbol: 'AAPL, MSFT',
      symbols: ['AAPL', 'MSFT'],
      interval: '1m',
      executorConfig: { tradeOptions: false }
    };

    const engine = new LiveTradingEngine(mockFeed, mockBroker, {
      bots: [botConfig],
      startDate: '2026-01-01'
    });

    // Mock WarmupService
    const { WarmupService } = require('../engine/WarmupService');
    jest.spyOn(WarmupService, 'fetchWarmupBars').mockResolvedValue([]);

    await engine.start();

    expect(engine.baseSeriesMap.has('AAPL:1m')).toBe(true);
    expect(engine.baseSeriesMap.has('MSFT:1m')).toBe(true);
    expect(engine.positionManagers.has('bot_1:AAPL')).toBe(true);
    expect(engine.positionManagers.has('bot_1:MSFT')).toBe(true);
    expect(mockFeed.subscribe).toHaveBeenCalledWith(['AAPL', 'MSFT'], expect.any(Function));

    await engine.stop();
  });
});

describe('indicatorResolver', () => {
  it('should resolve rsi, sma, and pivotTrend indicators successfully', () => {
    const { createStrategyContext } = require('../engine/indicatorResolver');
    
    const strategy: any = { rsiPeriod: 14, smaPeriod: 50 };
    const baseSeries = new BarSeries([]);
    const baseSeriesMap = new Map<string, BarSeries>();
    const context = createStrategyContext(strategy, baseSeries, baseSeriesMap);

    expect(context.getIndicatorSeries('rsi')).toBeDefined();
    expect(context.getIndicatorSeries('sma')).toBeDefined();
    expect(context.getIndicatorSeries('pivotTrend')).toBeDefined();
    expect(context.getIndicatorSeries('weeklyAvwap')).toBeDefined();
  });
});

describe('strategyInstantiator', () => {
  it('should instantiate LongStraddle and LongStrangle strategies successfully', () => {
    const { instantiateStrategy } = require('../daemon/strategyInstantiator');
    const straddle = instantiateStrategy('LongStraddle', 'bot1', 'AAPL', { rsiPeriod: 14 });
    const strangle = instantiateStrategy('LongStrangle', 'bot1', 'AAPL', { strikeOffset: 3 });

    expect(straddle.name).toBe('LongStraddle_AAPL_bot1');
    expect(strangle.name).toBe('LongStrangle_AAPL_bot1');
  });
});
