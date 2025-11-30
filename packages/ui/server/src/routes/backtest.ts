import { Router, Request, Response } from 'express';
import { runBacktest } from '../services/backtestRunner';

const router = Router();

// POST /api/backtest - Run a backtest
router.post('/', async (req: Request, res: Response) => {
  try {
    const { strategyId, parameters, stock, config } = req.body;

    // Validate request
    if (!strategyId || !stock || !config) {
      return res.status(400).json({
        error: 'Missing required fields: strategyId, stock, config'
      });
    }

    // Run backtest
    const result = await runBacktest({
      strategyId,
      parameters: parameters || {},
      stock,
      config
    });

    res.json(result);
  } catch (error: any) {
    console.error('Backtest error:', error);
    res.status(500).json({
      error: 'Backtest failed',
      message: error.message
    });
  }
});

export default router;
