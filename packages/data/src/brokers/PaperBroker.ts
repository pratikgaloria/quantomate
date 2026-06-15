import { IBroker, BrokerAccount, BrokerPosition, OrderRequest, OrderResult, OrderStatus, OrderSide } from '@quantomate/core';
import { prisma } from '@quantomate/db';

export class PaperBroker implements IBroker {
  private lastPrices = new Map<string, number>();
  private lastBids = new Map<string, number>();
  private lastAsks = new Map<string, number>();

  constructor(
    public accountName: string,
    public initialBalance: number = 100000,
    public commissionPerOrder: number = 20 // Zerodha-like flat flat fee (INR 20)
  ) {}

  /**
   * Keep track of the latest price ticks to execute market orders
   */
  private currentSimulatedTime?: number;

  setLastPrice(symbol: string, price: number, bid?: number, ask?: number, timestamp?: number) {
    this.lastPrices.set(symbol, price);
    if (bid !== undefined) this.lastBids.set(symbol, bid);
    if (ask !== undefined) this.lastAsks.set(symbol, ask);
    if (timestamp !== undefined) this.currentSimulatedTime = timestamp;
  }

  async getAccountInfo(): Promise<BrokerAccount> {
    let account = await prisma.tradingAccount.findFirst({
      where: { name: this.accountName, provider: 'paper' },
    });

    if (!account) {
      account = await prisma.tradingAccount.create({
        data: {
          name: this.accountName,
          provider: 'paper',
          balance: this.initialBalance,
          currency: 'INR',
          isLive: false,
        },
      });
    }

    return {
      accountId: account.id,
      cashBalance: account.balance,
      portfolioValue: account.balance, // Simple calculation for now
      marginBuyingPower: account.balance, // 1x leverage for paper
      currency: account.currency,
      isPaper: true,
    };
  }

  async getPositions(): Promise<BrokerPosition[]> {
    const account = await this.getOrCreateAccount();
    const dbPositions = await prisma.tradingPosition.findMany({
      where: { accountId: account.id },
    });

    return dbPositions.map((pos) => {
      const currentPrice = this.lastPrices.get(pos.symbol) || pos.entryPrice;
      const unrealizedPL = (currentPrice - pos.entryPrice) * pos.qty;
      return {
        symbol: pos.symbol,
        qty: pos.qty,
        avgEntryPrice: pos.entryPrice,
        marketPrice: currentPrice,
        unrealizedPL,
        costBasis: pos.entryPrice * pos.qty,
      };
    });
  }

  async getOrders(status?: OrderStatus): Promise<OrderResult[]> {
    const account = await this.getOrCreateAccount();
    const dbOrders = await prisma.tradingOrder.findMany({
      where: {
        accountId: account.id,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return dbOrders.map((ord) => ({
      id: ord.id,
      clientOrderId: ord.id,
      status: ord.status as OrderStatus,
      filledQty: ord.qty, // Market fills all immediately in this simulator
      avgFillPrice: ord.filledPrice || undefined,
      filledAt: ord.updatedAt,
      commissionPaid: ord.commission,
      symbol: ord.symbol,
      side: ord.side as OrderSide,
    }));
  }

  async placeOrder(order: OrderRequest): Promise<OrderResult> {
    const account = await this.getOrCreateAccount();
    
    const isBuy = order.side === 'buy' || order.side === 'buy_to_open' || order.side === 'buy_to_close';
    
    // Choose fill price based on bid/ask spread (Buy at Ask, Sell at Bid)
    let fillPrice = order.limitPrice;
    if (isBuy) {
      fillPrice = this.lastAsks.get(order.symbol) || this.lastPrices.get(order.symbol) || order.limitPrice;
    } else {
      fillPrice = this.lastBids.get(order.symbol) || this.lastPrices.get(order.symbol) || order.limitPrice;
    }

    console.log(`[PaperBroker] Placing ${order.side.toUpperCase()} order for ${order.qty} shares of ${order.symbol} (${order.type})`);

    if (!fillPrice) {
      try {
        const { DataService } = await import('../DataService');
        const quotes = await DataService.provider.getQuotes([order.symbol]);
        const quote = quotes.get(order.symbol);
        if (quote) {
          fillPrice = isBuy ? (quote.ask || quote.regularMarketPrice) : (quote.bid || quote.regularMarketPrice);
          if (fillPrice) {
            this.lastPrices.set(order.symbol, quote.regularMarketPrice || fillPrice);
            if (quote.bid) this.lastBids.set(order.symbol, quote.bid);
            if (quote.ask) this.lastAsks.set(order.symbol, quote.ask);
          }
        }
      } catch (err: any) {
        console.warn(`[PaperBroker] Fallback quote fetch failed for ${order.symbol}:`, err.message);
      }
    }

    if (!fillPrice) {
      const errMessage = `Cannot execute order: no current price available for ${order.symbol}`;
      console.error(`[PaperBroker] ${errMessage}`);
      throw new Error(errMessage);
    }

    // Initialize order row
    const dbOrder = await prisma.tradingOrder.create({
      data: {
        accountId: account.id,
        symbol: order.symbol,
        qty: order.qty,
        side: order.side,
        type: order.type,
        price: order.limitPrice || null,
        status: 'pending',
        createdAt: this.currentSimulatedTime ? new Date(this.currentSimulatedTime) : undefined,
      },
    });

    // Execute order immediately for market orders (or limit orders matching the price)
    const totalCost = order.qty * fillPrice;
    const commission = this.commissionPerOrder;

    if (isBuy) {
      // Check cash balance
      if (account.balance < totalCost + commission) {
        await prisma.tradingOrder.update({
          where: { id: dbOrder.id },
          data: { status: 'rejected' },
        });
        console.error(`[PaperBroker] Order REJECTED for ${order.symbol}: Insufficient funds (Balance: ₹${account.balance.toFixed(2)}, Required: ₹${(totalCost + commission).toFixed(2)})`);
        throw new Error(`Insufficient funds: account balance is ${account.balance}, required ${totalCost + commission}`);
      }

      // Update balance
      await prisma.tradingAccount.update({
        where: { id: account.id },
        data: { balance: { decrement: totalCost + commission } },
      });

      // Update position
      const existingPos = await prisma.tradingPosition.findFirst({
        where: { accountId: account.id, symbol: order.symbol },
      });

      if (existingPos) {
        const newQty = existingPos.qty + order.qty;
        if (Math.abs(newQty) < 0.0001) {
          await prisma.tradingPosition.delete({
            where: { id: existingPos.id },
          });
        } else {
          let newAvgPrice = existingPos.entryPrice;
          if (existingPos.qty > 0) {
            newAvgPrice = (existingPos.qty * existingPos.entryPrice + order.qty * fillPrice) / newQty;
          }
          await prisma.tradingPosition.update({
            where: { id: existingPos.id },
            data: { qty: newQty, entryPrice: newAvgPrice },
          });
        }
      } else {
        await prisma.tradingPosition.create({
          data: {
            accountId: account.id,
            symbol: order.symbol,
            qty: order.qty,
            entryPrice: fillPrice,
            marketPrice: fillPrice,
          },
        });
      }
    } else {
      // Sell order
      const existingPos = await prisma.tradingPosition.findFirst({
        where: { accountId: account.id, symbol: order.symbol },
      });

      // Update balance
      await prisma.tradingAccount.update({
        where: { id: account.id },
        data: { balance: { increment: totalCost - commission } },
      });

      // Update or delete position
      if (existingPos) {
        const newQty = existingPos.qty - order.qty;
        if (Math.abs(newQty) < 0.0001) {
          await prisma.tradingPosition.delete({
            where: { id: existingPos.id },
          });
        } else {
          let newAvgPrice = existingPos.entryPrice;
          if (existingPos.qty < 0) {
            newAvgPrice = (Math.abs(existingPos.qty) * existingPos.entryPrice + order.qty * fillPrice) / Math.abs(newQty);
          }
          await prisma.tradingPosition.update({
            where: { id: existingPos.id },
            data: { qty: newQty, entryPrice: newAvgPrice },
          });
        }
      } else {
        // Create short position if no existing long position
        await prisma.tradingPosition.create({
          data: {
            accountId: account.id,
            symbol: order.symbol,
            qty: -order.qty,
            entryPrice: fillPrice,
            marketPrice: fillPrice,
          },
        });
      }
    }

    // Update order status to filled
    const updatedOrder = await prisma.tradingOrder.update({
      where: { id: dbOrder.id },
      data: {
        status: 'filled',
        filledPrice: fillPrice,
        commission,
        updatedAt: this.currentSimulatedTime ? new Date(this.currentSimulatedTime) : undefined,
      },
    });

    console.log(`[PaperBroker] Order FILLED: ${updatedOrder.side.toUpperCase()} ${updatedOrder.symbol} (Qty: ${updatedOrder.qty}) @ ₹${fillPrice.toFixed(2)}`);

    return {
      id: updatedOrder.id,
      clientOrderId: updatedOrder.id,
      status: 'filled',
      filledQty: order.qty,
      avgFillPrice: fillPrice,
      filledAt: this.currentSimulatedTime ? new Date(this.currentSimulatedTime) : updatedOrder.updatedAt,
      commissionPaid: commission,
    };
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = await prisma.tradingOrder.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'pending') {
      return false;
    }

    await prisma.tradingOrder.update({
      where: { id: orderId },
      data: { status: 'canceled' },
    });

    console.log(`[PaperBroker] Order CANCELED: ID ${orderId}`);
    return true;
  }

  private async getOrCreateAccount() {
    let account = await prisma.tradingAccount.findFirst({
      where: { name: this.accountName, provider: 'paper' },
    });

    if (!account) {
      account = await prisma.tradingAccount.create({
        data: {
          name: this.accountName,
          provider: 'paper',
          balance: this.initialBalance,
          currency: 'INR',
          isLive: false,
        },
      });
    }

    return account;
  }

  getLastPricesMap(): Record<string, number> {
    const res: Record<string, number> = {};
    for (const [sym, price] of this.lastPrices.entries()) {
      res[sym] = price;
    }
    return res;
  }

  async cleanupSymbols(symbols: string[]): Promise<void> {
    const account = await this.getOrCreateAccount();
    
    const dbPositions = await prisma.tradingPosition.findMany({
      where: { accountId: account.id }
    });
    
    const dbOrders = await prisma.tradingOrder.findMany({
      where: { accountId: account.id }
    });
    
    const symbolMatchesAny = (tradeSymbol: string): boolean => {
      const tSym = tradeSymbol.toUpperCase();
      return symbols.some(botSymbol => {
        const bSym = botSymbol.toUpperCase();
        if (tSym === bSym) return true;
        if (bSym === 'NIFTY 50' && tSym.startsWith('NIFTY')) return true;
        if (bSym === 'NIFTY BANK' && tSym.startsWith('BANKNIFTY')) return true;
        if (tSym.startsWith(bSym)) return true;
        return false;
      });
    };
    
    const positionsToDelete = dbPositions.filter(pos => symbolMatchesAny(pos.symbol)).map(pos => pos.id);
    const ordersToDelete = dbOrders.filter(ord => symbolMatchesAny(ord.symbol)).map(ord => ord.id);
    
    if (positionsToDelete.length > 0) {
      await prisma.tradingPosition.deleteMany({
        where: { id: { in: positionsToDelete } }
      });
    }
    
    if (ordersToDelete.length > 0) {
      await prisma.tradingOrder.deleteMany({
        where: { id: { in: ordersToDelete } }
      });
    }
  }

  async reset(): Promise<void> {
    const account = await this.getOrCreateAccount();
    await prisma.tradingPosition.deleteMany({
      where: { accountId: account.id }
    });
    await prisma.tradingOrder.deleteMany({
      where: { accountId: account.id }
    });
    await prisma.tradingAccount.update({
      where: { id: account.id },
      data: { balance: this.initialBalance }
    });
  }
}
