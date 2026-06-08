import { prisma } from '@quantomate/db';

async function main() {
  console.log('Cleaning all trading bots from database...');
  const result = await prisma.tradingBot.deleteMany({});
  console.log(`Successfully deleted ${result.count} bots from database.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error cleaning bots:', err);
  process.exit(1);
});
