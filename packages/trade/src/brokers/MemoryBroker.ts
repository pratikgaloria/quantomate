import { IBroker, BrokerAccount, BrokerPosition, OrderRequest, OrderResult, OrderStatus } from '../broker';
import { matchAnySymbolOrOption } from '../utils/symbolMatcher';
import { processMemoryOrder } from './MemoryOrderFiller';

export class MemoryBroker implements IBroker {
  public lastPrices = new Map<string, number>();
  public lastBids = new Map<string, number>();
  public lastAsks = new Map<string, number>();

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

  setLastPrice(symbol: string, price: number, bid?: number, ask?: number, timestamp?: number) {
    this.lastPrices.set(symbol, price);
    if (bid !== undefined) this.lastBids.set(symbol, bid);
    if (ask !== undefined) this.lastAsks.set(symbol, ask);
    if (timestamp !== undefined) this.currentSimulatedTime = timestamp;
    this.updatePortfolioValue();
  }

  public updatePortfolioValue() {
    let positionsValue = 0;
    for (const [symbol, pos] of this.positions.entries()) {
      const currentPrice = this.lastPrices.get(symbol) || pos.avgEntryPrice;
      pos.marketPrice = currentPrice;
      pos.unrealizedPL = (currentPrice - pos.avgEntryPrice) * pos.qty;
      positionsValue += pos.qty * currentPrice;
    }
    this.account.portfolioValue = this.account.cashBalance + positionsValue;
    this.account.marginBuyingPower = this.account.portfolioValue;
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
    return status ? this.orders.filter(o => o.status === status) : this.orders;
  }

  async placeOrder(order: OrderRequest): Promise<OrderResult> {
    return processMemoryOrder(order, this as any, () => this.updatePortfolioValue());
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'pending') return false;
    order.status = 'canceled';
    return true;
  }

  async cleanupSymbols(symbols: string[]): Promise<void> {
    this.orders = this.orders.filter(o => !o.symbol || !matchAnySymbolOrOption(o.symbol, symbols));
    for (const sym of Array.from(this.positions.keys())) {
      if (matchAnySymbolOrOption(sym, symbols)) {
        this.positions.delete(sym);
      }
    }
    this.updatePortfolioValue();
  }

  reset(): void {
    this.positions.clear();
    this.orders = [];
    this.account.cashBalance = this.initialBalance;
    this.account.portfolioValue = this.initialBalance;
    this.account.marginBuyingPower = this.initialBalance;
  }
}
