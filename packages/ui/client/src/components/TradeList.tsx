import { FC } from 'react';
import { Card } from './atoms';
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
  initialCapital?: number;
  periodRange?: string;
  selectedTrade?: { id: number; entryDate: string; exitDate: string } | null;
  onSelectTrade?: (trade: { id: number; entryDate: string; exitDate: string } | null) => void;
}

export const TradeList: FC<TradeListProps> = ({ trades, initialCapital, periodRange, selectedTrade, onSelectTrade }) => {
  // Group trades into positions (entry + exit pairs) and track cumulative account value
  let currentCapital = initialCapital ?? 10000;
  const positions: Array<{
    id: number;
    entryDate: string;
    entryPrice: number;
    exitDate: string;
    exitPrice: number;
    exitReason: string;
    isShort: boolean;
    profitLoss: number;
    profitLossPercent: number;
    cumulativeValue: number;
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

        currentCapital += profitLoss;

        positions.push({
          id: 100 + positions.length,
          entryDate: trade.date,
          entryPrice,
          exitDate: exitTrade.date,
          exitPrice,
          exitReason: exitTrade.exitReason || 'strategy',
          isShort,
          profitLoss,
          profitLossPercent,
          cumulativeValue: currentCapital,
        });
        i++; // Skip the exit trade
      }
    }
  }

  const formatCustomDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Invalid Date';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Invalid Time';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
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
    <Card title="Trade History" className="trade-list">
      <div className="trades-card-content">
        {positions.length === 0 ? (
          <p className="no-trades">No trades executed</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Period</th>
                  <th>Price</th>
                  <th>Direction</th>
                  <th>P&L ($)</th>
                  <th>P&L (%)</th>
                  <th>Cumulative Value</th>
                  <th>Exit Reason</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => {
                  const isSelected = selectedTrade && selectedTrade.id === position.id;
                  return (
                    <tr
                      key={index}
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => {
                        if (isSelected) {
                          onSelectTrade?.(null);
                        } else {
                          onSelectTrade?.({ id: position.id, entryDate: position.entryDate, exitDate: position.exitDate });
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                    <td>#{position.id}</td>
                    <td title={`${formatFullDate(position.entryDate)} - ${formatFullDate(position.exitDate)}`}>
                      {periodRange === 'yesterday'
                        ? `${formatTime(position.entryDate)} - ${formatTime(position.exitDate)}`
                        : `${formatCustomDate(position.entryDate)} - ${formatCustomDate(position.exitDate)}`
                      }
                    </td>
                    <td>
                      ${position.entryPrice?.toFixed(2) ?? '0.00'} - ${position.exitPrice?.toFixed(2) ?? '0.00'}
                    </td>
                    <td>
                      <span className={`direction-label ${position.isShort ? 'short' : 'long'}`}>
                        {position.isShort ? 'Short' : 'Long'}
                      </span>
                    </td>
                    <td className={position.profitLoss >= 0 ? 'profit' : 'loss'}>
                      ${position.profitLoss?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className={position.profitLoss >= 0 ? 'profit' : 'loss'}>
                      {position.profitLossPercent?.toFixed(2) ?? '0.00'}%
                    </td>
                    <td>
                      ${position.cumulativeValue?.toFixed(2) ?? '0.00'}
                    </td>
                    <td>
                      <span className={`exit-reason ${getExitReasonClass(position.exitReason)}`}>
                        {getExitReasonLabel(position.exitReason)}
                      </span>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};
