import fs from 'fs';
import axios from 'axios';

export async function showStatus(
  pidFile: string,
  daemonUrl: string,
  daemonPort: number
): Promise<void> {
  let apiStatus: any = null;
  try {
    const res = await axios.get(`${daemonUrl}/status`);
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
    console.log(`API Status:    ONLINE (Port: ${daemonPort})`);
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
