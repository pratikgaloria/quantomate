import { IBroker, BrokerAccount, BrokerPosition, OrderRequest, OrderResult, OrderStatus } from '../broker';
import { prisma } from '@quantomate/db';
import { processPaperOrder } from './PaperOrderFiller';
import { cleanupPaperSymbols, resetPaperBroker } from './PaperCleanup';

export class PaperBroker implements IBroker {
  public lastPrices = new Map<string, number>();
  public lastBids = new Map<string, number>();
  public lastAsks = new Map<string, number>();
  public currentSimulatedTime?: number;

  constructor(
    public accountName: string, 
    public initialBalance: number = 100000, 
    public commissionPerOrder: number = 20,
    public isLive: boolean = false
  ) {}

  setLastPrice(symbol: string, price: number, bid?: number, ask?: number, timestamp?: number) {
    this.lastPrices.set(symbol, price);
    if (bid !== undefined) this.lastBids.set(symbol, bid);
    if (ask !== undefined) this.lastAsks.set(symbol, ask);
    if (timestamp !== undefined) this.currentSimulatedTime = timestamp;
  }

  async getAccountInfo(): Promise<BrokerAccount> {
    const account = await this.getOrCreateAccount();
    return { accountId: account.id, cashBalance: account.balance, portfolioValue: account.balance, marginBuyingPower: account.balance, currency: account.currency, isPaper: true };
  }

  async getPositions(): Promise<BrokerPosition[]> {
    const account = await this.getOrCreateAccount();
    const dbPositions = await prisma.tradingPosition.findMany({ where: { accountId: account.id } });
    return dbPositions.map(pos => {
      const currentPrice = this.lastPrices.get(pos.symbol) || pos.entryPrice;
      return { symbol: pos.symbol, qty: pos.qty, avgEntryPrice: pos.entryPrice, marketPrice: currentPrice, unrealizedPL: (currentPrice - pos.entryPrice) * pos.qty, costBasis: pos.entryPrice * pos.qty };
    });
  }

  async getOrders(status?: OrderStatus): Promise<OrderResult[]> {
    const account = await this.getOrCreateAccount();
    const dbOrders = await prisma.tradingOrder.findMany({ where: { accountId: account.id, ...(status ? { status } : {}) }, orderBy: { createdAt: 'desc' } });
    return dbOrders.map(ord => ({
      id: ord.id, clientOrderId: ord.id, status: ord.status as OrderStatus, filledQty: ord.qty, avgFillPrice: ord.filledPrice || undefined, filledAt: ord.updatedAt, commissionPaid: ord.commission, symbol: ord.symbol, side: ord.side as any
    }));
  }

  async placeOrder(order: OrderRequest): Promise<OrderResult> { return processPaperOrder(order, this as any); }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = await prisma.tradingOrder.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'pending') return false;
    return !!await prisma.tradingOrder.update({ where: { id: orderId }, data: { status: 'canceled' } });
  }

  public async getOrCreateAccount() {
    const existing = await prisma.tradingAccount.findFirst({ 
      where: { name: this.accountName, provider: 'paper', isLive: this.isLive } 
    });
    if (existing) {
      if (existing.balance < this.initialBalance) {
        return prisma.tradingAccount.update({
          where: { id: existing.id },
          data: { balance: this.initialBalance }
        });
      }
      return existing;
    }
    return prisma.tradingAccount.create({
      data: { name: this.accountName, provider: 'paper', balance: this.initialBalance, currency: 'INR', isLive: this.isLive }
    });
  }

  getLastPricesMap(): Record<string, number> { return Object.fromEntries(this.lastPrices); }

  async cleanupSymbols(symbols: string[]): Promise<void> {
    const account = await this.getOrCreateAccount();
    await cleanupPaperSymbols(symbols, account.id);
  }

  async reset(): Promise<void> {
    const account = await this.getOrCreateAccount();
    await resetPaperBroker(account.id, this.initialBalance);
  }
}
