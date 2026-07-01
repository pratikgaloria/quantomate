import { YahooFinanceProvider } from '../providers/YahooFinanceProvider';

jest.mock('yahoo-finance2', () => {
  return jest.fn().mockImplementation(() => {
    const inst = {
      chart: jest.fn().mockResolvedValue({ quotes: [] }),
      historical: jest.fn().mockResolvedValue([]),
    };
    (global as any).lastYahooFinanceInstance = inst;
    return inst;
  });
});

describe('YahooFinanceProvider - Ticker Resolution', () => {
  let provider: YahooFinanceProvider;

  beforeEach(() => {
    provider = new YahooFinanceProvider();
    if ((global as any).lastYahooFinanceInstance) {
      (global as any).lastYahooFinanceInstance.chart.mockClear();
      (global as any).lastYahooFinanceInstance.historical.mockClear();
    }
  });

  it('should map Nifty indices correctly', async () => {
    const mockChart = (global as any).lastYahooFinanceInstance.chart;
    mockChart.mockResolvedValue({ quotes: [] });
    
    await provider.getHistoricalData('NIFTY 50', new Date(), new Date());
    expect(mockChart).toHaveBeenCalledWith('^NSEI', expect.any(Object));

    await provider.getHistoricalData('NIFTY BANK', new Date(), new Date());
    expect(mockChart).toHaveBeenCalledWith('^NSEBANK', expect.any(Object));
  });

  it('should map NSE equities correctly', async () => {
    const mockChart = (global as any).lastYahooFinanceInstance.chart;
    mockChart.mockResolvedValue({ quotes: [] });
    
    await provider.getHistoricalData('SBIN', new Date(), new Date());
    expect(mockChart).toHaveBeenCalledWith('SBIN.NS', expect.any(Object));
  });

  it('should pass through US equities unchanged', async () => {
    const mockChart = (global as any).lastYahooFinanceInstance.chart;
    mockChart.mockResolvedValue({ quotes: [] });
    
    await provider.getHistoricalData('AAPL', new Date(), new Date());
    expect(mockChart).toHaveBeenCalledWith('AAPL', expect.any(Object));
  });
});
