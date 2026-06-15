import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '@quantomate/db';

const router = Router();

// GET /api/strategies - List all available strategies (base strategies)
router.get('/', (req: Request, res: Response) => {
  try {
    const strategiesPath = path.resolve(__dirname, '../../strategies.json');
    
    if (!fs.existsSync(strategiesPath)) {
      return res.status(404).json({
        error: 'Strategies not found. Run "npm run fetch-strategies" first.'
      });
    }

    const data = fs.readFileSync(strategiesPath, 'utf-8');
    const strategies = JSON.parse(data);
    
    res.json(strategies);
  } catch (error) {
    console.error('Error loading strategies:', error);
    res.status(500).json({ error: 'Failed to load strategies' });
  }
});

// GET /api/strategies/custom - List all custom strategies with bot count & computed P/L
router.get('/custom', async (req: Request, res: Response) => {
  try {
    const customStrategies = await prisma.customStrategy.findMany({
      include: {
        bots: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const orders = await prisma.tradingOrder.findMany({
      where: { status: 'FILLED' }
    });

    const positions = await prisma.tradingPosition.findMany();

    const symbolMatchesBot = (tradeSymbol: string, botSym: string): boolean => {
      const tSym = tradeSymbol.toUpperCase();
      const bSym = botSym.toUpperCase();
      if (tSym === bSym) return true;
      if (bSym === 'NIFTY 50' && tSym.startsWith('NIFTY')) return true;
      if (bSym === 'NIFTY BANK' && tSym.startsWith('BANKNIFTY')) return true;
      if (tSym.startsWith(bSym)) return true;
      return false;
    };

    const data = customStrategies.map(cs => {
      let totalPL = 0;
      for (const bot of cs.bots) {
        // Compute realized PL
        let realizedPL = 0;
        let currentQty = 0;
        let avgCost = 0;
        const botOrders = orders.filter(o => o.symbol && symbolMatchesBot(o.symbol, bot.symbol));
        const sortedOrders = [...botOrders].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        for (const ord of sortedOrders) {
          const isBuy = ord.side.toLowerCase().startsWith('buy') || ord.side.toLowerCase().startsWith('buy_to_open') || ord.side.toLowerCase().startsWith('buy_to_close');
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

        // Compute unrealized PL
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
});

// POST /api/strategies/custom - Create a custom strategy
router.post('/custom', async (req: Request, res: Response) => {
  try {
    const { name, baseType, parameters, interval } = req.body;
    if (!name || !baseType || !interval) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, baseType, or interval' });
    }

    const created = await prisma.customStrategy.create({
      data: {
        name,
        baseType,
        parameters: parameters || {},
        interval
      }
    });

    res.json({ success: true, data: created });
  } catch (error: any) {
    console.error('Error creating custom strategy:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create custom strategy' });
  }
});

// PUT /api/strategies/custom/:id - Update a custom strategy
router.put('/custom/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, baseType, parameters, interval } = req.body;

    const updated = await prisma.customStrategy.update({
      where: { id },
      data: {
        name,
        baseType,
        parameters: parameters || {},
        interval
      }
    });

    // Notify daemon to reconcile
    try {
      await fetch('http://127.0.0.1:8082/reconcile', { method: 'POST' });
    } catch (err) {
      // Ignore daemon notification errors
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating custom strategy:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to update custom strategy' });
  }
});

// DELETE /api/strategies/custom/:id - Delete a custom strategy
router.delete('/custom/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.customStrategy.delete({
      where: { id }
    });

    // Notify daemon
    try {
      await fetch('http://127.0.0.1:8082/reconcile', { method: 'POST' });
    } catch (err) {
      // Ignore
    }

    res.json({ success: true, message: 'Custom strategy deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting custom strategy:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to delete custom strategy' });
  }
});

export default router;
