interface PositionsPanelProps {
  positions: any[];
  orders: any[];
  onExitPosition: (sym: string) => void;
  getOptionType: (sym: string) => string;
  formatPrice: (sym: string, price: any) => string;
  enrichOrdersWithPL: (orders: any[]) => any[];
}

export function PositionsPanel({ positions, orders, onExitPosition, getOptionType, formatPrice, enrichOrdersWithPL }: PositionsPanelProps) {
  return (
    <>
      <div className="trading-card">
        <h3><i className="la la-exchange-alt"></i> Open Positions</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>Symbol</th><th>Option Type</th><th>Qty</th><th>Avg. Entry</th><th>Market Price</th><th>Unrealized P/L</th><th style={{ textAlign: 'right' }}>Action</th></tr>
            </thead>
            <tbody>
              {positions.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>No open positions.</td></tr>
              ) : (
                positions.map((pos) => {
                  const optType = getOptionType(pos.symbol);
                  return (
                    <tr key={pos.symbol}>
                      <td style={{ fontWeight: 700 }}>{pos.symbol}</td>
                      <td><span className={`option-type-badge ${optType === '-' ? 'none' : optType.toLowerCase()}`}>{optType}</span></td>
                      <td>{pos.qty}</td>
                      <td>{formatPrice(pos.symbol, pos.avgEntryPrice)}</td>
                      <td>{formatPrice(pos.symbol, pos.marketPrice)}</td>
                      <td className={`pnl-badge ${pos.unrealizedPL >= 0 ? 'positive' : 'negative'}`}>{pos.unrealizedPL >= 0 ? '+' : ''}{formatPrice(pos.symbol, pos.unrealizedPL)}</td>
                      <td style={{ textAlign: 'right' }}><button onClick={() => onExitPosition(pos.symbol)} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer' }}>Exit Position</button></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="trading-card">
        <h3><i className="la la-history"></i> Recent Order Executions</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Symbol</th><th>Option Type</th><th>Type</th><th>Side</th><th>Qty</th><th>Avg. Fill Price</th><th>Realized P/L</th><th>Status</th><th>Executed At</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>No orders executed yet.</td></tr>
              ) : (
                enrichOrdersWithPL(orders).map((ord) => {
                  const optType = getOptionType(ord.symbol || '');
                  return (
                    <tr key={ord.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>{ord.id}</td>
                      <td style={{ fontWeight: 700 }}>{ord.symbol || ''}</td>
                      <td><span className={`option-type-badge ${optType === '-' ? 'none' : optType.toLowerCase()}`}>{optType}</span></td>
                      <td><span className={`type-badge ${(ord.tradeType || 'Long').toLowerCase()}`}>{ord.tradeType || 'Long'}</span></td>
                      <td><span className={`side-badge ${ord.side?.toLowerCase().startsWith('buy') ? 'buy' : 'sell'}`}>{ord.side}</span></td>
                      <td>{ord.filledQty}</td>
                      <td>{formatPrice(ord.symbol, ord.avgFillPrice)}</td>
                      <td className={ord.realizedPL !== undefined && ord.realizedPL !== null ? (ord.realizedPL >= 0 ? 'pnl-badge positive' : 'pnl-badge negative') : ''}>
                        {ord.realizedPL !== undefined && ord.realizedPL !== null ? (ord.realizedPL >= 0 ? '+' : '') + formatPrice(ord.symbol, ord.realizedPL) : '-'}
                      </td>
                      <td><span className={`status-label ${ord.status.toLowerCase()}`}>{ord.status}</span></td>
                      <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.filledAt ? new Date(ord.filledAt).toLocaleTimeString() : '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
