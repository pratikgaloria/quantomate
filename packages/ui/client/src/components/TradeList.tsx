import React from 'react';
import './TradeList.scss';

interface Trade {
  type: 'entry' | 'exit';
  tradedValue: number;
  date: string;
  exitReason?: string;
}

interface TradeListProps {
  trades: Trade[];
}

export const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  // Group trades into positions (entry + exit pairs)
  const positions: Array<{
    entryDate: string;
    entryPrice: number;
    exitDate: string;
    exitPrice: number;
    exitReason: string;
    profitLoss: number;
    profitLossPercent: number;
  }> = [];

  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    if (trade.type === 'entry' && i + 1 < trades.length) {
      const exitTrade = trades[i + 1];
      if (exitTrade.type === 'exit') {
        const entryPrice = trade.tradedValue;
        const exitPrice = exitTrade.tradedValue;
        const profitLoss = exitPrice - entryPrice;
        const profitLossPercent = (profitLoss / entryPrice) * 100;

        positions.push({
          entryDate: new Date(trade.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          entryPrice,
          exitDate: new Date(exitTrade.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          exitPrice,
          exitReason: exitTrade.exitReason || 'strategy',
          profitLoss,
          profitLossPercent,
        });
        i++; // Skip the exit trade
      }
    }
  }

  const getExitReasonLabel = (reason: string) => {
    switch (reason) {
      case 'stop-loss':
        return 'Stop Loss';
      case 'take-profit':
        return 'Take Profit';
      case 'strategy':
        return 'Strategy Exit';
      default:
        return reason;
    }
  };

  const getExitReasonClass = (reason: string) => {
    switch (reason) {
      case 'stop-loss':
        return 'exit-reason-stop-loss';
      case 'take-profit':
        return 'exit-reason-take-profit';
      default:
        return 'exit-reason-strategy';
    }
  };

  return (
    <div className="trade-list">
      <h3>Trade History</h3>
      {positions.length === 0 ? (
        <p className="no-trades">No trades executed</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Entry Date</th>
                <th>Entry Price</th>
                <th>Exit Date</th>
                <th>Exit Price</th>
                <th>Exit Reason</th>
                <th>P&L ($)</th>
                <th>P&L (%)</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={index}>
                  <td>{position.entryDate}</td>
                  <td>${position.entryPrice.toFixed(2)}</td>
                  <td>{position.exitDate}</td>
                  <td>${position.exitPrice.toFixed(2)}</td>
                  <td>
                    <span className={`exit-reason ${getExitReasonClass(position.exitReason)}`}>
                      {getExitReasonLabel(position.exitReason)}
                    </span>
                  </td>
                  <td className={position.profitLoss >= 0 ? 'profit' : 'loss'}>
                    ${position.profitLoss.toFixed(2)}
                  </td>
                  <td className={position.profitLoss >= 0 ? 'profit' : 'loss'}>
                    {position.profitLossPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
