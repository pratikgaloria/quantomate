import { spawn } from 'child_process';
import fs from 'fs';
import axios from 'axios';

export async function startDaemon(
  pidFile: string,
  logFile: string,
  daemonPath: string,
  daemonPort: number
): Promise<void> {
  if (fs.existsSync(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10);
    try {
      process.kill(pid, 0);
      console.log(`Trading daemon is already running (PID: ${pid}).`);
      return;
    } catch {
      fs.unlinkSync(pidFile);
    }
  }

  console.log('Starting trading daemon in the background...');
  console.log(`Log output is redirected to: ${logFile}`);

  const out = fs.openSync(logFile, 'a');
  const err = fs.openSync(logFile, 'a');

  const child = spawn('npx', ['tsx', daemonPath], {
    detached: true,
    stdio: ['ignore', out, err],
    env: { ...process.env, DAEMON_PORT: String(daemonPort) }
  });

  child.unref();

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

export async function stopDaemon(pidFile: string, daemonUrl: string): Promise<void> {
  console.log('Stopping trading daemon...');

  try {
    const res = await axios.post(`${daemonUrl}/stop`);
    if (res.data.success) {
      console.log('Daemon requested graceful shutdown via API.');
      if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
      return;
    }
  } catch (err) {
    // API offline, try PID kill
  }

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
