import { Router, Request, Response } from 'express';
import { runScan } from '../services/scanner';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// POST /api/scan - Run a scan for all symbols in symbols.json
router.post('/', async (req: Request, res: Response) => {
  try {
    const { strategyId, parameters } = req.body;

    if (!strategyId) {
      return res.status(400).json({
        error: 'Missing required field: strategyId'
      });
    }

    const results = await runScan(strategyId, parameters || {});
    res.json(results);
  } catch (error: any) {
    console.error('Scan error:', error);
    res.status(500).json({
      error: 'Scan failed',
      message: error.message
    });
  }
});

// GET /api/symbols - Get the list of symbols
router.get('/symbols', (req: Request, res: Response) => {
  try {
    const symbolsPath = path.resolve(__dirname, '../../symbols.json');
    const symbols = JSON.parse(fs.readFileSync(symbolsPath, 'utf-8'));
    res.json(symbols);
  } catch (error) {
    console.error('Error loading symbols:', error);
    res.status(500).json({ error: 'Failed to load symbols' });
  }
});

export default router;
