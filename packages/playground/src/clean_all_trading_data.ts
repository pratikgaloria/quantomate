import { prisma } from '@quantomate/db';

async function main() {
  console.log('Cleaning all trading data from database...');
  
  const orders = await prisma.tradingOrder.deleteMany({});
  console.log(`Deleted ${orders.count} orders.`);
  
  const positions = await prisma.tradingPosition.deleteMany({});
  console.log(`Deleted ${positions.count} positions.`);
  
  const accounts = await prisma.tradingAccount.deleteMany({});
  console.log(`Deleted ${accounts.count} accounts.`);
  
  const sessions = await prisma.allocationSession.deleteMany({});
  console.log(`Deleted ${sessions.count} sessions and cascade-deleted their associated bots.`);
  
  console.log('Database cleanup complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error cleaning trading data:', err);
  process.exit(1);
});
