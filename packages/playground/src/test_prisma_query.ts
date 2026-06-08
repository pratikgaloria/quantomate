import dotenv from 'dotenv';
dotenv.config({ path: '/home/dev/projects/quantomate-portfolio/.env' });

import { prisma } from '@quantomate/db';

async function main() {
  console.log('DATABASE_URL is:', process.env.DATABASE_URL);
  const allSessions = await prisma.tradingSession.findMany();
  console.log('Sessions count:', allSessions.length);
  console.log('Sessions:', allSessions);
}

main().catch(console.error).finally(() => prisma.$disconnect());
