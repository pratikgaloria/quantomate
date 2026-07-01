import { Router } from 'express';
import { prisma } from '@quantomate/db';
import { getCustomStrategiesData } from './customStratHelpers';

const router = Router();

router.get('/', getCustomStrategiesData);

router.post('/', async (req, res) => {
  try {
    const { name, baseType, parameters, interval } = req.body;
    if (!name || !baseType || !interval) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, baseType, or interval' });
    }
    const created = await prisma.customStrategy.create({
      data: { name, baseType, parameters: parameters || {}, interval }
    });
    res.json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create custom strategy' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, baseType, parameters, interval } = req.body;
    const updated = await prisma.customStrategy.update({
      where: { id },
      data: { name, baseType, parameters: parameters || {}, interval }
    });
    try {
      await fetch('http://127.0.0.1:8082/reconcile', { method: 'POST' });
    } catch {}
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update custom strategy' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customStrategy.delete({ where: { id } });
    try {
      await fetch('http://127.0.0.1:8082/reconcile', { method: 'POST' });
    } catch {}
    res.json({ success: true, message: 'Custom strategy deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete custom strategy' });
  }
});

export default router;
