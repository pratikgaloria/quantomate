import express, { Request, Response } from 'express';
import cors from 'cors';
import strategiesRouter from './routes/strategies';
import backtestRouter from './routes/backtest';
import scanRouter from './routes/scanner';
import portfolioSignalsRouter from './routes/portfolioSignals';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/strategies', strategiesRouter);
app.use('/api/backtest', backtestRouter);
app.use('/api/scan', scanRouter);
app.use('/api/portfolio-signals', portfolioSignalsRouter);
app.use('/api/quotes', portfolioSignalsRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
