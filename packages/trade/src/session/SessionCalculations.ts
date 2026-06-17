import { SessionManager, VirtualPosition } from './SessionManager';

export function getSessionValue(manager: SessionManager, sessionId: string): number {
  const cash = manager.getVirtualCash(sessionId);
  const positions = manager.positionsMap.get(sessionId);
  let positionsValue = 0;

  if (positions) {
    for (const [symbol, pos] of positions.entries()) {
      const lastPrice = manager.lastPrices.get(symbol.toUpperCase()) ?? pos.entryPrice;
      positionsValue += pos.qty * lastPrice;
    }
  }

  return cash + positionsValue;
}

export function getVirtualPositions(
  manager: SessionManager,
  sessionId: string
): (VirtualPosition & { marketPrice: number; unrealizedPL: number })[] {
  const positions = manager.positionsMap.get(sessionId);
  if (!positions) return [];
  
  return Array.from(positions.values()).map(pos => {
    const lastPrice = manager.lastPrices.get(pos.symbol.toUpperCase()) ?? pos.entryPrice;
    return {
      ...pos,
      marketPrice: lastPrice,
      unrealizedPL: (lastPrice - pos.entryPrice) * pos.qty
    };
  });
}
