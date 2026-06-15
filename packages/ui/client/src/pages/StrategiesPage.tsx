import { useState, useEffect } from 'react';
import axios from 'axios';
import './StrategiesPage.scss';
import { usePageContext } from '../context/PageContext';

interface CustomStrategy {
  id: string;
  name: string;
  baseType: string;
  parameters: Record<string, any>;
  interval: string;
  botCount: number;
  totalPL: number;
  createdAt: string;
}

const AVAILABLE_STRATEGIES = {
  GoldenCross: {
    name: 'Golden Cross',
    defaultParams: { fastPeriod: 9, slowPeriod: 20 },
    paramSchema: [
      { name: 'fastPeriod', label: 'Fast SMA Period', type: 'number', default: 9 },
      { name: 'slowPeriod', label: 'Slow SMA Period', type: 'number', default: 20 },
    ]
  },
  RSIMeanReversion: {
    name: 'RSI Mean Reversion',
    defaultParams: { rsiPeriod: 14, oversoldThreshold: 30, overboughtThreshold: 70 },
    paramSchema: [
      { name: 'rsiPeriod', label: 'RSI Period', type: 'number', default: 14 },
      { name: 'oversoldThreshold', label: 'Oversold Threshold', type: 'number', default: 30 },
      { name: 'overboughtThreshold', label: 'Overbought Threshold', type: 'number', default: 70 },
    ]
  },
  IndexOptionMomentum: {
    name: 'Index Option Momentum',
    defaultParams: { fastPeriod: 9, slowPeriod: 20, source: 'close' },
    paramSchema: [
      { name: 'fastPeriod', label: 'Fast Period', type: 'number', default: 9 },
      { name: 'slowPeriod', label: 'Slow Period', type: 'number', default: 20 },
      { name: 'source', label: 'Source Candle Value', type: 'select', options: ['close', 'open', 'high', 'low'], default: 'close' },
    ]
  },
  IndexOptionRsiReversion: {
    name: 'Index Option RSI Reversion',
    defaultParams: { rsiPeriod: 14, oversoldThreshold: 30, overboughtThreshold: 70, source: 'close' },
    paramSchema: [
      { name: 'rsiPeriod', label: 'RSI Period', type: 'number', default: 14 },
      { name: 'oversoldThreshold', label: 'Oversold Threshold', type: 'number', default: 30 },
      { name: 'overboughtThreshold', label: 'Overbought Threshold', type: 'number', default: 70 },
      { name: 'source', label: 'Source Candle Value', type: 'select', options: ['close', 'open', 'high', 'low'], default: 'close' },
    ]
  },
  PivotTrend: {
    name: 'Pivot Trend',
    defaultParams: { direction: 'both' },
    paramSchema: [
      { name: 'direction', label: 'Direction', type: 'select', options: ['both', 'long', 'short'], default: 'both' },
    ]
  },
  PivotTrendOption: {
    name: 'Pivot Trend Option',
    defaultParams: { direction: 'both' },
    paramSchema: [
      { name: 'direction', label: 'Direction', type: 'select', options: ['both', 'long', 'short'], default: 'both' },
    ]
  },
  VwapRvolOption: {
    name: 'VWAP + RVOL Option',
    defaultParams: { rvolThreshold: 2.0, source: 'close' },
    paramSchema: [
      { name: 'rvolThreshold', label: 'RVOL Threshold', type: 'number', default: 2.0 },
      { name: 'source', label: 'Source Candle Value', type: 'select', options: ['close', 'open', 'high', 'low'], default: 'close' },
    ]
  },
  VsaClimacticOption: {
    name: 'VSA Climactic Option',
    defaultParams: { bbPeriod: 20, bbStdDev: 2.0, rvolThreshold: 2.0, bodyMultiplier: 0.8, source: 'close' },
    paramSchema: [
      { name: 'bbPeriod', label: 'Bollinger Bands Period', type: 'number', default: 20 },
      { name: 'bbStdDev', label: 'Bollinger Bands Std Dev', type: 'number', default: 2.0 },
      { name: 'rvolThreshold', label: 'RVOL Threshold', type: 'number', default: 2.0 },
      { name: 'bodyMultiplier', label: 'Body Multiplier', type: 'number', default: 0.8 },
      { name: 'source', label: 'Source Candle Value', type: 'select', options: ['close', 'open', 'high', 'low'], default: 'close' },
    ]
  },
  WeeklyAvwapOption: {
    name: 'Weekly AVWAP Option',
    defaultParams: { volumeSmaPeriod: 20 },
    paramSchema: [
      { name: 'volumeSmaPeriod', label: 'Volume SMA Period', type: 'number', default: 20 },
    ]
  },
  ChandelierTrendOption: {
    name: 'Chandelier Trend Option',
    defaultParams: { period: 22, multiplier: 3.0, rvolThreshold: 2.0 },
    paramSchema: [
      { name: 'period', label: 'Chandelier Period', type: 'number', default: 22 },
      { name: 'multiplier', label: 'Chandelier Multiplier', type: 'number', default: 3.0 },
      { name: 'rvolThreshold', label: 'RVOL Threshold', type: 'number', default: 2.0 },
    ]
  }
};

const TIMEFRAME_INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '1d'];

export function StrategiesPage() {
  const { setPageTitle, setToolbar } = usePageContext();
  const [strategies, setStrategies] = useState<CustomStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formBaseType, setFormBaseType] = useState<keyof typeof AVAILABLE_STRATEGIES>('GoldenCross');
  const [formInterval, setFormInterval] = useState('1m');
  const [formParameters, setFormParameters] = useState<Record<string, any>>({});

  useEffect(() => {
    setPageTitle('Strategies');
  }, [setPageTitle]);

  useEffect(() => {
    setToolbar(
      <button className="tb-btn-primary" onClick={handleOpenCreate}>
        <i className="la la-plus" style={{ marginRight: 4 }} />
        Create Strategy
      </button>
    );
  }, [setToolbar]);

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/strategies/custom');
      if (res.data.success) {
        setStrategies(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch custom strategies:', err);
      showNotification('Failed to fetch custom strategies.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormName('');
    setFormBaseType('GoldenCross');
    setFormInterval('1m');
    setFormParameters(AVAILABLE_STRATEGIES.GoldenCross.defaultParams);
    setShowModal(true);
  };

  const handleOpenEdit = (strat: CustomStrategy) => {
    setIsEditMode(true);
    setEditingId(strat.id);
    setFormName(strat.name);
    const base = strat.baseType as keyof typeof AVAILABLE_STRATEGIES;
    setFormBaseType(base in AVAILABLE_STRATEGIES ? base : 'GoldenCross');
    setFormInterval(strat.interval);
    setFormParameters(strat.parameters || {});
    setShowModal(true);
  };

  const handleBaseTypeChange = (base: keyof typeof AVAILABLE_STRATEGIES) => {
    setFormBaseType(base);
    setFormParameters(AVAILABLE_STRATEGIES[base].defaultParams);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBaseType || !formInterval) {
      showNotification('Please fill in name, base type, and interval.', 'error');
      return;
    }

    const payload = {
      name: formName,
      baseType: formBaseType,
      parameters: formParameters,
      interval: formInterval
    };

    try {
      if (isEditMode && editingId) {
        await axios.put(`/api/strategies/custom/${editingId}`, payload);
        showNotification('Strategy updated successfully.');
      } else {
        await axios.post('/api/strategies/custom', payload);
        showNotification('Strategy created successfully.');
      }
      setShowModal(false);
      fetchStrategies();
    } catch (err: any) {
      showNotification(err.response?.data?.error || 'Failed to save strategy.', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`WARNING: Deleting custom strategy "${name}" will permanently DELETE all active strategy bots associated with it. Are you sure you want to proceed?`)) {
      return;
    }

    try {
      await axios.delete(`/api/strategies/custom/${id}`);
      showNotification('Strategy deleted successfully.');
      fetchStrategies();
    } catch (err) {
      showNotification('Failed to delete strategy.', 'error');
    }
  };

  return (
    <div className="strategies-page">
      {message && (
        <div className={`notification-banner ${message.type}`}>
          <i className={`la ${message.type === 'success' ? 'la-check-circle' : 'la-exclamation-circle'}`}></i>
          <span>{message.text}</span>
        </div>
      )}

      <div className="strategies-layout">
        {loading ? (
          <div className="empty-state">
            <i className="la la-spinner la-spin" />
            <h4>Loading strategies...</h4>
          </div>
        ) : strategies.length === 0 ? (
          <div className="empty-state">
            <i className="la la-sliders-h" />
            <h4>No custom strategies yet</h4>
            <p>Create strategy rules by customizing parameters and choosing timeframe intervals.</p>
            <button className="btn-primary" style={{ width: 'auto' }} onClick={handleOpenCreate}>
              Create Custom Strategy
            </button>
          </div>
        ) : (
          <div className="strategies-grid">
            {strategies.map(strat => (
              <div key={strat.id} className="strategy-item-card">
                <div className="strategy-card-main">
                  <div className="strategy-header">
                    <span className="strategy-name">{strat.name}</span>
                    <span className="timeframe-badge">{strat.interval}</span>
                  </div>
                  <div className="strategy-meta">
                    Base: <span className="base-type">{AVAILABLE_STRATEGIES[strat.baseType as keyof typeof AVAILABLE_STRATEGIES]?.name || strat.baseType}</span>
                  </div>
                  <div className="strategy-params">
                    {Object.entries(strat.parameters || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}
                  </div>
                </div>

                <div className="strategy-stats">
                  <div className="stat-box">
                    <div className="label">Bots Count</div>
                    <div className="value">{strat.botCount}</div>
                  </div>
                  <div className="stat-box">
                    <div className="label">Total P/L</div>
                    <div className={`value ${strat.totalPL >= 0 ? 'positive' : 'negative'}`}>
                      {strat.totalPL >= 0 ? '+' : ''}₹{strat.totalPL.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="strategy-actions">
                  <button onClick={() => handleOpenEdit(strat)}>
                    <i className="la la-edit" /> Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(strat.id, strat.name)}>
                    <i className="la la-trash" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h2>{isEditMode ? 'Edit Strategy' : 'Create Strategy'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Strategy Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pivot Trend Intraday 15m"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Base Strategy Type</label>
                <select
                  value={formBaseType}
                  onChange={e => handleBaseTypeChange(e.target.value as keyof typeof AVAILABLE_STRATEGIES)}
                >
                  {Object.entries(AVAILABLE_STRATEGIES).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Timeframe Interval</label>
                <select
                  value={formInterval}
                  onChange={e => setFormInterval(e.target.value)}
                >
                  {TIMEFRAME_INTERVALS.map(intv => (
                    <option key={intv} value={intv}>{intv}</option>
                  ))}
                </select>
              </div>

              {AVAILABLE_STRATEGIES[formBaseType]?.paramSchema.map((param: any) => (
                <div key={param.name} className="form-group">
                  <label>{param.label}</label>
                  {param.type === 'select' ? (
                    <select
                      value={formParameters[param.name] ?? param.default}
                      onChange={e => setFormParameters(prev => ({ ...prev, [param.name]: e.target.value }))}
                    >
                      {param.options?.map((opt: any) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={formParameters[param.name] ?? param.default}
                      onChange={e => setFormParameters(prev => ({ ...prev, [param.name]: Number(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                  )}
                </div>
              ))}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Strategy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
