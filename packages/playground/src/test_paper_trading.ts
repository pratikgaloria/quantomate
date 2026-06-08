import { Strategy, LiveTradingEngine, ILiveFeed, TickCallback } from '@quantomate/core';
import { PaperBroker } from '@quantomate/data';

// 1. Define a Mock Feed that generates random ticks
class MockLiveFeed implements ILiveFeed {
  private intervals: NodeJS.Timeout[] = [];
  private onDisconnectCallback?: () => void;

  async connect(): Promise<void> {
    console.log('[MockFeed] Connected.');
  }

  async disconnect(): Promise<void> {
    for (const i of this.intervals) {
      clearInterval(i);
    }
    console.log('[MockFeed] Disconnected.');
  }

  subscribe(symbols: string[], callback: TickCallback): void {
    console.log(`[MockFeed] Subscribing to symbols: ${symbols.join(', ')}`);
    for (const symbol of symbols) {
      let price = symbol === 'SBIN' ? 800 : 3300;
      const interval = setInterval(() => {
        const change = (Math.random() - 0.5) * 4; // -2 to +2 variation
        price += change;
        callback({
          symbol,
          price,
          timestamp: Date.now(),
          volume: Math.floor(Math.random() * 1000) + 100,
        });
      }, 1000);
      this.intervals.push(interval);
    }
  }

  unsubscribe(symbols: string[]): void {
    console.log(`[MockFeed] Unsubscribing from ${symbols.join(', ')}`);
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }
}

// 2. Define a simple test strategy that triggers buy/sell frequently
const fastTestStrategy = new Strategy('FastTest', {
  direction: 'long',
  entryWhen: (quote) => {
    // Entry condition based on random price digit properties to trigger often
    return Math.floor(quote.value * 100) % 10 < 4;
  },
  exitWhen: (quote) => {
    // Exit condition
    return Math.floor(quote.value * 100) % 10 >= 7;
  }
});

async function main() {
  console.log('--- Starting Paper Trading Verification ---');

  const feed = new MockLiveFeed();
  const broker = new PaperBroker('Verification-Test-Account', 100000);

  // Print initial account balance
  const initialAcc = await broker.getAccountInfo();
  console.log(`[Account] Initial cash balance: INR ${initialAcc.cashBalance}`);

  const engine = new LiveTradingEngine(feed, broker, {
    symbols: ['SBIN', 'RELIANCE'],
    strategies: [fastTestStrategy],
  });

  // Start the engine
  await engine.start();

  // Run for 10 seconds, then stop
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log('Stopping engine...');
  await engine.stop();

  // Print final status
  const finalAcc = await broker.getAccountInfo();
  const positions = await broker.getPositions();
  const orders = await broker.getOrders();

  console.log('--- Final Summary ---');
  console.log(`[Account] Final cash balance: INR ${finalAcc.cashBalance}`);
  console.log(`[Account] Open Positions: ${positions.length}`);
  for (const pos of positions) {
    console.log(`  * ${pos.symbol}: Qty ${pos.qty}, Entry Price: INR ${pos.avgEntryPrice.toFixed(2)}, Current: INR ${pos.marketPrice.toFixed(2)}, Unrealized P/L: INR ${pos.unrealizedPL.toFixed(2)}`);
  }
  console.log(`[Account] Executed Orders: ${orders.length}`);
  console.log('--- Verification Done ---');
}

main().catch(console.error);
