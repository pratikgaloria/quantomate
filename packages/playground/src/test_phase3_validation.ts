import { Strategy, LiveTradingEngine, ILiveFeed, TickCallback, OrderRequest } from '@quantomate/core';
import { PaperBroker, KiteInstrumentMapper } from '@quantomate/data';

// 1. Define a Mock Feed that generates rapid ticks with spreads
class SpreadMockFeed implements ILiveFeed {
  private intervals: NodeJS.Timeout[] = [];
  private onDisconnectCallback?: () => void;
  private tickCallback?: TickCallback;

  async connect(): Promise<void> {
    console.log('[MockFeed] Connected.');
  }

  async disconnect(): Promise<void> {
    for (const i of this.intervals) {
      clearInterval(i);
    }
    this.intervals = [];
    console.log('[MockFeed] Disconnected.');
  }

  subscribe(symbols: string[], callback: TickCallback): void {
    console.log(`[MockFeed] Subscribing to symbols: ${symbols.join(', ')}`);
    this.tickCallback = callback;
  }

  unsubscribe(symbols: string[]): void {
    console.log(`[MockFeed] Unsubscribing from ${symbols.join(', ')}`);
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  // Helper to send ticks manually in rapid succession
  async emitTick(symbol: string, price: number, bid: number, ask: number) {
    if (this.tickCallback) {
      this.tickCallback({
        symbol,
        price,
        bid,
        ask,
        timestamp: Date.now(),
        volume: 100,
      });
    }
  }
}

// 2. Define a simple test strategy that triggers buys & sells to inspect order fills
const crossoverStrategy = new Strategy('SpreadCrossTest', {
  direction: 'long',
  entryWhen: (quote) => {
    // Buy when price rises above 100
    return quote.value > 100;
  },
  exitWhen: (quote) => {
    // Sell when price drops below 95
    return quote.value < 95;
  }
});

async function main() {
  console.log('=== Starting Phase 3 Validation ===');

  // --- Part 1: Instrument Mapper Test ---
  console.log('\n--- 1. Testing Instrument Token Mapping ---');
  try {
    // We try to load without API key to verify parsing or local cache read
    await KiteInstrumentMapper.load('dummy-api-key');
    const tokenSBIN = KiteInstrumentMapper.getInstrumentToken('SBIN');
    console.log(`[Mapper] SBIN mapped to token: ${tokenSBIN || 'Not mapped (expected if cache missing)'}`);
  } catch (err: any) {
    console.log(`[Mapper] Skip remote load due to dummy key or network: ${err.message}`);
  }

  // --- Part 2: Sequential Queue and Spread Fill Test ---
  console.log('\n--- 2. Testing Sequential Queue & Bid/Ask Spreads ---');

  const feed = new SpreadMockFeed();
  const broker = new PaperBroker('Phase3-Validation-Account', 10000);

  const engine = new LiveTradingEngine(feed, broker, {
    symbols: ['SBIN'],
    strategies: [crossoverStrategy],
  });

  await engine.start();

  console.log('\n[Triggering entries...]');
  // Send 3 ticks in rapid sequence where price jumps above 100
  // Spread: Price=101, Bid=100.50, Ask=101.50
  // Buy entry should fill at Ask = 101.50 (NOT 101)
  console.log('Sending entry ticks...');
  await Promise.all([
    feed.emitTick('SBIN', 101, 100.5, 101.5),
    feed.emitTick('SBIN', 102, 101.5, 102.5),
    feed.emitTick('SBIN', 103, 102.5, 103.5)
  ]);

  // Wait 1 second to ensure processing chain resolves
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('\n[Triggering exits...]');
  // Send exit ticks where price drops below 95
  // Spread: Price=94, Bid=93.50, Ask=94.50
  // Sell exit should fill at Bid = 93.50 (NOT 94)
  console.log('Sending exit ticks...');
  await Promise.all([
    feed.emitTick('SBIN', 94, 93.5, 94.5),
    feed.emitTick('SBIN', 93, 92.5, 93.5)
  ]);

  // Wait 1 second to resolve queue
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('\nStopping engine...');
  await engine.stop();

  // --- Part 3: Verify Results ---
  console.log('\n--- 3. Verifying Fills and Orders Logs ---');
  const account = await broker.getAccountInfo();
  const positions = await broker.getPositions();
  const orders = await broker.getOrders();

  console.log(`[Account] Final Cash Balance: INR ${account.cashBalance.toFixed(2)}`);
  console.log(`[Account] Open Positions: ${positions.length}`);
  
  console.log(`[Account] Executed Orders: ${orders.length}`);
  for (const order of orders) {
    console.log(`  * Order: ${order.id} | Side: ${order.side?.toUpperCase()} | Avg Fill Price: INR ${order.avgFillPrice?.toFixed(2)} | Status: ${order.status}`);
  }

  // Validate the Buy Fill price matches Ask (101.50)
  const buyOrder = orders.find(o => o.side === 'buy' || o.side === 'buy_to_open');
  // Validate the Sell Fill price matches Bid (93.50)
  const sellOrder = orders.find(o => o.side === 'sell' || o.side === 'sell_to_close');

  let success = true;
  if (buyOrder && buyOrder.avgFillPrice !== 101.5) {
    console.error(`[FAIL] Buy order filled at ${buyOrder.avgFillPrice}, expected Ask (101.50)`);
    success = false;
  } else if (buyOrder) {
    console.log(`[PASS] Buy order filled at Ask price: INR 101.50`);
  }

  if (sellOrder && sellOrder.avgFillPrice !== 93.5) {
    console.error(`[FAIL] Sell order filled at ${sellOrder.avgFillPrice}, expected Bid (93.50)`);
    success = false;
  } else if (sellOrder) {
    console.log(`[PASS] Sell order filled at Bid price: INR 93.50`);
  }

  if (success) {
    console.log('\n=== PHASE 3 VALIDATION SUCCESS ===');
  } else {
    console.log('\n=== PHASE 3 VALIDATION FAILED ===');
  }
}

main().catch(console.error);
