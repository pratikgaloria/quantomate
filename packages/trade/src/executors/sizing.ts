import { IBroker } from '../broker';
import { ExecutorConfig, ExecutorCallbacks } from '../executor';

export async function calculateOrderQty(
  broker: IBroker,
  config: ExecutorConfig,
  callbacks: ExecutorCallbacks,
  orderSymbol: string,
  currentPrice: number,
  accountBalance: number
): Promise<{ qty: number; requiredCapital: number }> {
  const allocation = config.allocationRatio ?? (config.tradeOptions ? 0.05 : 0.95);
  const sessionId = config.allocationSessionId;
  
  let targetCapital = accountBalance;
  if (sessionId && callbacks.getVirtualCash) {
    targetCapital = callbacks.getVirtualCash(sessionId);
  }

  const tradeCapital = targetCapital * allocation;

  let tradePrice = currentPrice;
  if (config.tradeOptions && 'lastPrices' in (broker as any)) {
    tradePrice = (broker as any).lastPrices?.get(orderSymbol) || 100;
  }

  const qty = Math.floor(tradeCapital / tradePrice);
  const requiredCapital = qty * tradePrice;

  return { qty, requiredCapital };
}
