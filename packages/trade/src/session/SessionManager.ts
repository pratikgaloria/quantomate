import { prisma } from '@quantomate/db';
import { isDrawdownLimitHit, canPlaceOrder } from './SessionRiskManager';
import { recordFill, cleanupVirtualPositions } from './SessionFillRecorder';
import { getSessionValue, getVirtualPositions } from './SessionCalculations';

export interface VirtualPosition {
  symbol: string;
  qty: number;
  entryPrice: number;
}

export class SessionManager {
  private static instance: SessionManager;
  
  public cashMap = new Map<string, number>();
  public capitalMap = new Map<string, number>();
  public maxDrawdownMap = new Map<string, number>();
  public positionsMap = new Map<string, Map<string, VirtualPosition>>();
  public lastPrices = new Map<string, number>();

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  async loadSessions(): Promise<void> {
    const sessions = await prisma.allocationSession.findMany();
    const activeIds = new Set(sessions.map(s => s.id));
    
    for (const id of Array.from(this.cashMap.keys())) {
      if (!activeIds.has(id)) this.clearSessionState(id);
    }
    
    for (const session of sessions) {
      this.cashMap.set(session.id, session.virtualCash);
      this.capitalMap.set(session.id, session.capital);
      this.maxDrawdownMap.set(session.id, session.maxDrawdownPct);
      if (!this.positionsMap.has(session.id)) {
        this.positionsMap.set(session.id, new Map());
      }
    }
  }

  clearSessionState(sessionId: string): void {
    this.cashMap.delete(sessionId);
    this.capitalMap.delete(sessionId);
    this.maxDrawdownMap.delete(sessionId);
    this.positionsMap.delete(sessionId);
  }

  updateLastPrice(symbol: string, price: number): void {
    this.lastPrices.set(symbol.toUpperCase(), price);
  }

  getVirtualCash(sessionId: string): number {
    return this.cashMap.get(sessionId) ?? 0;
  }

  getSessionValue(sessionId: string): number {
    return getSessionValue(this, sessionId);
  }

  getVirtualPositions(sessionId: string) {
    return getVirtualPositions(this, sessionId);
  }

  isDrawdownLimitHit(sessionId: string): boolean {
    return isDrawdownLimitHit(this, sessionId);
  }

  canPlaceOrder(sessionId: string, requiredCapital: number, physicalBuyingPower: number): { allowed: boolean; reason?: string } {
    return canPlaceOrder(this, sessionId, requiredCapital, physicalBuyingPower);
  }

  async recordFill(sessionId: string, symbol: string, side: 'buy' | 'sell', qty: number, price: number, commission: number = 0): Promise<void> {
    return recordFill(this, sessionId, symbol, side, qty, price, commission);
  }

  cleanupVirtualPositions(symbols: string[]): void {
    return cleanupVirtualPositions(this, symbols);
  }
}
