import dotenv from 'dotenv';
import path from 'path';

// Load environment configurations from workspace root .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../../.env'), override: true });

import express, { Request, Response } from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import strategiesRouter from './routes/strategies';
import customStrategiesRouter from './routes/customStrategies';
import backtestRouter from './routes/backtest';
import scanRouter from './routes/scanner';
import portfolioSignalsRouter from './routes/portfolioSignals';

import tradeRouter from './routes/trade';
import { searchSymbolsHandler } from './routes/searchSymbols';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (body && body.success && body.data) {
      const parseMarkets = (s: any) => {
        if (s && s.enabledMarkets && typeof s.enabledMarkets === 'string') {
          try {
            s.enabledMarkets = JSON.parse(s.enabledMarkets);
          } catch {}
        }
      };
      if (Array.isArray(body.data)) {
        body.data.forEach(parseMarkets);
      } else {
        parseMarkets(body.data);
      }
    }
    return originalJson.call(this, body);
  };
  next();
});

// Routes
app.use('/api/strategies/custom', customStrategiesRouter);
app.use('/api/strategies', strategiesRouter);
app.use('/api/backtest', backtestRouter);
app.use('/api/scan', scanRouter);
app.use('/api/portfolio-signals', portfolioSignalsRouter);
app.use('/api/quotes', portfolioSignalsRouter);

app.get('/api/trade/search-symbols', searchSymbolsHandler);
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
