import { prisma } from '@quantomate/db';

async function main() {
  const symbols = await prisma.symbol.findMany();
  console.log('--- Symbols ---');
  console.log(symbols);

  for (const s of symbols) {
    const minMaxDate = await prisma.historicalPrice.aggregate({
      where: { symbolId: s.id },
      _min: { date: true },
      _max: { date: true },
      _count: { date: true }
    });
    console.log(`Symbol ${s.id}: Count: ${minMaxDate._count.date}, Min Date: ${minMaxDate._min.date?.toISOString()}, Max Date: ${minMaxDate._max.date?.toISOString()}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
