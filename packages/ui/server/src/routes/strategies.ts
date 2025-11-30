import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// GET /api/strategies - List all available strategies
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

export default router;
