import { useState } from 'react';
import { getAccountMarket, formatCurrency, formatPL, calculateAccountPL } from '../utils/tradingHelpers';

interface AccountStatsHeaderProps {
  accounts: any[];
  bots: any[];
  orders: any[];
  positions: any[];
  settings: any;
  onUpdateCapital: (id: string, capital: number) => void;
}

export function AccountStatsHeader({ accounts, bots, orders, positions, settings, onUpdateCapital }: AccountStatsHeaderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCapital, setEditCapital] = useState<number>(0);
  const isPaper = settings?.tradingMode === 'paper';

  const handleStartEdit = (acct: any) => {
    if (!isPaper) return;
    setEditingId(acct.id);
    setEditCapital(acct.capital);
  };

  const handleSaveEdit = () => {
    if (editingId && editCapital > 0) {
      onUpdateCapital(editingId, editCapital);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="account-stats-header">
      {accounts.map(acct => {
        const market = getAccountMarket(acct);
        const accountBots = bots.filter(b => b.allocationSessionId === acct.id);
        const accountPositions = positions.filter(p => {
          return accountBots.some(bot => {
            const syms = (bot.symbol || '').split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean);
            return syms.some((bSym: string) => {
              const pSym = p.symbol.toUpperCase();
              if (pSym === bSym) return true;
              if (bSym === 'NIFTY 50' && pSym.startsWith('NIFTY')) return true;
              if (bSym === 'NIFTY BANK' && pSym.startsWith('BANKNIFTY')) return true;
              return pSym.startsWith(bSym);
            });
          });
        });
        const accountOrders = orders.filter(o => {
          return accountBots.some(bot => {
            const syms = (bot.symbol || '').split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean);
            return syms.some((bSym: string) => {
              const oSym = (o.symbol || '').toUpperCase();
              if (oSym === bSym) return true;
              if (bSym === 'NIFTY 50' && oSym.startsWith('NIFTY')) return true;
              if (bSym === 'NIFTY BANK' && oSym.startsWith('BANKNIFTY')) return true;
              return oSym.startsWith(bSym);
            });
          });
        });
        const pl = calculateAccountPL(acct, bots, orders, positions);
        const isEditing = editingId === acct.id;
        const flagEmoji = market === 'india' ? '🇮🇳' : '🇺🇸';
        const brokerLabel = market === 'india' ? 'Zerodha' : 'Tradier';

        return (
          <div key={acct.id} className={`account-card account-card--${market}`}>
            <div className="account-card__header">
              <div className="account-card__title">
                <span className="account-card__flag">{flagEmoji}</span>
                <div>
                  <div className="account-card__name">{acct.name}</div>
                  <div className="account-card__broker">{brokerLabel} • {market === 'india' ? 'INR' : 'USD'}</div>
                </div>
              </div>
              <div className="account-card__value">
                <div className="account-card__value-label">Current Value</div>
                <div className={`account-card__value-amount ${pl.totalPL >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(pl.currentValue, market)}
                </div>
              </div>
            </div>

            <div className="account-card__metrics">
              <div className="account-card__metric">
                <span className="account-card__metric-label">Capital</span>
                {isEditing ? (
                  <div className="account-card__edit-capital">
                    <input
                      type="number"
                      min={1}
                      value={editCapital}
                      onChange={e => setEditCapital(parseFloat(e.target.value) || 0)}
                      className="account-card__capital-input"
                      autoFocus
                    />
                    <button className="account-card__edit-btn save" onClick={handleSaveEdit}>✓</button>
                    <button className="account-card__edit-btn cancel" onClick={handleCancelEdit}>✕</button>
                  </div>
                ) : (
                  <span
                    className={`account-card__metric-value ${isPaper ? 'editable' : ''}`}
                    onClick={() => handleStartEdit(acct)}
                    title={isPaper ? 'Click to edit capital' : 'Capital is fetched from broker in live mode'}
                  >
                    {formatCurrency(acct.capital, market)}
                    {isPaper && <span className="account-card__edit-icon">✎</span>}
                  </span>
                )}
              </div>
              <div className="account-card__metric">
                <span className="account-card__metric-label">Bots</span>
                <span className="account-card__metric-value">{accountBots.length}</span>
              </div>
              <div className="account-card__metric">
                <span className="account-card__metric-label">Positions</span>
                <span className="account-card__metric-value">{accountPositions.length}</span>
              </div>
              <div className="account-card__metric">
                <span className="account-card__metric-label">Orders</span>
                <span className="account-card__metric-value">{accountOrders.filter(o => o.status?.toLowerCase() === 'filled').length}</span>
              </div>
              <div className="account-card__metric">
                <span className="account-card__metric-label">Realised P/L</span>
                <span className={`account-card__metric-value ${pl.realizedPL >= 0 ? 'positive' : 'negative'}`}>
                  {formatPL(pl.realizedPL, market)}
                </span>
              </div>
              <div className="account-card__metric">
                <span className="account-card__metric-label">Unrealised P/L</span>
                <span className={`account-card__metric-value ${pl.unrealizedPL >= 0 ? 'positive' : 'negative'}`}>
                  {formatPL(pl.unrealizedPL, market)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
