import { Router, Request, Response } from 'express';
import { simulationManager } from '../services/simulationManager';

const router = Router();

// GET /api/simulation/status - Get current simulation status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await simulationManager.getStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error fetching simulation status:', error);
    res.status(500).json({ error: 'Failed to fetch status', message: error.message });
  }
});

// POST /api/simulation/start - Start a new simulation
router.post('/start', async (req: Request, res: Response) => {
  try {
    const { symbol, strategyId, parameters, startDate, endDate, interval, speedMs, initialCapital } = req.body;

    if (!symbol || !strategyId || !startDate || !endDate || !interval) {
      return res.status(400).json({
        error: 'Missing required configuration fields: symbol, strategyId, startDate, endDate, interval'
      });
    }

    const session = await simulationManager.start({
      symbol,
      strategyId,
      parameters: parameters || {},
      startDate,
      endDate,
      interval,
      speedMs: speedMs !== undefined ? Number(speedMs) : 100,
      initialCapital: initialCapital !== undefined ? Number(initialCapital) : 100000,
    });

    res.json({
      message: 'Simulation started successfully',
      id: session.id
    });
  } catch (error: any) {
    console.error('Error starting simulation:', error);
    res.status(500).json({ error: 'Failed to start simulation', message: error.message });
  }
});

// POST /api/simulation/pause - Pause the simulation
router.post('/pause', async (req: Request, res: Response) => {
  try {
    const success = await simulationManager.pause();
    if (success) {
      res.json({ message: 'Simulation paused' });
    } else {
      res.status(400).json({ error: 'Simulation is not running or active' });
    }
  } catch (error: any) {
    console.error('Error pausing simulation:', error);
    res.status(500).json({ error: 'Failed to pause simulation', message: error.message });
  }
});

// POST /api/simulation/resume - Resume the simulation
router.post('/resume', async (req: Request, res: Response) => {
  try {
    const success = await simulationManager.resume();
    if (success) {
      res.json({ message: 'Simulation resumed' });
    } else {
      res.status(400).json({ error: 'Simulation is not paused' });
    }
  } catch (error: any) {
    console.error('Error resuming simulation:', error);
    res.status(500).json({ error: 'Failed to resume simulation', message: error.message });
  }
});

// POST /api/simulation/stop - Abort/stop the simulation
router.post('/stop', async (req: Request, res: Response) => {
  try {
    const success = await simulationManager.stop();
    if (success) {
      res.json({ message: 'Simulation stopped' });
    } else {
      res.status(400).json({ error: 'No active simulation to stop' });
    }
  } catch (error: any) {
    console.error('Error stopping simulation:', error);
    res.status(500).json({ error: 'Failed to stop simulation', message: error.message });
  }
});

// POST /api/simulation/speed - Speed up or slow down tick interval
router.post('/speed', async (req: Request, res: Response) => {
  try {
    const { speedMs } = req.body;
    if (speedMs === undefined || isNaN(Number(speedMs))) {
      return res.status(400).json({ error: 'Valid speedMs (number) is required' });
    }

    const success = await simulationManager.setSpeed(Number(speedMs));
    if (success) {
      res.json({ message: 'Simulation speed updated' });
    } else {
      res.status(400).json({ error: 'No active simulation to configure' });
    }
  } catch (error: any) {
    console.error('Error updating simulation speed:', error);
    res.status(500).json({ error: 'Failed to update simulation speed', message: error.message });
  }
});

export default router;
