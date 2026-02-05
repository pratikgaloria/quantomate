import { FC } from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import './TradeList.scss';

interface Trade {
  type: 'entry' | 'exit';
  tradedValue: number;
  date: string;
  short?: boolean;
  exitReason?: string;
}

interface TradeListProps {
  trades: Trade[];
}

export const TradeList: FC<TradeListProps> = ({ trades }) => {
  // Group trades into positions (entry + exit pairs)
  const positions: Array<{
    entryDate: string;
    entryPrice: number;
    exitDate: string;
    exitPrice: number;
    exitReason: string;
    isShort: boolean;
    profitLoss: number;
    profitLossPercent: number;
  }> = [];

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
        const profitLossPercent = (profitLoss / entryPrice) * 100;

        positions.push({
          entryDate: trade.date,
          entryPrice,
          exitDate: exitTrade.date,
          exitPrice,
          exitReason: exitTrade.exitReason || 'strategy',
          isShort,
          profitLoss,
          profitLossPercent,
        });
        i++; // Skip the exit trade
      }
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleString();
  };

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
    <CollapsibleSection title="Trade History" className="trade-list">
      {positions.length === 0 ? (
        <p className="no-trades">No trades executed</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Entry Date</th>
                <th>Direction</th>
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
                  <td title={formatFullDate(position.entryDate)}>{formatDate(position.entryDate)}</td>
                  <td>
                    <span className={`direction-label ${position.isShort ? 'short' : 'long'}`}>
                      {position.isShort ? 'Short' : 'Long'}
                    </span>
                  </td>
                  <td>${position.entryPrice?.toFixed(2) ?? '0.00'}</td>
                  <td title={formatFullDate(position.exitDate)}>{formatDate(position.exitDate)}</td>
                  <td>${position.exitPrice?.toFixed(2) ?? '0.00'}</td>
                  <td>
                    <span className={`exit-reason ${getExitReasonClass(position.exitReason)}`}>
                      {getExitReasonLabel(position.exitReason)}
                    </span>
                  </td>
                  <td className={position.profitLoss >= 0 ? 'profit' : 'loss'}>
                    ${position.profitLoss?.toFixed(2) ?? '0.00'}
                  </td>
                  <td className={position.profitLoss >= 0 ? 'profit' : 'loss'}>
                    {position.profitLossPercent?.toFixed(2) ?? '0.00'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CollapsibleSection>
  );
};
