import { prisma } from '@quantomate/db';
import { SessionManager } from './SessionManager';
import { matchAnySymbolOrOption } from '../utils/symbolMatcher';

/**
 * Processes a filled order to adjust session virtual cash and positions
 */
export async function recordFill(
  manager: SessionManager,
  sessionId: string,
  symbol: string,
  side: 'buy' | 'sell',
  qty: number,
  price: number,
  commission: number = 0
): Promise<void> {
  const symbolKey = symbol.toUpperCase();
  let cash = manager.getVirtualCash(sessionId);

  let sessionPositions = manager.positionsMap.get(sessionId);
  if (!sessionPositions) {
    sessionPositions = new Map();
    manager.positionsMap.set(sessionId, sessionPositions);
  }

  const existingPos = sessionPositions.get(symbolKey);
  let prevQty = existingPos ? existingPos.qty : 0;
  let entryPrice = existingPos ? existingPos.entryPrice : 0;

  let orderCost = qty * price;
  let newQty = prevQty;

  if (side === 'buy') {
    cash -= (orderCost + commission);
    newQty += qty;

    // If we are opening or adding to a Long position:
    if (prevQty >= 0) {
      if (newQty > 0) {
        entryPrice = (prevQty * entryPrice + qty * price) / newQty;
      } else {
        entryPrice = 0;
      }
    }
    // If we are covering/closing a Short position (prevQty < 0), entryPrice remains unchanged.
  } else {
    // side === 'sell'
    cash += (orderCost - commission);
    newQty -= qty;

    // If we are opening or adding to a Short position:
    if (prevQty <= 0) {
      if (newQty < 0) {
        entryPrice = (Math.abs(prevQty) * entryPrice + qty * price) / Math.abs(newQty);
      } else {
        entryPrice = 0;
      }
    }
    // If we are closing a Long position (prevQty > 0), entryPrice remains unchanged.
  }

  // Update in-memory state
  manager.cashMap.set(sessionId, cash);
  if (Math.abs(newQty) < 0.0001) {
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

/**
 * Cleanup virtual positions matching symbols
 */
export function cleanupVirtualPositions(manager: SessionManager, symbols: string[]): void {
  for (const [sessId, posMap] of manager.positionsMap.entries()) {
    for (const [sym] of Array.from(posMap.keys())) {
      if (matchAnySymbolOrOption(sym, symbols)) {
        posMap.delete(sym);
      }
    }
  }
}
