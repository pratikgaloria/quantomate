import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '/home/dev/projects/quantomate-portfolio/.env' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Connecting to:', connectionString);

  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    const res = await client.query('SELECT * FROM trading_sessions');
    console.log('Query result:');
    console.log(res.rows);
  } catch (err: any) {
    console.error('Query failed:', err.message);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
