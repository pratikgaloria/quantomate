interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  settings: any;
  onSave: (data: any) => Promise<void>;
  updating: boolean;
}

export function SettingsModal({ show, onClose, settings, onSave, updating }: SettingsModalProps) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>System Settings</h2>
        <form onSubmit={e => {
          e.preventDefault();
          const target = e.target as any;
          onSave({
            tradingMode: target.tradingMode.value,
            enabledMarkets: Array.from(target.querySelectorAll('input[type="checkbox"]:checked')).map((c: any) => c.value)
          });
        }}>
          <div className="form-group">
            <label>Trading Mode</label>
            <select name="tradingMode" defaultValue={settings.tradingMode}>
              <option value="paper">Paper Trading (In-Memory)</option>
              <option value="live">Live Trading (DB Simulated)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Enabled Markets</label>
            <div className="checkbox-group">
              {['india', 'us', 'crypto'].map(m => (
                <label key={m} className="checkbox-item" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <input type="checkbox" value={m} defaultChecked={settings.enabledMarkets.includes(m)} />
                  <span>{m === 'india' ? 'India (NSE/BSE)' : m === 'us' ? 'US (NYSE/NASDAQ)' : 'Crypto'}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={updating}>{updating ? 'Applying...' : 'Apply Configuration'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
