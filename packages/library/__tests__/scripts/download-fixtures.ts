import { YahooFinanceProvider } from '../../../data/src/providers/YahooFinanceProvider';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const provider = new YahooFinanceProvider();
  const symbol = '^GSPC';
  const start = new Date('2022-01-01T00:00:00Z');
  const end = new Date('2025-12-31T23:59:59Z');

  console.log(`Downloading historical data for ${symbol} from ${start.toISOString()} to ${end.toISOString()}...`);
  
  const data = await provider.getHistoricalData(symbol, start, end, '1d');
  
  if (!data || data.length === 0) {
    throw new Error('No data returned from provider');
  }

  // Convert Date objects to Unix timestamp in milliseconds for Bar interface compatibility
  const bars = data.map(q => ({
    open: q.open,
    high: q.high,
    low: q.low,
    close: q.close,
    volume: q.volume,
    timestamp: new Date(q.date).getTime()
  }));

  const outputDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'sp500.json');
  fs.writeFileSync(outputPath, JSON.stringify(bars, null, 2), 'utf-8');
  console.log(`Successfully downloaded ${bars.length} bars. Saved to ${outputPath}`);
}

main().catch(err => {
  console.error('Download failed:', err);
  process.exit(1);
});
