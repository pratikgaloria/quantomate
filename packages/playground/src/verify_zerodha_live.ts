import dotenv from 'dotenv';
// @ts-ignore
import { KiteConnect, KiteTicker } from 'kiteconnect';

dotenv.config({ path: '/home/dev/projects/quantomate-portfolio/.env' });
delete process.env.QUANTOMATE_DATABASE_URL;


async function main() {
  // Dynamically import DB and Data modules after env variables are loaded
  const { prisma } = await import('@quantomate/db');
  const { KiteInstrumentMapper } = await import('@quantomate/data');

  console.log('DATABASE_URL inside main:', process.env.DATABASE_URL);
  console.log('Fetching active Zerodha session from DB...');

  const allSessions = await prisma.tradingSession.findMany();
  console.log('All sessions found by Prisma:', allSessions);
  const session = allSessions.find(s => s.provider === 'zerodha');


  if (!session) {
    console.error('ERROR: No Zerodha session found in the database. Please visit http://127.0.0.1:8081/auth/zerodha/login to log in first.');
    return;
  }

  const apiKey = process.env.ZERODHA_API_KEY;

  if (!apiKey) {
    console.error('ERROR: ZERODHA_API_KEY environment variable is not set.');
    return;
  }

  console.log(`Active session found (Created at: ${session.createdAt.toISOString()}).`);
  console.log('Initializing KiteConnect client...');
  
  const kc = new KiteConnect({
    api_key: apiKey,
    access_token: session.accessToken,
  });

  // 1. Fetch quotes
  console.log('\n--- Test 1: Fetching Quotes ---');
  try {
    const quotes = await kc.getLTP(['NSE:INFY', 'NSE:SBIN']);
    console.log('Success! Quotes fetched:');
    console.log(quotes);
  } catch (err: any) {
    console.error('Failed to fetch quotes:', err.message);
  }

  // 2. Verify WebSocket
  console.log('\n--- Test 2: Connecting to KiteTicker WebSocket ---');
  try {
    console.log('Loading instrument mapper...');
    await KiteInstrumentMapper.load(apiKey);
    const infyToken = KiteInstrumentMapper.getInstrumentToken('NSE:INFY');
    const sbinToken = KiteInstrumentMapper.getInstrumentToken('NSE:SBIN');

    if (!infyToken || !sbinToken) {
      throw new Error('Could not find instrument tokens for INFY/SBIN');
    }

    console.log(`Tokens found: INFY => ${infyToken}, SBIN => ${sbinToken}`);
    console.log('Initializing WebSocket...');

    const ticker = new KiteTicker({
      api_key: apiKey,
      access_token: session.accessToken,
    });

    ticker.connect();

    ticker.on('connect', () => {
      console.log('KiteTicker connected successfully. Subscribing to INFY and SBIN...');
      ticker.subscribe([infyToken, sbinToken]);
      ticker.setMode(ticker.modeQuote, [infyToken, sbinToken]);
    });

    ticker.on('ticks', (ticks: any[]) => {
      console.log(`Received ticks:`);
      for (const t of ticks) {
        const symbol = t.instrument_token === infyToken ? 'INFY' : 'SBIN';
        console.log(`  * ${symbol}: Price ${t.last_price}, Volume ${t.volume_traded || 0}`);
      }
    });

    ticker.on('error', (err: any) => {
      console.error('WebSocket Error:', err);
    });

    // Wait 8 seconds to print ticks, then disconnect
    await new Promise((resolve) => setTimeout(resolve, 8000));
    console.log('Disconnecting WebSocket...');
    ticker.disconnect();
    console.log('WebSocket disconnected successfully.');
  } catch (err: any) {
    console.error('WebSocket connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
