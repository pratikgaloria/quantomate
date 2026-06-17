import path from 'path';
import { startDaemon, stopDaemon } from './cli/daemonProcess';
import { showStatus } from './cli/daemonStatus';
import { setConfig, showLogs, clearLogs } from './cli/utilityCommands';

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
      await startDaemon(pidFile, logFile, daemonPath, DAEMON_PORT);
      break;
    case 'stop':
      await stopDaemon(pidFile, DAEMON_URL);
      break;
    case 'status':
      await showStatus(pidFile, DAEMON_URL, DAEMON_PORT);
      break;
    case 'logs':
      await showLogs(logFile);
      break;
    case 'clear-logs':
      await clearLogs(logFile);
      break;
    case 'config':
      if (args[1] === 'set') {
        await setConfig(args[2], args[3], DAEMON_URL);
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

main().catch(err => {
  console.error('CLI execution error:', err);
  process.exit(1);
});
