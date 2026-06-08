import { prisma } from '@quantomate/db';

async function main() {
  const accounts = await prisma.tradingAccount.findMany();
  console.log('--- Trading Accounts in DB ---');
  console.log(accounts);

  const orders = await prisma.tradingOrder.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('--- Latest 5 Trading Orders in DB ---');
  console.log(orders);

  const positions = await prisma.tradingPosition.findMany();
  console.log('--- Active Positions in DB ---');
  console.log(positions);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
