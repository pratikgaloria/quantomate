import { useState } from 'react';
import { formatCurrency, getOptionType } from '../utils/tradingHelpers';

interface Trade {
  symbol: string;
  entryOrder: any;
  exitOrder: any | null;
  qty: number;
  entryPrice: number;
  exitPrice: number | null;
  pnl: number | null;
  isOpen: boolean;
}

interface TradeExecutionsGridProps {
  trades: Trade[];
  market: string;
}

export function TradeExecutionsGrid({ trades, market }: TradeExecutionsGridProps) {
  const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set());

  const toggleExpand = (idx: number) => {
    setExpandedIdx(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (trades.length === 0) {
    return (
      <div className="bot-content__section">
        <h4 className="bot-content__section-title">Order Executions</h4>
        <div className="empty-trades">No executed trades yet.</div>
      </div>
    );
  }

  return (
    <div className="bot-content__section">
      <h4 className="bot-content__section-title">Order Executions</h4>
      <div className="table-responsive">
        <table className="trade-grid">
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Entry Price</th>
              <th>Exit Price</th>
              <th>P/L</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, idx) => {
              const isExpanded = expandedIdx.has(idx);
              const optType = getOptionType(trade.symbol);
              const pnlClass = trade.pnl !== null ? (trade.pnl >= 0 ? 'positive' : 'negative') : '';

              return (
                <>
                  <tr
                    key={`trade-${idx}`}
                    className={`trade-row ${isExpanded ? 'expanded' : ''} ${trade.isOpen ? 'open-trade' : ''}`}
                    onClick={() => toggleExpand(idx)}
                  >
                    <td className="trade-row__chevron">
                      <span className={`chevron ${isExpanded ? 'open' : ''}`}>▸</span>
                    </td>
                    <td className="font-bold">{trade.symbol}</td>
                    <td><span className={`option-type-badge ${optType === '-' ? 'none' : optType.toLowerCase()}`}>{optType}</span></td>
                    <td>{trade.qty}</td>
                    <td>{formatCurrency(trade.entryPrice, market)}</td>
                    <td>{trade.exitPrice !== null ? formatCurrency(trade.exitPrice, market) : <span className="awaiting">—</span>}</td>
                    <td className={`pnl-value ${pnlClass}`}>
                      {trade.pnl !== null ? `${trade.pnl >= 0 ? '+' : ''}${formatCurrency(trade.pnl, market)}` : '—'}
                    </td>
                    <td>
                      <span className={`trade-status ${trade.isOpen ? 'open' : 'closed'}`}>
                        {trade.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`detail-${idx}`} className="trade-detail-row">
                      <td colSpan={8}>
                        <div className="trade-detail">
                          <div className="trade-detail__order">
                            <div className="trade-detail__label">Entry Order</div>
                            <div className="trade-detail__fields">
                              <span><strong>Side:</strong> {trade.entryOrder.side}</span>
                              <span><strong>Price:</strong> {formatCurrency(trade.entryOrder.filledPrice || trade.entryOrder.avgFillPrice || 0, market)}</span>
                              <span><strong>Qty:</strong> {trade.entryOrder.filledQty || trade.entryOrder.qty}</span>
                              <span><strong>Time:</strong> {trade.entryOrder.filledAt ? new Date(trade.entryOrder.filledAt).toLocaleString() : '—'}</span>
                              <span className="trade-detail__id">ID: {(trade.entryOrder.id || '').slice(0, 8)}...</span>
                            </div>
                          </div>
                          {trade.exitOrder && (
                            <div className="trade-detail__order">
                              <div className="trade-detail__label">Exit Order</div>
                              <div className="trade-detail__fields">
                                <span><strong>Side:</strong> {trade.exitOrder.side}</span>
                                <span><strong>Price:</strong> {formatCurrency(trade.exitOrder.filledPrice || trade.exitOrder.avgFillPrice || 0, market)}</span>
                                <span><strong>Qty:</strong> {trade.exitOrder.filledQty || trade.exitOrder.qty}</span>
                                <span><strong>Time:</strong> {trade.exitOrder.filledAt ? new Date(trade.exitOrder.filledAt).toLocaleString() : '—'}</span>
                                <span className="trade-detail__id">ID: {(trade.exitOrder.id || '').slice(0, 8)}...</span>
                              </div>
                            </div>
                          )}
                          {!trade.exitOrder && (
                            <div className="trade-detail__order open-hint">
                              <div className="trade-detail__label">Exit Order</div>
                              <div className="trade-detail__fields">
                                <span className="awaiting">Position still open — awaiting exit signal</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
