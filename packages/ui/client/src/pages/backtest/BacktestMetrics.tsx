interface BacktestMetricsProps {
  result: any;
}

export function BacktestMetrics({ result }: BacktestMetricsProps) {
  const r = result.report;
  const isPos = r.returns >= 0;

  // Group trades into positions (entry + exit pairs) to calculate win/loss contribution
  let totalWinPnL = 0;
  let totalLossPnL = 0;
  
  const trades = r.trades || [];
  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    if (trade.type === 'entry' && i + 1 < trades.length) {
      const exitTrade = trades[i + 1];
      if (exitTrade.type === 'exit') {
        const isShort = !!trade.short;
        const entryPrice = trade.tradedValue;
        const exitPrice = exitTrade.tradedValue;
        
        // Correct P&L: For long (exit - entry), for short (entry - exit)
        const profitLoss = isShort ? entryPrice - exitPrice : exitPrice - entryPrice;
        
        if (profitLoss > 0) {
          totalWinPnL += profitLoss;
        } else {
          totalLossPnL += profitLoss;
        }
        i++; // Skip exit trade
      }
    }
  }

  const formattedWin = totalWinPnL > 0 ? `+$${totalWinPnL.toFixed(2)}` : `$0.00`;
  const formattedLoss = totalLossPnL < 0 ? `-$${Math.abs(totalLossPnL).toFixed(2)}` : `$0.00`;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Returns (%)</span>
        <div className="metric-row">
          <span className={`metric-value ${isPos ? 'positive' : 'negative'}`}>
            {r.returnsPercentage.toFixed(2)}%
          </span>
          <span className="metric-detail">
            {isPos ? '+' : ''}${r.returns.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-label">Win / Loss Contribution</span>
        <div className="metric-row">
          <span className="metric-value positive text-sm font-semibold" style={{ fontSize: '1.2rem' }}>
            {formattedWin}
          </span>
          <span className="metric-detail negative font-semibold" style={{ fontSize: '0.9rem', color: 'var(--color-loss)' }}>
            {formattedLoss}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-label">Capital (Req / End)</span>
        <div className="metric-row">
          <span className="metric-value">
            ${r.initialCapital.toFixed(2)}
          </span>
          <span className="metric-detail">
            / ${r.finalCapital.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-label">Other Costs</span>
        <div className="metric-row">
          <span className="metric-value">
            ${(r.totalCommissions + r.totalSlippage).toFixed(2)}
          </span>
          <span className="metric-detail">
            Comm: ${r.totalCommissions.toFixed(2)} | Slip: ${r.totalSlippage.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-label">Trades Count</span>
        <div className="metric-row">
          <span className="metric-value">
            {r.numberOfTrades}
          </span>
          <span className="metric-detail">
            Win: {r.numberOfWinningTrades} | Loss: {r.numberOfLosingTrades}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-label">Win Rate</span>
        <div className="metric-row">
          <span className="metric-value">
            {isNaN(r.winningRate) ? '0.00' : (r.winningRate * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-label">Exits (SL / TP / Strat)</span>
        <div className="metric-row">
          <span className="metric-value">
            {r.stopLossExits} / {r.takeProfitExits} / {r.strategyExits}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-label">Sharpe Ratio</span>
        <div className="metric-row">
          <span className="metric-value">
            {r.sharpeRatio !== undefined ? r.sharpeRatio.toFixed(2) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
