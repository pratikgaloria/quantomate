import { PositionTransition } from '@quantomate/core';
import { LiveExecutor } from '../executor';

describe('LiveExecutor', () => {
  it('should resolve options, validate capital limits, and submit correct order side via LiveExecutor', async () => {
    const mockBroker: any = {
      getAccountInfo: jest.fn().mockResolvedValue({ cashBalance: 10000 }),
      getPositions: jest.fn().mockResolvedValue([]),
      placeOrder: jest.fn().mockResolvedValue({ id: 'ORD_123', avgFillPrice: 50, filledQty: 10, commissionPaid: 5 }),
    };

    const callbacks = {
      resolveOptionSymbol: jest.fn().mockResolvedValue('AAPL_CE_150'),
      getVirtualCash: jest.fn().mockReturnValue(8000),
      canPlaceOrder: jest.fn().mockReturnValue({ allowed: true }),
      recordFill: jest.fn().mockResolvedValue(undefined),
    };

    const config = {
      tradeOptions: true,
      allocationSessionId: 'session_A',
      allocationRatio: 0.1,
    };

    const executor = new LiveExecutor(mockBroker, config, callbacks);

    const transition: PositionTransition = {
      type: 'entry' as const,
      direction: 'long' as const,
      price: 150,
      time: 1234567,
    };

    await executor.execute(transition, 'AAPL');

    expect(callbacks.resolveOptionSymbol).toHaveBeenCalledWith('AAPL', 'CE', 150, undefined);
    expect(callbacks.getVirtualCash).toHaveBeenCalledWith('session_A');
    expect(callbacks.canPlaceOrder).toHaveBeenCalledWith('session_A', 750, 10000);
    expect(mockBroker.placeOrder).toHaveBeenCalledWith({
      symbol: 'AAPL_CE_150',
      qty: 5,
      side: 'buy',
      type: 'market',
    });
    expect(callbacks.recordFill).toHaveBeenCalledWith('session_A', 'AAPL_CE_150', 'buy', 10, 50, 5);
  });
});
