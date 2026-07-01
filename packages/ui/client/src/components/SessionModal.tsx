import { useState, useEffect } from 'react';

interface SessionModalProps {
  show: boolean;
  onClose: () => void;
  isEditMode: boolean;
  editingSession: any;
  onSave: (data: any) => Promise<void>;
}

export function SessionModal({ show, onClose, isEditMode, editingSession, onSave }: SessionModalProps) {
  const [name, setName] = useState('');
  const [capital, setCapital] = useState(10000);
  const [maxDrawdown, setMaxDrawdown] = useState(10);
  const [provider, setProvider] = useState('paper');
  const [market, setMarket] = useState('india');

  useEffect(() => {
    if (show) {
      if (isEditMode && editingSession) {
        setName(editingSession.name);
        setCapital(editingSession.capital);
        setMaxDrawdown(editingSession.maxDrawdownPct || 10);
        setProvider(editingSession.provider || 'paper');
        setMarket(editingSession.enabledMarkets?.[0] || 'india');
      } else {
        setName('');
        setCapital(10000);
        setMaxDrawdown(10);
        setProvider('paper');
        setMarket('india');
      }
    }
  }, [show, isEditMode, editingSession]);

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditMode ? 'Edit Session' : 'Create New Session'}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ name, capital, maxDrawdownPct: maxDrawdown, provider, enabledMarkets: [market] }); }}>
          <div className="form-group">
            <label>Session Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. India Options" className="form-control" />
          </div>
          <div className="form-group">
            <label>Allocated Capital</label>
            <input type="number" required min={1} value={capital} onChange={e => setCapital(parseFloat(e.target.value) || 0)} className="form-control" />
          </div>
          <div className="form-group">
            <label>Max Drawdown Limit (%)</label>
            <input type="number" required min={1} max={100} value={maxDrawdown} onChange={e => setMaxDrawdown(parseFloat(e.target.value) || 0)} className="form-control" />
          </div>
          <div className="form-group">
            <label>Execution Provider</label>
            <select value={provider} onChange={e => setProvider(e.target.value)}>
              <option value="paper">Paper Trading</option>
              <option value="zerodha">Zerodha / KiteConnect</option>
              <option value="tradier">Tradier Brokerage</option>
            </select>
          </div>
          <div className="form-group">
            <label>Enabled Market</label>
            <select value={market} onChange={e => setMarket(e.target.value)}>
              <option value="india">India (NSE/BSE)</option>
              <option value="us">US (NYSE/NASDAQ)</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">{isEditMode ? 'Save Changes' : 'Create Session'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
