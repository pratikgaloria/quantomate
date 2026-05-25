import { prisma } from '@quantomate/db';

async function run() {
  try {
    const symbolCount = await prisma.symbol.count();
    const priceCount = await prisma.historicalPrice.count();
    const signalCount = await prisma.strategySignal.count();
    const metricCount = await prisma.fundamentalMetric.count();
    console.log("Quantomate DB Stats:");
    console.log("Symbols:", symbolCount);
    console.log("Historical Prices:", priceCount);
    console.log("Strategy Signals:", signalCount);
    console.log("Fundamental Metrics:", metricCount);

    const symbols = await prisma.symbol.findMany({
      select: { id: true }
    });
    console.log("Cached Symbols in Quantomate:", symbols.map(s => s.id));
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
