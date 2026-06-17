import { Router } from 'express';
import { statusRoute } from './statusRoute';
import { controlRoutes } from './controlRoutes';
import { exitRoutes } from './exitRoutes';
import { authRoutes } from './authRoutes';

const router = Router();

router.use(statusRoute);
router.use(controlRoutes);
router.use(exitRoutes);
router.use(authRoutes);

export const daemonRouter = router;
