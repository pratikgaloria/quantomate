import { SessionManager } from './SessionManager';

/**
 * Checks if a session has hit its maximum allowed drawdown limit.
 */
export function isDrawdownLimitHit(manager: SessionManager, sessionId: string): boolean {
  const startingCapital = manager.capitalMap.get(sessionId) ?? 0;
  if (startingCapital <= 0) return false;

  const currentValue = manager.getSessionValue(sessionId);
  const drawdownPct = ((startingCapital - currentValue) / startingCapital) * 100;
  const maxDrawdown = manager.maxDrawdownMap.get(sessionId) ?? 10;

  return drawdownPct >= maxDrawdown;
}

/**
 * Evaluates if an order can be placed under the session's constraints
 */
export function canPlaceOrder(
  manager: SessionManager,
  sessionId: string,
  requiredCapital: number,
  physicalBuyingPower: number
): { allowed: boolean; reason?: string } {
  if (isDrawdownLimitHit(manager, sessionId)) {
    return { allowed: false, reason: `Session drawdown limit reached.` };
  }

  const availableVirtualCash = manager.getVirtualCash(sessionId);
  if (requiredCapital > availableVirtualCash) {
    return { 
      allowed: false, 
      reason: `Insufficient session virtual cash (Requires: ${requiredCapital.toFixed(2)}, Available: ${availableVirtualCash.toFixed(2)}).` 
    };
  }

  if (requiredCapital > physicalBuyingPower) {
    return { 
      allowed: false, 
      reason: `Insufficient broker physical buying power (Requires: ${requiredCapital.toFixed(2)}, Available: ${physicalBuyingPower.toFixed(2)}).` 
    };
  }

  return { allowed: true };
}
