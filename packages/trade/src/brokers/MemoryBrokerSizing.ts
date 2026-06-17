import { OrderRequest, BrokerAccount, BrokerPosition, OrderResult } from '../broker';

export function updateCashAndPositions(
  order: OrderRequest,
  fillPrice: number,
  totalCost: number,
  commission: number,
  isBuy: boolean,
  brokerState: {
    account: BrokerAccount;
    positions: Map<string, BrokerPosition>;
    orders: OrderResult[];
  },
  orderResult: OrderResult
): void {
  if (isBuy) {
    if (brokerState.account.cashBalance < totalCost + commission) {
      orderResult.status = 'rejected';
      brokerState.orders.unshift(orderResult);
      throw new Error(`Insufficient funds: account balance is ${brokerState.account.cashBalance.toFixed(2)}, required ${(totalCost + commission).toFixed(2)}`);
    }

    brokerState.account.cashBalance -= (totalCost + commission);
    const existing = brokerState.positions.get(order.symbol);

    if (existing) {
      const newQty = existing.qty + order.qty;
      if (Math.abs(newQty) < 0.0001) {
        brokerState.positions.delete(order.symbol);
      } else {
        if (existing.qty > 0) {
          existing.avgEntryPrice = (existing.qty * existing.avgEntryPrice + order.qty * fillPrice) / newQty;
        }
        existing.qty = newQty;
        existing.marketPrice = fillPrice;
        existing.costBasis = existing.avgEntryPrice * newQty;
      }
    } else {
      brokerState.positions.set(order.symbol, {
        symbol: order.symbol,
        qty: order.qty,
        avgEntryPrice: fillPrice,
        marketPrice: fillPrice,
        unrealizedPL: 0,
        costBasis: totalCost,
      });
    }
  } else {
    const existing = brokerState.positions.get(order.symbol);
    brokerState.account.cashBalance += (totalCost - commission);

    if (existing) {
      const newQty = existing.qty - order.qty;
      if (Math.abs(newQty) < 0.0001) {
        brokerState.positions.delete(order.symbol);
      } else {
        if (existing.qty < 0) {
          existing.avgEntryPrice = (Math.abs(existing.qty) * existing.avgEntryPrice + order.qty * fillPrice) / Math.abs(newQty);
        }
        existing.qty = newQty;
        existing.marketPrice = fillPrice;
        existing.costBasis = existing.avgEntryPrice * newQty;
      }
    } else {
      brokerState.positions.set(order.symbol, {
        symbol: order.symbol,
        qty: -order.qty,
        avgEntryPrice: fillPrice,
        marketPrice: fillPrice,
        unrealizedPL: 0,
        costBasis: -totalCost,
      });
    }
  }
}
