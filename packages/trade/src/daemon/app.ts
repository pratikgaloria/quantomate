import express from 'express';
import cors from 'cors';
import log from 'npmlog';
import dotenv from 'dotenv';
import path from 'path';
import { PORT, init, startScheduler } from './orchestrator';
import { daemonRouter } from '../api/daemonRoutes';

dotenv.config();
// Load workspace root .env with override: true
dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
  override: true,
});

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount Daemon controller endpoints
app.use(daemonRouter);

// Start listening only on 127.0.0.1 loopback
app.listen(PORT, '127.0.0.1', async () => {
  log.info(
    "Daemon",
    `Trading Daemon server running on http://127.0.0.1:${PORT}`
  );
  
  // Seed configurations/sessions and perform initial engine reconciliation
  await init();
  
  // Start the 60-second periodic reconciliation scheduler
  startScheduler();
});

export default app;
