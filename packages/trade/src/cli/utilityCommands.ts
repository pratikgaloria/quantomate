import fs from 'fs';
import axios from 'axios';
import { prisma } from '@quantomate/db';

export async function setConfig(
  key: string | undefined,
  value: string | undefined,
  daemonUrl: string
): Promise<void> {
  if (!key || !value) {
    console.error('Error: Key and value must be provided.');
    return;
  }

  if (key === 'mode') key = 'trading_mode';
  if (key === 'markets') key = 'enabled_markets';

  if (key !== 'trading_mode' && key !== 'enabled_markets') {
    console.error(`Invalid key: "${key}". Supported: trading_mode, enabled_markets`);
    return;
  }

  let dbValue = value;
  if (key === 'enabled_markets') {
    try {
      JSON.parse(value);
    } catch {
      const arr = value.split(',').map(s => s.trim().toLowerCase());
      dbValue = JSON.stringify(arr);
    }
  }

  console.log(`Updating database configuration: ${key} = ${dbValue}...`);

  await prisma.systemSetting.upsert({
    where: { key },
    update: { value: dbValue },
    create: { key, value: dbValue }
  });

  console.log('Configuration updated in database.');

  try {
    await axios.post(`${daemonUrl}/reconcile`);
    console.log('Daemon notified. Reconciled state successfully.');
  } catch (err) {
    console.log('Daemon is not running. Changes will apply on next daemon start.');
  }

  process.exit(0);
}

export async function showLogs(logFile: string): Promise<void> {
  if (!fs.existsSync(logFile)) {
    console.log('No log file found.');
    return;
  }
  
  console.log(`Streaming logs from: ${logFile}\n(Press Ctrl+C to exit)\n`);
  const initialContent = fs.readFileSync(logFile, 'utf8');
  process.stdout.write(initialContent);

  let fileSize = fs.statSync(logFile).size;
  fs.watch(logFile, (event) => {
    if (event === 'change') {
      try {
        const stats = fs.statSync(logFile);
        if (stats.size > fileSize) {
          const stream = fs.createReadStream(logFile, {
            start: fileSize,
            end: stats.size - 1,
            encoding: 'utf8'
          });
          stream.pipe(process.stdout);
          fileSize = stats.size;
        } else if (stats.size < fileSize) {
          fileSize = stats.size;
        }
      } catch (err) {}
    }
  });

  await new Promise(() => {});
}

export async function clearLogs(logFile: string): Promise<void> {
  if (fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
    console.log('Daemon log file cleared successfully.');
  } else {
    console.log('No log file found.');
  }
}
