import { prisma } from '@quantomate/db';

async function main() {
  console.log('Seeding test bots for side-by-side equity and option trading...');

  // 1. Deactivate all other bots first to keep logs clean
  await prisma.tradingBot.updateMany({
    data: { active: false },
  });

  // 2. Create or update AAPL - Equity RSI Bot (Equity only)
  const botA = {
    name: 'AAPL - Equity RSI',
    strategy: 'RSIMeanReversion',
    symbol: 'AAPL',
    active: true,
    parameters: {
      rsiPeriod: 14,
      oversoldThreshold: 70, // Set high thresholds to trigger entry/exit easily if needed, or normal thresholds
      overboughtThreshold: 30, // Note: we'll trigger them easily by setting thresholds that are crossed
      tradeOptions: false,
    },
  };

  await prisma.tradingBot.upsert({
    where: { name: botA.name },
    update: { ...botA },
    create: { ...botA },
  });
  console.log('Upserted Bot A: AAPL - Equity RSI (Active)');

  // 3. Create or update MU - Options Offset Bot (Options with strikeOffset)
  const botB = {
    name: 'MU - Options Offset',
    strategy: 'RSIMeanReversion',
    symbol: 'MU',
    active: true,
    parameters: {
      rsiPeriod: 14,
      oversoldThreshold: 70,
      overboughtThreshold: 30,
      tradeOptions: true,
      optionSelector: {
        strikeMode: 'offset',
        strikeOffset: 1, // 1 strike OTM
        expiryMode: 'nearest',
      },
    },
  };

  await prisma.tradingBot.upsert({
    where: { name: botB.name },
    update: { ...botB },
    create: { ...botB },
  });
  console.log('Upserted Bot B: MU - Options Offset (Active)');

  // 4. Create or update SPY - Option Momentum Bot (Standard ATM Option)
  const botC = {
    name: 'SPY - Option Momentum Standard',
    strategy: 'IndexOptionMomentum',
    symbol: 'SPY',
    active: true,
    parameters: {
      fastPeriod: 9,
      slowPeriod: 20,
      source: 'close',
      tradeOptions: true, // Should default to true anyway
    },
  };

  await prisma.tradingBot.upsert({
    where: { name: botC.name },
    update: { ...botC },
    create: { ...botC },
  });
  console.log('Upserted Bot C: SPY - Option Momentum Standard (Active)');

  console.log('Database seeding complete. Please restart the daemon to apply changes.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error seeding test bots:', err);
  process.exit(1);
});
