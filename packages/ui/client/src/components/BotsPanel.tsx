interface BotsPanelProps {
  bots: any[];
  prices: any;
  onCreateBot: () => void;
  onEditBot: (bot: any) => void;
  onDeleteBot: (id: string, name: string) => void;
  onToggleBot: (id: string, active: boolean) => void;
  calculateBotPL: (botSym: string) => any;
  formatPrice: (botSym: string, price: any) => string;
}

export function BotsPanel({ bots, prices, onCreateBot, onEditBot, onDeleteBot, onToggleBot, calculateBotPL, formatPrice }: BotsPanelProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Strategy Bot Allocations</h3>
        <button onClick={onCreateBot} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>+ Add Bot</button>
      </div>
      {bots.length === 0 ? (
        <div className="trading-card" style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No strategy bots seeded or configured.</div>
      ) : (
        <div className="bot-card-grid">
          {bots.map((bot) => {
            const PL = calculateBotPL(bot.symbol);
            const isIndia = bot.symbol && (bot.symbol.toUpperCase().includes('NIFTY') || bot.symbol.toUpperCase().includes('BANK'));
            const sym = isIndia ? '₹' : '$';
            return (
              <div key={bot.id} className="bot-item-card">
                <div className="bot-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="bot-name" title={bot.name}>{bot.name}</div>
                      <div className="bot-sub">{bot.customStrategy?.name || bot.strategy} ({bot.customStrategy?.interval || '1m'}) • {bot.symbol}</div>
                    </div>
                    <div className="bot-card-price" style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div className="price-label" style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Last Price</div>
                      <div className="price-value" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{formatPrice(bot.symbol, prices[bot.symbol])}</div>
                    </div>
                  </div>
                  <div className="bot-params" title={JSON.stringify(bot.parameters)}>{JSON.stringify(bot.parameters)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Realized: <span style={{ fontWeight: 600, color: PL.realizedPL >= 0 ? 'var(--color-profit)' : 'var(--color-loss)' }}>{PL.realizedPL >= 0 ? '+' : ''}{sym}{PL.realizedPL.toFixed(2)}</span></div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Unrealized: <span style={{ fontWeight: 600, color: PL.unrealizedPL >= 0 ? 'var(--color-profit)' : 'var(--color-loss)' }}>{PL.unrealizedPL >= 0 ? '+' : ''}{sym}{PL.unrealizedPL.toFixed(2)}</span></div>
                    <div style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 700 }}>Total: <span style={{ color: PL.totalPL >= 0 ? 'var(--color-profit)' : 'var(--color-loss)' }}>{PL.totalPL >= 0 ? '+' : ''}{sym}{PL.totalPL.toFixed(2)}</span></div>
                  </div>
                </div>
                <div className="bot-actions">
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <button onClick={() => onEditBot(bot)} style={{ padding: '0.25rem 0.4rem', fontSize: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '3px', background: 'white', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => onDeleteBot(bot.id, bot.name)} style={{ padding: '0.25rem 0.4rem', fontSize: '0.7rem', border: '1px solid #fca5a5', borderRadius: '3px', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer' }}>Delete</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={`bot-status-indicator ${bot.active ? 'active' : 'inactive'}`}><span className="dot"></span></div>
                    <button onClick={() => onToggleBot(bot.id, bot.active)} className={bot.active ? 'btn-active' : ''}>{bot.active ? 'Stop' : 'Start'}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
