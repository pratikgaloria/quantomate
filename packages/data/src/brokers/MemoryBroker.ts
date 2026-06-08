import { IBroker, BrokerAccount, BrokerPosition, OrderRequest, OrderResult, OrderStatus, OrderSide } from '@quantomate/core';

export class MemoryBroker implements IBroker {
  private lastPrices = new Map<string, number>();
  private lastBids = new Map<string, number>();
  private lastAsks = new Map<string, number>();

  private account: BrokerAccount;
  private positions = new Map<string, BrokerPosition>();
  private orders: OrderResult[] = [];
  private orderCount = 0;
  private currentSimulatedTime?: number;

  constructor(
    public accountName: string,
    public initialBalance: number = 100000,
    public commissionPerOrder: number = 20
  ) {
    this.account = {
      accountId: `mem-${accountName}-${Date.now()}`,
      cashBalance: initialBalance,
      portfolioValue: initialBalance,
      marginBuyingPower: initialBalance,
      currency: 'INR',
      isPaper: true,
    };
  }

  /**
   * Update the latest price information for simulated orders
   */
  setLastPrice(symbol: string, price: number, bid?: number, ask?: number, timestamp?: number) {
    this.lastPrices.set(symbol, price);
    if (bid !== undefined) this.lastBids.set(symbol, bid);
    if (ask !== undefined) this.lastAsks.set(symbol, ask);
    if (timestamp !== undefined) this.currentSimulatedTime = timestamp;
    
    // Update position market prices and PnL
    this.updatePortfolioValue();
  }

  private updatePortfolioValue() {
    let positionsValue = 0;
    for (const [symbol, pos] of this.positions.entries()) {
      const currentPrice = this.lastPrices.get(symbol) || pos.avgEntryPrice;
      pos.marketPrice = currentPrice;
      pos.unrealizedPL = (currentPrice - pos.avgEntryPrice) * pos.qty;
      positionsValue += pos.qty * currentPrice;
    }
    this.account.portfolioValue = this.account.cashBalance + positionsValue;
    this.account.marginBuyingPower = this.account.portfolioValue; // 1x leverage
  }

  async getAccountInfo(): Promise<BrokerAccount> {
    this.updatePortfolioValue();
    return { ...this.account };
  }

  async getPositions(): Promise<BrokerPosition[]> {
    this.updatePortfolioValue();
    return Array.from(this.positions.values());
  }

  async getOrders(status?: OrderStatus): Promise<OrderResult[]> {
    if (status) {
      return this.orders.filter(o => o.status === status);
    }
    return this.orders;
  }

  async placeOrder(order: OrderRequest): Promise<OrderResult> {
    const isBuy = order.side === 'buy' || order.side === 'buy_to_open' || order.side === 'buy_to_close';
    
    let fillPrice = order.limitPrice;
    if (isBuy) {
      fillPrice = this.lastAsks.get(order.symbol) || this.lastPrices.get(order.symbol) || order.limitPrice;
    } else {
      fillPrice = this.lastBids.get(order.symbol) || this.lastPrices.get(order.symbol) || order.limitPrice;
    }

    console.log(`[MemoryBroker] Placing ${order.side.toUpperCase()} order for ${order.qty} shares of ${order.symbol} (${order.type})`);

    if (!fillPrice) {
      const errMessage = `Cannot execute order: no current price available for ${order.symbol}`;
      console.error(`[MemoryBroker] ${errMessage}`);
      throw new Error(errMessage);
    }

    const orderId = `ord-${++this.orderCount}`;
    const totalCost = order.qty * fillPrice;
    const commission = this.commissionPerOrder;

    const orderResult: OrderResult = {
      id: orderId,
      clientOrderId: orderId,
      status: 'filled',
      filledQty: order.qty,
      avgFillPrice: fillPrice,
      filledAt: this.currentSimulatedTime ? new Date(this.currentSimulatedTime) : new Date(),
      commissionPaid: commission,
      symbol: order.symbol,
      side: order.side,
    };

    if (isBuy) {
      if (this.account.cashBalance < totalCost + commission) {
        orderResult.status = 'rejected';
        this.orders.unshift(orderResult);
        console.error(`[MemoryBroker] Order REJECTED for ${order.symbol}: Insufficient funds (Balance: ₹${this.account.cashBalance.toFixed(2)}, Required: ₹${(totalCost + commission).toFixed(2)})`);
        throw new Error(`Insufficient funds: account balance is ${this.account.cashBalance.toFixed(2)}, required ${(totalCost + commission).toFixed(2)}`);
      }

      this.account.cashBalance -= (totalCost + commission);
      
      const existing = this.positions.get(order.symbol);
      if (existing) {
        const newQty = existing.qty + order.qty;
        const newAvgPrice = (existing.qty * existing.avgEntryPrice + order.qty * fillPrice) / newQty;
        existing.qty = newQty;
        existing.avgEntryPrice = newAvgPrice;
        existing.marketPrice = fillPrice;
        existing.costBasis = newAvgPrice * newQty;
      } else {
        this.positions.set(order.symbol, {
          symbol: order.symbol,
          qty: order.qty,
          avgEntryPrice: fillPrice,
          marketPrice: fillPrice,
          unrealizedPL: 0,
          costBasis: totalCost,
        });
      }
    } else {
      // Sell order
      const existing = this.positions.get(order.symbol);
      const positionQty = existing ? existing.qty : 0;

      // Update balance
      this.account.cashBalance += (totalCost - commission);

      if (existing) {
        const newQty = existing.qty - order.qty;
        if (newQty <= 0) {
          this.positions.delete(order.symbol);
        } else {
          existing.qty = newQty;
          existing.costBasis = existing.avgEntryPrice * newQty;
        }
      } else {
        // Create short position if no existing long position
        this.positions.set(order.symbol, {
          symbol: order.symbol,
          qty: -order.qty,
          avgEntryPrice: fillPrice,
          marketPrice: fillPrice,
          unrealizedPL: 0,
          costBasis: -totalCost,
        });
      }
    }

    console.log(`[MemoryBroker] Order FILLED: ${(orderResult.side || 'buy').toUpperCase()} ${orderResult.symbol} (Qty: ${orderResult.filledQty}) @ ₹${orderResult.avgFillPrice?.toFixed(2)}`);

    this.orders.unshift(orderResult);
    this.updatePortfolioValue();
    return orderResult;
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'pending') return false;
    order.status = 'canceled';
    console.log(`[MemoryBroker] Order CANCELED: ID ${orderId}`);
    return true;
  }
}
