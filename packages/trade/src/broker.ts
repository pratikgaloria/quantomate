export interface BrokerAccount {
  accountId: string;
  cashBalance: number;
  portfolioValue: number;
  marginBuyingPower: number;
  currency: string;
  isPaper: boolean;
}

export type OrderSide = 'buy' | 'sell' | 'buy_to_open' | 'sell_to_close' | 'buy_to_close' | 'sell_to_open';
export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit';
export type OrderStatus = 'pending' | 'submitted' | 'filled' | 'canceled' | 'rejected';

export interface OrderRequest {
  symbol: string;             // Stock ticker or Option contract ID or Zerodha instrument token
  qty: number;
  side: OrderSide;
  type: OrderType;
  limitPrice?: number;
  stopPrice?: number;
  timeInForce?: 'day' | 'gtc' | 'ioc';
  parentOrderId?: string;     // For bracket orders (take-profit/stop-loss legs)
}

export interface OrderResult {
  id: string;
  clientOrderId: string;
  status: OrderStatus;
  filledQty: number;
  avgFillPrice?: number;
  filledAt?: Date;
  commissionPaid?: number;
  symbol?: string;
  side?: OrderSide;
}

export interface BrokerPosition {
  symbol: string;
  qty: number;
  avgEntryPrice: number;
  marketPrice: number;
  unrealizedPL: number;
  costBasis: number;
}

export interface IBroker {
  getAccountInfo(): Promise<BrokerAccount>;
  getPositions(): Promise<BrokerPosition[]>;
  placeOrder(order: OrderRequest): Promise<OrderResult>;
  cancelOrder(orderId: string): Promise<boolean>;
  getOrders(status?: OrderStatus): Promise<OrderResult[]>;
  setLastPrice?(symbol: string, price: number, bid?: number, ask?: number, timestamp?: number): void;
  cleanupSymbols?(symbols: string[]): Promise<void>;
  reset?(): Promise<void> | void;
}
