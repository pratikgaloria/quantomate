import { prisma } from '@quantomate/db';
import { OrderRequest, OrderResult } from '../broker';
import { processPaperBuyFill, processPaperSellFill } from './PaperPositionUpdater';

export async function processPaperOrder(
  order: OrderRequest,
  brokerState: {
    lastPrices: Map<string, number>;
    lastBids: Map<string, number>;
    lastAsks: Map<string, number>;
    currentSimulatedTime?: number;
    commissionPerOrder: number;
    getOrCreateAccount: () => Promise<any>;
  }
): Promise<OrderResult> {
  const account = await brokerState.getOrCreateAccount();
  const isBuy = order.side === 'buy' || order.side === 'buy_to_open' || order.side === 'buy_to_close';
  
  let fillPrice = order.limitPrice;
  if (isBuy) {
    fillPrice = brokerState.lastAsks.get(order.symbol) || brokerState.lastPrices.get(order.symbol) || order.limitPrice;
  } else {
    fillPrice = brokerState.lastBids.get(order.symbol) || brokerState.lastPrices.get(order.symbol) || order.limitPrice;
  }

  console.log(`[PaperBroker] Placing ${order.side.toUpperCase()} order for ${order.qty} shares of ${order.symbol} (${order.type})`);

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
      console.warn(`[PaperBroker] Fallback quote fetch failed for ${order.symbol}:`, err.message);
    }
  }

  if (!fillPrice) {
    throw new Error(`Cannot execute order: no current price available for ${order.symbol}`);
  }

  const dbOrder = await prisma.tradingOrder.create({
    data: {
      accountId: account.id,
      symbol: order.symbol,
      qty: order.qty,
      side: order.side,
      type: order.type,
      price: order.limitPrice || null,
      status: 'pending',
      createdAt: brokerState.currentSimulatedTime ? new Date(brokerState.currentSimulatedTime) : undefined,
    },
  });

  const totalCost = order.qty * fillPrice;
  const commission = brokerState.commissionPerOrder;

  if (isBuy) {
    await processPaperBuyFill(order, account.id, fillPrice, totalCost, commission, account.balance, dbOrder.id);
  } else {
    await processPaperSellFill(order, account.id, fillPrice, totalCost, commission, dbOrder.id);
  }

  const updatedOrder = await prisma.tradingOrder.update({
    where: { id: dbOrder.id },
    data: {
      status: 'filled',
      filledPrice: fillPrice,
      commission,
      updatedAt: brokerState.currentSimulatedTime ? new Date(brokerState.currentSimulatedTime) : undefined,
    },
  });

  console.log(`[PaperBroker] Order FILLED: ${updatedOrder.side.toUpperCase()} ${updatedOrder.symbol} (Qty: ${updatedOrder.qty}) @ ₹${fillPrice.toFixed(2)}`);

  return {
    id: updatedOrder.id,
    clientOrderId: updatedOrder.id,
    status: 'filled',
    filledQty: order.qty,
    avgFillPrice: fillPrice,
    filledAt: brokerState.currentSimulatedTime ? new Date(brokerState.currentSimulatedTime) : updatedOrder.updatedAt,
    commissionPaid: commission,
  };
}
