import { Request, Response } from 'express';
import { prisma } from '@quantomate/db';

export async function getCustomStrategiesData(req: Request, res: Response) {
  try {
    const customStrategies = await prisma.customStrategy.findMany({
      include: { bots: true },
      orderBy: { createdAt: 'desc' }
    });

    const orders = await prisma.tradingOrder.findMany({ where: { status: 'FILLED' } });
    const positions = await prisma.tradingPosition.findMany();

    const symbolMatchesBot = (tradeSymbol: string, botSym: string): boolean => {
      const tSym = tradeSymbol.toUpperCase();
      const bSymbols = botSym.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      return bSymbols.some(bSym => {
        if (tSym === bSym) return true;
        if (bSym === 'NIFTY 50' && tSym.startsWith('NIFTY')) return true;
        if (bSym === 'NIFTY BANK' && tSym.startsWith('BANKNIFTY')) return true;
        return tSym.startsWith(bSym);
      });
    };

    const data = customStrategies.map(cs => {
      let totalPL = 0;
      for (const bot of cs.bots) {
        let realizedPL = 0;
        let currentQty = 0;
        let avgCost = 0;
        const botOrders = orders.filter(o => o.symbol && symbolMatchesBot(o.symbol, bot.symbol));
        const sortedOrders = [...botOrders].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        for (const ord of sortedOrders) {
          const isBuy = ord.side.toLowerCase().startsWith('buy');
          const price = ord.filledPrice || 0;
          const qty = ord.qty || 0;
          const commission = ord.commission || 0;

          if (isBuy) {
            if (currentQty >= 0) {
              const newQty = currentQty + qty;
              avgCost = newQty > 0 ? (currentQty * avgCost + qty * price) / newQty : 0;
              currentQty = newQty;
            } else {
              const closedQty = Math.min(Math.abs(currentQty), qty);
              realizedPL += closedQty * (avgCost - price) - commission;
              currentQty += qty;
              if (currentQty > 0) avgCost = price;
            }
          } else {
            if (currentQty <= 0) {
              const newQty = currentQty - qty;
              avgCost = newQty < 0 ? (Math.abs(currentQty) * avgCost + qty * price) / Math.abs(newQty) : 0;
              currentQty = newQty;
            } else {
              const closedQty = Math.min(currentQty, qty);
              realizedPL += closedQty * (price - avgCost) - commission;
              currentQty -= qty;
              if (currentQty < 0) avgCost = price;
            }
          }
        }

        const botPositions = positions.filter(p => symbolMatchesBot(p.symbol, bot.symbol));
        const unrealizedPL = botPositions.reduce((sum, pos) => sum + (pos.marketPrice - pos.entryPrice) * pos.qty, 0);
        totalPL += (realizedPL + unrealizedPL);
      }

      return {
        id: cs.id,
        name: cs.name,
        baseType: cs.baseType,
        parameters: cs.parameters,
        interval: cs.interval,
        createdAt: cs.createdAt,
        updatedAt: cs.updatedAt,
        botCount: cs.bots.length,
        totalPL
      };
    });

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error listing custom strategies:', error);
    res.status(500).json({ success: false, error: 'Failed to list custom strategies' });
  }
}
