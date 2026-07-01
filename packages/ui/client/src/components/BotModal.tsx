import { useState, useEffect } from 'react';
import axios from 'axios';

interface BotModalProps {
  show: boolean;
  onClose: () => void;
  sessions: any[];
  customStrategies: any[];
  isEditMode: boolean;
  editingBot: any;
  onSave: (data: any) => Promise<void>;
}

export function BotModal({ show, onClose, sessions, customStrategies, isEditMode, editingBot, onSave }: BotModalProps) {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [customStrategyId, setCustomStrategyId] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (show) {
      if (isEditMode && editingBot) {
        setName(editingBot.name);
        setSessionId(editingBot.allocationSessionId || '');
        setCustomStrategyId(editingBot.customStrategyId || '');
        setSelectedSymbols((editingBot.symbol || '').split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean));
      } else {
        setName('');
        setSessionId('');
        setCustomStrategyId('');
        setSelectedSymbols([]);
      }
      setSearchQuery('');
      setSuggestions([]);
    }
  }, [show, isEditMode, editingBot]);

  useEffect(() => {
    if (!searchQuery || !sessionId) {
      setSuggestions([]);
      return;
    }
    const sess = sessions.find(s => s.id === sessionId);
    const market = sess?.enabledMarkets?.[0] || 'india';
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/trade/search-symbols?market=${market}&query=${searchQuery}`);
        if (res.data.success) setSuggestions(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery, sessionId, sessions]);

  const addSymbol = (sym: string) => {
    const s = sym.toUpperCase().trim();
    if (s && !selectedSymbols.includes(s)) setSelectedSymbols([...selectedSymbols, s]);
    setSearchQuery('');
    setShowDropdown(false);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditMode ? 'Edit Strategy Bot' : 'Create New Strategy Bot'}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ name, symbol: selectedSymbols.join(','), allocationSessionId: sessionId, customStrategyId }); }}>
          <div className="form-group">
            <label>Account</label>
            <select required value={sessionId} onChange={e => { setSessionId(e.target.value); setSelectedSymbols([]); }} className="form-control">
              <option value="">Select an account...</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Bot Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nifty Momentum" className="form-control" />
          </div>
          <div className="form-group">
            <label>Custom Strategy</label>
            <select required value={customStrategyId} onChange={e => setCustomStrategyId(e.target.value)}>
              <option value="">Select a strategy...</option>
              {customStrategies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Add Trading Symbols</label>
            <input type="text" disabled={!sessionId} placeholder={sessionId ? "Type to search..." : "Select account first..."} value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} className="form-control" />
            {showDropdown && searchQuery && (suggestions.length > 0 || loading) && (
              <div className="suggestions-dropdown" style={{ position: 'absolute', background: 'white', border: '1px solid #cbd5e1', zIndex: 10, width: '100%', maxHeight: '150px', overflowY: 'auto' }}>
                {loading && <div style={{ padding: '0.5rem' }}>Loading...</div>}
                {!loading && suggestions.map(item => (
                  <div key={item.symbol} onMouseDown={() => addSymbol(item.symbol)} style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                    <strong>{item.symbol}</strong> - {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="symbol-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {selectedSymbols.map(sym => (
              <span key={sym} className="symbol-tag" style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                {sym}
                <button type="button" onClick={() => setSelectedSymbols(selectedSymbols.filter(s => s !== sym))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}>×</button>
              </span>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={selectedSymbols.length === 0}>
              {isEditMode ? 'Save Changes' : 'Create Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
