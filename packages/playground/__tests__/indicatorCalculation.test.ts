import tradeRouter from '../../ui/server/src/routes/trade';
import { DataService } from '@quantomate/data';

const makeMockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Indicator & Historical Prices Router Tests', () => {
  beforeAll(() => {
    // Mock DataService.getHistoricalData
    jest.spyOn(DataService, 'getHistoricalData').mockResolvedValue([
      { date: new Date('2026-06-01T00:00:00Z'), open: 100, high: 110, low: 90, close: 105, volume: 1000 },
      { date: new Date('2026-06-02T00:00:00Z'), open: 105, high: 115, low: 95, close: 110, volume: 1100 },
      { date: new Date('2026-06-03T00:00:00Z'), open: 110, high: 120, low: 100, close: 115, volume: 1200 },
      { date: new Date('2026-06-04T00:00:00Z'), open: 115, high: 125, low: 105, close: 120, volume: 1300 },
      { date: new Date('2026-06-05T00:00:00Z'), open: 120, high: 130, low: 110, close: 125, volume: 1400 }
    ]);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return historical prices', async () => {
    const req: any = {
      query: { symbol: 'AAPL', period: '1y', interval: '1d' }
    };
    const res = makeMockRes();

    // Find GET /historical-prices handler
    const getHandler = (tradeRouter as any).stack.find(
      (layer: any) => layer.route && layer.route.path === '/historical-prices' && layer.route.methods.get
    )?.route.stack[0].handle;

    expect(getHandler).toBeDefined();
    if (!getHandler) throw new Error('getHandler is not defined');

    await (getHandler as any)(req, res, () => {});

    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.success).toBe(true);
    expect(responseData.data.length).toBeGreaterThan(0);
  });

  it('should calculate SMA and EMA correctly via calculate-indicators route', async () => {
    const mockQuotes = [
      { date: '2026-06-01T00:00:00Z', open: 100, high: 110, low: 90, close: 100, volume: 1000 },
      { date: '2026-06-02T00:00:00Z', open: 101, high: 111, low: 91, close: 101, volume: 1000 },
      { date: '2026-06-03T00:00:00Z', open: 102, high: 112, low: 92, close: 102, volume: 1000 },
      { date: '2026-06-04T00:00:00Z', open: 103, high: 113, low: 93, close: 103, volume: 1000 },
      { date: '2026-06-05T00:00:00Z', open: 104, high: 114, low: 94, close: 104, volume: 1000 }
    ];

    const req: any = {
      body: {
        quotes: mockQuotes,
        indicators: [
          { id: 'sma_3', type: 'SMA', params: { period: 3, attribute: 'close' } },
          { id: 'ema_3', type: 'EMA', params: { period: 3, attribute: 'close' } }
        ]
      }
    };
    const res = makeMockRes();

    // Find POST /calculate-indicators handler
    const postHandler = (tradeRouter as any).stack.find(
      (layer: any) => layer.route && layer.route.path === '/calculate-indicators' && layer.route.methods.post
    )?.route.stack[0].handle;

    expect(postHandler).toBeDefined();
    if (!postHandler) throw new Error('postHandler is not defined');

    await (postHandler as any)(req, res, () => {});

    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.success).toBe(true);
    expect(responseData.data.indicators.sma_3).toBeDefined();
    expect(responseData.data.indicators.ema_3).toBeDefined();
    
    // Check SMA calculation
    expect(responseData.data.indicators.sma_3[0]).toBeNaN();
    expect(responseData.data.indicators.sma_3[1]).toBeNaN();
    expect(responseData.data.indicators.sma_3[2]).toBeCloseTo(101);
  });
});
