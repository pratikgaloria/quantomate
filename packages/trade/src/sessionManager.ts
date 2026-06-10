import { prisma } from '@quantomate/db';

export interface VirtualPosition {
  symbol: string;
  qty: number;
  entryPrice: number;
}

export class SessionManager {
  private static instance: SessionManager;
  
  // Memory cache of session virtual balances and positions
  private cashMap = new Map<string, number>(); // sessionId -> current virtual cash
  private capitalMap = new Map<string, number>(); // sessionId -> starting capital
  private maxDrawdownMap = new Map<string, number>(); // sessionId -> max drawdown percent
  private positionsMap = new Map<string, Map<string, VirtualPosition>>(); // sessionId -> symbol -> position
  private lastPrices = new Map<string, number>(); // symbol -> last known price

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Initializes or reloads session states from the database.
   */
  async loadSessions(): Promise<void> {
    const sessions = await prisma.allocationSession.findMany();
    for (const session of sessions) {
      this.cashMap.set(session.id, session.virtualCash);
      this.capitalMap.set(session.id, session.capital);
      this.maxDrawdownMap.set(session.id, session.maxDrawdownPct);
      if (!this.positionsMap.has(session.id)) {
        this.positionsMap.set(session.id, new Map());
      }
    }
  }

  /**
   * Clear session state when a session is deleted
   */
  clearSessionState(sessionId: string): void {
    this.cashMap.delete(sessionId);
    this.capitalMap.delete(sessionId);
    this.maxDrawdownMap.delete(sessionId);
    this.positionsMap.delete(sessionId);
  }

  /**
   * Updates last known price of a symbol for drawdown calculation
   */
  updateLastPrice(symbol: string, price: number): void {
    this.lastPrices.set(symbol.toUpperCase(), price);
  }

  /**
   * Get virtual cash for a session
   */
  getVirtualCash(sessionId: string): number {
    return this.cashMap.get(sessionId) ?? 0;
  }

  /**
   * Calculates the current total value of a session (cash + open positions)
   */
  getSessionValue(sessionId: string): number {
    const cash = this.getVirtualCash(sessionId);
    const positions = this.positionsMap.get(sessionId);
    let positionsValue = 0;

    if (positions) {
      for (const [symbol, pos] of positions.entries()) {
        const lastPrice = this.lastPrices.get(symbol.toUpperCase()) ?? pos.entryPrice;
        positionsValue += pos.qty * lastPrice;
      }
    }

    return cash + positionsValue;
  }

  /**
   * Get virtual positions for a session with current market prices and P/L
   */
  getVirtualPositions(sessionId: string): (VirtualPosition & { marketPrice: number; unrealizedPL: number })[] {
    const positions = this.positionsMap.get(sessionId);
    if (!positions) return [];
    
    return Array.from(positions.values()).map(pos => {
      const lastPrice = this.lastPrices.get(pos.symbol.toUpperCase()) ?? pos.entryPrice;
      return {
        ...pos,
        marketPrice: lastPrice,
        unrealizedPL: (lastPrice - pos.entryPrice) * pos.qty
      };
    });
  }

  /**
   * Checks if a session has hit its maximum allowed drawdown limit.
   */
  isDrawdownLimitHit(sessionId: string): boolean {
    const startingCapital = this.capitalMap.get(sessionId) ?? 0;
    if (startingCapital <= 0) return false;

    const currentValue = this.getSessionValue(sessionId);
    const drawdownPct = ((startingCapital - currentValue) / startingCapital) * 100;
    const maxDrawdown = this.maxDrawdownMap.get(sessionId) ?? 10;

    return drawdownPct >= maxDrawdown;
  }

  /**
   * Evaluates if an order can be placed under the session's constraints
   */
  canPlaceOrder(sessionId: string, requiredCapital: number, physicalBuyingPower: number): { allowed: boolean; reason?: string } {
    if (this.isDrawdownLimitHit(sessionId)) {
      return { allowed: false, reason: `Session drawdown limit reached.` };
    }

    const availableVirtualCash = this.getVirtualCash(sessionId);
    if (requiredCapital > availableVirtualCash) {
      return { allowed: false, reason: `Insufficient session virtual cash (Requires: ${requiredCapital.toFixed(2)}, Available: ${availableVirtualCash.toFixed(2)}).` };
    }

    if (requiredCapital > physicalBuyingPower) {
      return { allowed: false, reason: `Insufficient broker physical buying power (Requires: ${requiredCapital.toFixed(2)}, Available: ${physicalBuyingPower.toFixed(2)}).` };
    }

    return { allowed: true };
  }

  /**
   * Processes a filled order to adjust session virtual cash and positions
   */
  async recordFill(
    sessionId: string,
    symbol: string,
    side: 'buy' | 'sell',
    qty: number,
    price: number,
    commission: number = 0
  ): Promise<void> {
    const symbolKey = symbol.toUpperCase();
    let cash = this.getVirtualCash(sessionId);

    let sessionPositions = this.positionsMap.get(sessionId);
    if (!sessionPositions) {
      sessionPositions = new Map();
      this.positionsMap.set(sessionId, sessionPositions);
    }

    const existingPos = sessionPositions.get(symbolKey);
    let newQty = existingPos ? existingPos.qty : 0;
    let entryPrice = existingPos ? existingPos.entryPrice : 0;

    if (side === 'buy') {
      cash -= (qty * price + commission);
      
      // Calculate weighted average entry price
      if (newQty > 0) {
        entryPrice = (newQty * entryPrice + qty * price) / (newQty + qty);
      } else {
        entryPrice = price;
      }
      newQty += qty;
    } else {
      cash += (qty * price - commission);
      newQty -= qty;
    }

    // Update in-memory state
    this.cashMap.set(sessionId, cash);
    if (newQty <= 0) {
      sessionPositions.delete(symbolKey);
    } else {
      sessionPositions.set(symbolKey, { symbol, qty: newQty, entryPrice });
    }

    // Persist updated virtual cash in Database
    try {
      await prisma.allocationSession.update({
        where: { id: sessionId },
        data: { virtualCash: cash }
      });
    } catch (err: any) {
      console.error(`[SessionManager] Failed to persist virtual cash to DB: ${err.message}`);
    }
  }
}
