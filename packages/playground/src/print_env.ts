import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '/home/dev/projects/quantomate-portfolio/.env' });
console.log('PORTFOLIO DB URL:', process.env.DATABASE_URL);

import { prisma } from '@quantomate/db';
console.log('AFTER DB LOAD URL:', process.env.DATABASE_URL);
