interface SessionPanelProps {
  status: any;
  sessions: any[];
  onCreateSession: () => void;
  onEditSession: (sess: any) => void;
  onDeleteSession: (id: string, name: string) => void;
  calculateSessionPL: (sess: any) => any;
}

export function SessionPanel({ status, sessions, onCreateSession, onEditSession, onDeleteSession, calculateSessionPL }: SessionPanelProps) {
  return (
    <div className="controls-panel">
      <div className="trading-card">
        <h3><i className="la la-wallet"></i> Broker Capital</h3>
        {status?.account ? (
          <div className="account-metric-grid">
            <div className="metric-box">
              <div className="label">Cash Balance</div>
              <div className="value">₹{status.account.cashBalance?.toLocaleString() || '0'}</div>
            </div>
            <div className="metric-box">
              <div className="label">Portfolio Value</div>
              <div className="value">₹{status.account.portfolioValue?.toLocaleString() || '0'}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No active broker session.</div>
        )}
      </div>

      <div className="trading-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0 }}><i className="la la-server"></i> Allocation Sessions</h3>
          <button onClick={onCreateSession} style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 600 }}>+ New</button>
        </div>

        {sessions.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '0.5rem 0' }}>No sessions configured.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {sessions.map(sess => {
              const PL = calculateSessionPL(sess);
              const sym = sess.provider === 'zerodha' ? '₹' : '$';
              return (
                <div key={sess.id} className="session-item-card" style={{ padding: '0.6rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>{sess.name}</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => onEditSession(sess)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}>Edit</button>
                      <button onClick={() => onDeleteSession(sess.id, sess.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}>Delete</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                    <span>Cap: {sym}{sess.capital.toLocaleString()}</span>
                    <span style={{ fontWeight: 600, color: sess.virtualCash >= sess.capital ? 'var(--color-profit)' : 'var(--color-loss)' }}>Cash: {sym}{sess.virtualCash.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                    <span>Val: {sym}{PL.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span style={{ fontWeight: 600, color: PL.totalPL >= 0 ? 'var(--color-profit)' : 'var(--color-loss)' }}>P/L: {PL.totalPL >= 0 ? '+' : ''}{sym}{PL.totalPL.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({PL.totalPLPct.toFixed(2)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
