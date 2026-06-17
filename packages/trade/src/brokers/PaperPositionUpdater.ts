import { prisma } from '@quantomate/db';
import { OrderRequest } from '../broker';

export async function processPaperBuyFill(
  order: OrderRequest,
  accountId: string,
  fillPrice: number,
  totalCost: number,
  commission: number,
  accountBalance: number,
  dbOrderId: string
): Promise<void> {
  if (accountBalance < totalCost + commission) {
    await prisma.tradingOrder.update({
      where: { id: dbOrderId },
      data: { status: 'rejected' },
    });
    throw new Error(`Insufficient funds: account balance is ${accountBalance}, required ${totalCost + commission}`);
  }

  await prisma.tradingAccount.update({
    where: { id: accountId },
    data: { balance: { decrement: totalCost + commission } },
  });

  const existingPos = await prisma.tradingPosition.findFirst({
    where: { accountId, symbol: order.symbol },
  });

  if (existingPos) {
    const newQty = existingPos.qty + order.qty;
    if (Math.abs(newQty) < 0.0001) {
      await prisma.tradingPosition.delete({ where: { id: existingPos.id } });
    } else {
      let newAvgPrice = existingPos.entryPrice;
      if (existingPos.qty > 0) {
        newAvgPrice = (existingPos.qty * existingPos.entryPrice + order.qty * fillPrice) / newQty;
      }
      await prisma.tradingPosition.update({
        where: { id: existingPos.id },
        data: { qty: newQty, entryPrice: newAvgPrice },
      });
    }
  } else {
    await prisma.tradingPosition.create({
      data: {
        accountId,
        symbol: order.symbol,
        qty: order.qty,
        entryPrice: fillPrice,
        marketPrice: fillPrice,
      },
    });
  }
}

export async function processPaperSellFill(
  order: OrderRequest,
  accountId: string,
  fillPrice: number,
  totalCost: number,
  commission: number,
  dbOrderId: string
): Promise<void> {
  const existingPos = await prisma.tradingPosition.findFirst({
    where: { accountId, symbol: order.symbol },
  });

  await prisma.tradingAccount.update({
    where: { id: accountId },
    data: { balance: { increment: totalCost - commission } },
  });

  if (existingPos) {
    const newQty = existingPos.qty - order.qty;
    if (Math.abs(newQty) < 0.0001) {
      await prisma.tradingPosition.delete({ where: { id: existingPos.id } });
    } else {
      let newAvgPrice = existingPos.entryPrice;
      if (existingPos.qty < 0) {
        newAvgPrice = (Math.abs(existingPos.qty) * existingPos.entryPrice + order.qty * fillPrice) / Math.abs(newQty);
      }
      await prisma.tradingPosition.update({
        where: { id: existingPos.id },
        data: { qty: newQty, entryPrice: newAvgPrice },
      });
    }
  } else {
    await prisma.tradingPosition.create({
      data: {
        accountId,
        symbol: order.symbol,
        qty: -order.qty,
        entryPrice: fillPrice,
        marketPrice: fillPrice,
      },
    });
  }
}
