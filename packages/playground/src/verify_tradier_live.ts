import dotenv from 'dotenv';
import { TradierLiveFeed, TradierInstrumentMapper } from '@quantomate/data';

dotenv.config(); 
dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../../.env' });
dotenv.config({ path: '/home/dev/projects/quantomate-portfolio/.env' });

async function main() {
  const token = process.env.TRADIER_API_KEY;
  if (!token) {
    console.error('ERROR: TRADIER_API_KEY is not defined in environment variables.');
    return;
  }

  const useSandbox = process.env.TRADIER_ENV !== 'production';
  console.log(`Using Tradier API token: ${token.substring(0, 5)}... (Sandbox: ${useSandbox})`);

  // 1. Resolve ATM option contract for AAPL
  console.log('\n--- Test 1: Resolving ATM Option for AAPL ---');
  const underlyingPrice = 180.0;
  console.log(`Resolving option for AAPL at price $${underlyingPrice}...`);
  
  const option = await TradierInstrumentMapper.findATMOption(
    'AAPL',
    'CE',
    underlyingPrice,
    token,
    useSandbox
  );

  if (!option) {
    console.warn('Could not resolve ATM option contract. Proceeding to stream equity only.');
  } else {
    console.log(`Successfully resolved ATM option:`, option);
  }

  // 2. Setup Tradier Live Feed
  console.log('\n--- Test 2: Connecting to Tradier Live Feed ---');
  const feed = new TradierLiveFeed(token, useSandbox);

  try {
    await feed.connect();
    console.log('Connected to Tradier Live Feed stream successfully.');

    const symbolsToSubscribe = ['AAPL'];
    if (option) {
      symbolsToSubscribe.push(option.symbol);
    }

    console.log(`Subscribing to: ${symbolsToSubscribe.join(', ')}`);
    feed.subscribe(symbolsToSubscribe, (tick) => {
      console.log(`[TICK] Symbol: ${tick.symbol}, Price: $${tick.price}, Bid: $${tick.bid || '-'}, Ask: $${tick.ask || '-'}, Volume: ${tick.volume}, Time: ${new Date(tick.timestamp).toLocaleTimeString()}`);
    });

    console.log('\nStreaming active. Logging ticks for 15 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 15000));

    console.log('\nDisconnecting feed...');
    await feed.disconnect();
    console.log('Disconnected successfully.');
  } catch (error: any) {
    console.error('Streaming Test Failed:', error.message);
  }
}

main().catch((err) => {
  console.error('Unhandled script error:', err);
});
