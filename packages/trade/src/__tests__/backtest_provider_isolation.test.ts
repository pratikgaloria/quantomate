import { DataService, YahooFinanceProvider, IDataProvider } from '@quantomate/data';
import { fetchStockData } from '../../../ui/server/src/services/stockDataFetcher';
import { LiveTradingEngine } from '../engine/LiveTradingEngine';

jest.mock('yahoo-finance2', () => {
  return jest.fn().mockImplementation(() => {
    return {
      quote: jest.fn().mockResolvedValue({ exchangeTimezoneName: 'America/New_York' }),
      chart: jest.fn().mockResolvedValue({ quotes: [] }),
    };
  });
}, { virtual: true });

describe('Data Provider Isolation & Safeguards', () => {
  let originalProvider: IDataProvider;

  beforeAll(() => {
    originalProvider = DataService.provider;
  });

  afterAll(() => {
    DataService.provider = originalProvider;
  });

  it('DataService.getHistoricalData should allow custom provider override', async () => {
    const mockProvider = {
      getHistoricalData: jest.fn().mockResolvedValue([{ date: new Date(), open: 1, high: 2, low: 1, close: 2, volume: 100 }]),
    } as any;

    const mockCustomProvider = {
      getHistoricalData: jest.fn().mockResolvedValue([{ date: new Date(), open: 10, high: 20, low: 10, close: 20, volume: 1000 }]),
    } as any;

    DataService.provider = mockProvider;

    // Use interval !== '1d' to bypass prisma/database sync code
    await DataService.getHistoricalData('AAPL', undefined, '1m');
    expect(mockProvider.getHistoricalData).toHaveBeenCalled();
    expect(mockCustomProvider.getHistoricalData).not.toHaveBeenCalled();

    mockProvider.getHistoricalData.mockClear();

    await DataService.getHistoricalData('AAPL', undefined, '1m', mockCustomProvider);
    expect(mockProvider.getHistoricalData).not.toHaveBeenCalled();
    expect(mockCustomProvider.getHistoricalData).toHaveBeenCalled();
  });

  it('UI fetchStockData should explicitly query YahooFinanceProvider regardless of DataService.provider', async () => {
    const mockLiveProvider = {
      getHistoricalData: jest.fn().mockResolvedValue([]),
    } as any;

    DataService.provider = mockLiveProvider;

    // Spy on DataService.getHistoricalData to bypass DB sync logic
    const spy = jest.spyOn(DataService, 'getHistoricalData').mockResolvedValue([]);

    await fetchStockData('AAPL', '2026-01-01', '2026-01-02', '1d');

    expect(spy).toHaveBeenCalledWith('AAPL', undefined, '1d', expect.any(YahooFinanceProvider));
    expect(mockLiveProvider.getHistoricalData).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('LiveTradingEngine should throw error if started with YahooFinanceProvider on live feed', async () => {
    const mockFeed: any = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      constructor: { name: 'UnknownFeed' } // feed name not matching any configured live broker feed
    };
    const mockBroker: any = {};

    const engine = new LiveTradingEngine(mockFeed, mockBroker, {
      bots: [],
      startDate: '2026-01-01'
    });

    DataService.provider = new YahooFinanceProvider();

    await expect(engine.start()).rejects.toThrow(
      'Trading engine cannot use YahooFinanceProvider for live execution'
    );
  });

  it('LiveTradingEngine should start successfully with YahooFinanceProvider on HistoricalMockFeed', async () => {
    const mockFeed: any = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn(),
      onDisconnect: jest.fn(),
      constructor: { name: 'HistoricalMockFeed' }
    };
    const mockBroker: any = {};

    const engine = new LiveTradingEngine(mockFeed, mockBroker, {
      bots: [],
      startDate: '2026-01-01'
    });

    // Mock WarmupService
    const { WarmupService } = require('../engine/WarmupService');
    jest.spyOn(WarmupService, 'fetchWarmupBars').mockResolvedValue([]);

    DataService.provider = new YahooFinanceProvider();

    await expect(engine.start()).resolves.not.toThrow();
    await engine.stop();
  });
});
