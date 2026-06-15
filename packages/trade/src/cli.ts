import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { prisma } from '@quantomate/db';

const daemonPath = path.resolve(__dirname, 'daemon.ts');
const pidFile = path.resolve(__dirname, '../daemon.pid');
const logFile = path.resolve(__dirname, '../trading.log');
const DAEMON_PORT = process.env.DAEMON_PORT ? parseInt(process.env.DAEMON_PORT, 10) : 8082;
const DAEMON_URL = `http://127.0.0.1:${DAEMON_PORT}`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    printHelp();
    return;
  }

  switch (command) {
    case 'start':
      await startDaemon();
      break;
    case 'stop':
      await stopDaemon();
      break;
    case 'status':
      await showStatus();
      break;
    case 'logs':
      await showLogs();
      break;
    case 'clear-logs':
      await clearLogs();
      break;
    case 'config':
      if (args[1] === 'set') {
        await setConfig(args[2], args[3]);
      } else {
        console.error('Invalid config command. Use: cli config set <key> <value>');
      }
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
  }
}

function printHelp() {
  console.log(`
Quantomate Trading CLI
Usage:
  npm run cli start              - Start the trading daemon in the background
  npm run cli stop               - Stop the running trading daemon
  npm run cli status             - Display the status of the trading daemon
  npm run cli logs               - Stream live logs from the trading daemon
  npm run cli clear-logs         - Truncate and clear the daemon log file
  npm run cli config set <k> <v> - Update settings in the database (e.g. trading_mode, enabled_markets)
`);
}

async function startDaemon() {
  // Check if already running
  if (fs.existsSync(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10);
    try {
      process.kill(pid, 0); // Check if process exists
      console.log(`Trading daemon is already running (PID: ${pid}).`);
      return;
    } catch {
      // Process doesn't exist, remove stale pid file
      fs.unlinkSync(pidFile);
    }
  }

  console.log('Starting trading daemon in the background...');
  console.log(`Log output is redirected to: ${logFile}`);

  const out = fs.openSync(logFile, 'a');
  const err = fs.openSync(logFile, 'a');

  // Spawn detached process
  const child = spawn('npx', ['tsx', daemonPath], {
    detached: true,
    stdio: ['ignore', out, err],
    env: { ...process.env, DAEMON_PORT: String(DAEMON_PORT) }
  });

  child.unref();

  // Wait a moment and check if it started
  setTimeout(async () => {
    try {
      process.kill(child.pid!, 0);
      fs.writeFileSync(pidFile, String(child.pid));
      console.log(`Trading daemon successfully started (PID: ${child.pid}).`);
    } catch (err) {
      console.error('Failed to start daemon. Check trading.log for details.');
    }
    process.exit(0);
  }, 1500);
}

async function stopDaemon() {
  console.log('Stopping trading daemon...');

  // 1. Try API stop first (graceful)
  try {
    const res = await axios.post(`${DAEMON_URL}/stop`);
    if (res.data.success) {
      console.log('Daemon requested graceful shutdown via API.');
      if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
      return;
    }
  } catch (err) {
    // API failed or offline, try killing PID
  }

  // 2. Kill by PID file if API failed
  if (fs.existsSync(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10);
    try {
      process.kill(pid, 'SIGTERM');
      console.log(`Sent SIGTERM to process (PID: ${pid}).`);
      fs.unlinkSync(pidFile);
    } catch (err: any) {
      if (err.code === 'ESRCH') {
        console.log('Process was already stopped.');
        fs.unlinkSync(pidFile);
      } else {
        console.error(`Failed to kill process: ${err.message}`);
      }
    }
  } else {
    console.log('No active daemon PID file found. Daemon is likely stopped.');
  }
}

async function showStatus() {
  let apiStatus: any = null;
  try {
    const res = await axios.get(`${DAEMON_URL}/status`);
    apiStatus = res.data;
  } catch (err) {}

  let processRunning = false;
  let pid: number | null = null;
  if (fs.existsSync(pidFile)) {
    pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10);
    try {
      process.kill(pid, 0);
      processRunning = true;
    } catch {}
  }

  console.log('=============================================');
  console.log('          TRADING DAEMON STATUS              ');
  console.log('=============================================');
  console.log(`Process State: ${processRunning ? `RUNNING (PID: ${pid})` : 'STOPPED'}`);
  
  if (apiStatus && apiStatus.success) {
    console.log(`API Status:    ONLINE (Port: ${DAEMON_PORT})`);
    console.log(`Trading Mode:  ${apiStatus.settings.tradingMode.toUpperCase()}`);
    console.log(`Active Bots:   ${apiStatus.activeBots}`);
    console.log(`Enabled Markets: ${apiStatus.settings.enabledMarkets.join(', ')}`);
    console.log('---------------------------------------------');
    
    if (apiStatus.account) {
      console.log('Account info:');
      console.log(`  Balance:   ₹${apiStatus.account.cashBalance.toLocaleString()}`);
      console.log(`  Portfolio: ₹${apiStatus.account.portfolioValue.toLocaleString()}`);
    }

    if (apiStatus.positions && apiStatus.positions.length > 0) {
      console.log('\nOpen Positions:');
      for (const pos of apiStatus.positions) {
        console.log(`  ${pos.symbol}: ${pos.qty} @ ₹${pos.avgEntryPrice.toFixed(2)} (PnL: ₹${pos.unrealizedPL.toFixed(2)})`);
      }
    } else {
      console.log('\nOpen Positions: None');
    }

    if (apiStatus.orders && apiStatus.orders.length > 0) {
      console.log('\nRecent Executions:');
      const recent = apiStatus.orders.slice(0, 5);
      for (const ord of recent) {
        console.log(`  [${ord.status.toUpperCase()}] ${ord.side.toUpperCase()} ${ord.symbol} qty:${ord.filledQty} @ ₹${ord.avgFillPrice?.toFixed(2) || '0.00'}`);
      }
    } else {
      console.log('\nRecent Executions: None');
    }
  } else {
    console.log(`API Status:    OFFLINE`);
  }
  console.log('=============================================');
}

async function setConfig(key: string | undefined, value: string | undefined) {
  if (!key || !value) {
    console.error('Error: Key and value must be provided.');
    return;
  }

  // Normalize key
  if (key === 'mode') key = 'trading_mode';
  if (key === 'markets') key = 'enabled_markets';

  if (key !== 'trading_mode' && key !== 'enabled_markets') {
    console.error(`Invalid key: "${key}". Supported: trading_mode, enabled_markets`);
    return;
  }

  let dbValue = value;
  if (key === 'enabled_markets') {
    try {
      JSON.parse(value); // Validate JSON array
    } catch {
      // Convert comma-separated string to JSON array
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

  // Notify daemon to reconcile if running
  try {
    await axios.post(`${DAEMON_URL}/reconcile`);
    console.log('Daemon notified. Reconciled state successfully.');
  } catch (err) {
    console.log('Daemon is not running. Changes will apply on next daemon start.');
  }

  process.exit(0);
}

async function showLogs() {
  if (!fs.existsSync(logFile)) {
    console.log('No log file found.');
    return;
  }
  
  console.log(`Streaming logs from: ${logFile}\n(Press Ctrl+C to exit)\n`);
  
  // Print existing log contents
  const initialContent = fs.readFileSync(logFile, 'utf8');
  process.stdout.write(initialContent);

  // Watch file for changes and print new data
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
          // File was truncated
          fileSize = stats.size;
        }
      } catch (err) {
        // Handle read error (e.g. temporary lock)
      }
    }
  });

  // Keep process open
  await new Promise(() => {});
}

async function clearLogs() {
  if (fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
    console.log('Daemon log file cleared successfully.');
  } else {
    console.log('No log file found.');
  }
}

main().catch(err => {
  console.error('CLI execution error:', err);
  process.exit(1);
});
