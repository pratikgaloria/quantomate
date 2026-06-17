import { OptionSelector, PositionTransition } from '@quantomate/core';
import { IBroker, OrderRequest } from './broker';
import { calculateOrderQty } from './executors/sizing';
import { determineOrderSide } from './executors/orderBuilder';

export interface ExecutorConfig {
  tradeOptions?: boolean;
  optionSelector?: OptionSelector;
  allocationSessionId?: string;
  allocationRatio?: number;
}

export interface ExecutorCallbacks {
  getVirtualCash?: (sessionId: string) => number;
  canPlaceOrder?: (sessionId: string, requiredCapital: number, actualCashBalance: number) => { allowed: boolean; reason?: string };
  recordFill?: (sessionId: string, symbol: string, side: string, qty: number, price: number, commission: number) => Promise<void>;
  resolveOptionSymbol?: (underlying: string, optionType: 'CE' | 'PE', underlyingPrice: number, selector?: OptionSelector) => Promise<string | undefined> | string | undefined;
}

export class LiveExecutor {
  constructor(
    private readonly broker: IBroker,
    private readonly config: ExecutorConfig,
    private readonly callbacks: ExecutorCallbacks = {}
  ) {}

  async execute(transition: PositionTransition, underlyingSymbol: string): Promise<void> {
    const isEntry = transition.type === 'entry', isShort = transition.direction === 'short';
    let orderSymbol = underlyingSymbol;

    if (this.config.tradeOptions && this.callbacks.resolveOptionSymbol) {
      const resolved = await this.callbacks.resolveOptionSymbol(underlyingSymbol, isShort ? 'PE' : 'CE', transition.price, this.config.optionSelector);
      if (!resolved) {
        console.warn(`[Executor] Could not find option contract matching selector for ${underlyingSymbol}`);
        return;
      }
      orderSymbol = resolved;
      console.log(`[Executor] Mapped ${transition.type} signal on ${underlyingSymbol} to option: ${orderSymbol}`);
    }

    const positions = await this.broker.getPositions();
    const hasPosition = positions.some(pos => pos.symbol === orderSymbol && (this.config.tradeOptions ? pos.qty > 0 : (isShort ? pos.qty < 0 : pos.qty > 0)));

    if (isEntry && hasPosition) {
      console.log(`[Executor] Already in position for ${orderSymbol}, skipping entry.`);
      return;
    }
    if (!isEntry && !hasPosition) {
      console.log(`[Executor] No position found to exit for ${orderSymbol}, skipping exit.`);
      return;
    }

    let qty = 1;
    const account = await this.broker.getAccountInfo();

    if (isEntry) {
      const sizing = await calculateOrderQty(this.broker, this.config, this.callbacks, orderSymbol, transition.price, account.cashBalance);
      qty = sizing.qty;
      if (qty <= 0) {
        console.warn(`[Executor] Sizing computed quantity 0 for ${orderSymbol}`);
        return;
      }

      const sessionId = this.config.allocationSessionId;
      if (sessionId && this.callbacks.canPlaceOrder) {
        const check = this.callbacks.canPlaceOrder(sessionId, sizing.requiredCapital, account.cashBalance);
        if (!check.allowed) {
          console.warn(`[Executor] Order blocked for ${orderSymbol}: ${check.reason}`);
          return;
        }
      }
    } else {
      const openPos = positions.find(pos => pos.symbol === orderSymbol);
      if (openPos) qty = Math.abs(openPos.qty);
    }

    const side = determineOrderSide(isEntry, isShort, !!this.config.tradeOptions);
    console.log(`[Executor] Placing order: ${side} ${qty} ${orderSymbol}`);
    try {
      const res = await this.broker.placeOrder({ symbol: orderSymbol, qty, side, type: 'market' });
      console.log(`[Executor] Successfully placed order - Order ID: ${res.id}`);
      const sessionId = this.config.allocationSessionId;
      if (sessionId && this.callbacks.recordFill) {
        await this.callbacks.recordFill(sessionId, orderSymbol, side, res.filledQty || qty, res.avgFillPrice || transition.price, res.commissionPaid || 0);
      }
    } catch (err) {
      console.error(`[Executor] Failed to place order for ${orderSymbol}:`, err);
    }
  }
}

export class PaperExecutor {
  public trades: PositionTransition[] = [];
  async execute(transition: PositionTransition, underlyingSymbol: string): Promise<void> {
    this.trades.push(transition);
    console.log(`[PaperExecutor] Simulating transition: ${transition.type} ${transition.direction} on ${underlyingSymbol} @ ${transition.price}`);
  }
}
