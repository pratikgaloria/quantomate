import { OrderRequest, OrderResult, BrokerAccount, BrokerPosition } from '../broker';
import { updateCashAndPositions } from './MemoryBrokerSizing';

export async function processMemoryOrder(
  order: OrderRequest,
  brokerState: {
    lastPrices: Map<string, number>;
    lastBids: Map<string, number>;
    lastAsks: Map<string, number>;
    account: BrokerAccount;
    positions: Map<string, BrokerPosition>;
    orders: OrderResult[];
    orderCount: number;
    commissionPerOrder: number;
    currentSimulatedTime?: number;
  },
  updatePortfolioValue: () => void
): Promise<OrderResult> {
  const isBuy = order.side === 'buy' || order.side === 'buy_to_open' || order.side === 'buy_to_close';
  let fillPrice = order.limitPrice;

  if (isBuy) {
    fillPrice = brokerState.lastAsks.get(order.symbol) || brokerState.lastPrices.get(order.symbol) || order.limitPrice;
  } else {
    fillPrice = brokerState.lastBids.get(order.symbol) || brokerState.lastPrices.get(order.symbol) || order.limitPrice;
  }

  console.log(`[MemoryBroker] Placing ${order.side.toUpperCase()} order for ${order.qty} shares of ${order.symbol} (${order.type})`);

  if (!fillPrice) {
    try {
      const { DataService } = await import('@quantomate/data');
      const quotes = await DataService.provider.getQuotes([order.symbol]);
      const quote = quotes.get(order.symbol);
      if (quote) {
        fillPrice = isBuy ? (quote.ask || quote.regularMarketPrice) : (quote.bid || quote.regularMarketPrice);
        if (fillPrice) {
          brokerState.lastPrices.set(order.symbol, quote.regularMarketPrice || fillPrice);
          if (quote.bid) brokerState.lastBids.set(order.symbol, quote.bid);
          if (quote.ask) brokerState.lastAsks.set(order.symbol, quote.ask);
        }
      }
    } catch (err: any) {
      console.warn(`[MemoryBroker] Fallback quote fetch failed for ${order.symbol}:`, err.message);
    }
  }

  if (!fillPrice) {
    const errMessage = `Cannot execute order: no current price available for ${order.symbol}`;
    console.error(`[MemoryBroker] ${errMessage}`);
    throw new Error(errMessage);
  }

  const orderId = `ord-${++brokerState.orderCount}`;
  const totalCost = order.qty * fillPrice;
  const commission = brokerState.commissionPerOrder;

  const orderResult: OrderResult = {
    id: orderId,
    clientOrderId: orderId,
    status: 'filled',
    filledQty: order.qty,
    avgFillPrice: fillPrice,
    filledAt: brokerState.currentSimulatedTime ? new Date(brokerState.currentSimulatedTime) : new Date(),
    commissionPaid: commission,
    symbol: order.symbol,
    side: order.side,
  };

  updateCashAndPositions(order, fillPrice, totalCost, commission, isBuy, brokerState, orderResult);

  console.log(`[MemoryBroker] Order FILLED: ${(orderResult.side || 'buy').toUpperCase()} ${orderResult.symbol} (Qty: ${orderResult.filledQty}) @ ₹${orderResult.avgFillPrice?.toFixed(2)}`);

  brokerState.orders.unshift(orderResult);
  updatePortfolioValue();
  return orderResult;
}
