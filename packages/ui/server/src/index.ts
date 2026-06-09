import express, { Request, Response } from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import strategiesRouter from './routes/strategies';
import backtestRouter from './routes/backtest';
import scanRouter from './routes/scanner';
import portfolioSignalsRouter from './routes/portfolioSignals';

import tradeRouter from './routes/trade';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/strategies', strategiesRouter);
app.use('/api/backtest', backtestRouter);
app.use('/api/scan', scanRouter);
app.use('/api/portfolio-signals', portfolioSignalsRouter);
app.use('/api/quotes', portfolioSignalsRouter);

app.use('/api/trade', tradeRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Autostart daemon helper
function autostartDaemon() {
  console.log('🔍 Checking if Trading Daemon is running...');
  const DAEMON_PORT = process.env.DAEMON_PORT ? parseInt(process.env.DAEMON_PORT, 10) : 8082;
  
  fetch(`http://127.0.0.1:${DAEMON_PORT}/status`)
    .then(res => {
      if (res.ok) {
        console.log('✅ Trading Daemon is already ONLINE.');
      } else {
        triggerStart();
      }
    })
    .catch(() => {
      triggerStart();
    });

  function triggerStart() {
    console.log('⚠️ Trading Daemon is OFFLINE. Attempting to autostart...');
    const tradeDir = path.resolve(__dirname, '../../../trade');
    exec('npx tsx src/cli.ts start', { cwd: tradeDir }, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Failed to autostart Trading Daemon:', err.message);
      } else {
        console.log('🚀 Autostart command issued successfully.');
        console.log(stdout.trim());
      }
    });
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  autostartDaemon();
});
