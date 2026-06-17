import { prisma } from '@quantomate/db';
import { matchAnySymbolOrOption } from '../utils/symbolMatcher';

export async function cleanupPaperSymbols(
  symbols: string[],
  accountId: string
): Promise<void> {
  const dbPositions = await prisma.tradingPosition.findMany({ where: { accountId } });
  const dbOrders = await prisma.tradingOrder.findMany({ where: { accountId } });

  const positionsToDelete = dbPositions.filter(pos => matchAnySymbolOrOption(pos.symbol, symbols)).map(pos => pos.id);
  const ordersToDelete = dbOrders.filter(ord => matchAnySymbolOrOption(ord.symbol, symbols)).map(ord => ord.id);
  
  if (positionsToDelete.length > 0) {
    await prisma.tradingPosition.deleteMany({ where: { id: { in: positionsToDelete } } });
  }
  if (ordersToDelete.length > 0) {
    await prisma.tradingOrder.deleteMany({ where: { id: { in: ordersToDelete } } });
  }
}

export async function resetPaperBroker(accountId: string, initialBalance: number): Promise<void> {
  await prisma.tradingPosition.deleteMany({ where: { accountId } });
  await prisma.tradingOrder.deleteMany({ where: { accountId } });
  await prisma.tradingAccount.update({ where: { id: accountId }, data: { balance: initialBalance } });
}
