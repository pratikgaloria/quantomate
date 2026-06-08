import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './TradingPage.scss';

interface Bot {
  id: string;
  name: string;
  strategy: string;
  symbol: string;
  active: boolean;
  parameters: Record<string, any>;
}

interface Position {
  symbol: string;
  qty: number;
  avgEntryPrice: number;
  marketPrice: number;
  unrealizedPL: number;
  costBasis: number;
}

interface Order {
  id: string;
  clientOrderId: string;
  status: string;
  filledQty: number;
  avgFillPrice?: number;
  filledAt?: string;
  commissionPaid?: number;
  symbol?: string;
  side?: string;
}

interface TradeStatus {
  zerodha: {
    authenticated: boolean;
    authenticatedAt: string | null;
  };
  engine: {
    running: boolean;
    activeBots: number;
    offline?: boolean;
  };
  account: {
    accountId: string;
    cashBalance: number;
    portfolioValue: number;
    marginBuyingPower: number;
    currency: string;
    isPaper: boolean;
  } | null;
}

interface SystemSettings {
  tradingMode: 'paper' | 'live';
  enabledMarkets: string[];
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
  }
};

export function TradingPage() {
  const [status, setStatus] = useState<TradeStatus>({
    zerodha: { authenticated: false, authenticatedAt: null },
    engine: { running: false, activeBots: 0 },
    account: null,
  });

  const [bots, setBots] = useState<Bot[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<Record<string, number | null>>({
    'NIFTY 50': null,
    'NIFTY BANK': null,
  });

  // Settings state
  const [settings, setSettings] = useState<SystemSettings>({
    tradingMode: 'paper',
    enabledMarkets: ['india'],
  });

  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Bot creation/editing states
  const [showBotModal, setShowBotModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBotId, setEditingBotId] = useState<string | null>(null);
  const [botFormName, setBotFormName] = useState('');
  const [botFormStrategy, setBotFormStrategy] = useState<keyof typeof AVAILABLE_STRATEGIES>('GoldenCross');
  const [botFormSymbol, setBotFormSymbol] = useState('NIFTY 50');
  const [botFormParameters, setBotFormParameters] = useState<Record<string, any>>({});

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial fetches
    fetchSettings();
    fetchStatus();
    fetchBots();
    fetchPositions();
    fetchOrders();
    fetchPrices();

    // Start polling loop every 3 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchStatus();
      fetchPositions();
      fetchOrders();
      fetchPrices();
    }, 3000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleStrategyChange = (strat: keyof typeof AVAILABLE_STRATEGIES) => {
    setBotFormStrategy(strat);
    setBotFormParameters(AVAILABLE_STRATEGIES[strat].defaultParams);
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditingBotId(null);
    setBotFormName('');
    setBotFormStrategy('GoldenCross');
    setBotFormSymbol('NIFTY 50');
    setBotFormParameters(AVAILABLE_STRATEGIES.GoldenCross.defaultParams);
    setShowBotModal(true);
  };

  const handleOpenEdit = (bot: Bot) => {
    setIsEditMode(true);
    setEditingBotId(bot.id);
    setBotFormName(bot.name);
    const strat = bot.strategy as keyof typeof AVAILABLE_STRATEGIES;
    setBotFormStrategy(strat in AVAILABLE_STRATEGIES ? strat : 'GoldenCross');
    setBotFormSymbol(bot.symbol);
    setBotFormParameters(bot.parameters || {});
    setShowBotModal(true);
  };

  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botFormName || !botFormSymbol) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    const payload = {
      name: botFormName,
      strategy: botFormStrategy,
      symbol: botFormSymbol,
      parameters: botFormParameters,
    };

    try {
      if (isEditMode && editingBotId) {
        const res = await axios.put(`/api/trade/bots/${editingBotId}`, payload);
        if (res.data.success) {
          showNotification('Bot updated successfully.');
        }
      } else {
        const res = await axios.post('/api/trade/bots', payload);
        if (res.data.success) {
          showNotification('Bot created successfully.');
        }
      }
      setShowBotModal(false);
      fetchBots();
      fetchStatus();
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to save bot.', 'error');
    }
  };

  const handleDeleteBot = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete strategy bot "${name}"?`)) {
      return;
    }
    try {
      const res = await axios.delete(`/api/trade/bots/${id}`);
      if (res.data.success) {
        showNotification('Bot deleted successfully.');
        fetchBots();
        fetchStatus();
      }
    } catch (err: any) {
      showNotification('Failed to delete bot.', 'error');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/trade/settings');
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch settings:', err.message);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get<TradeStatus>('/api/trade/status');
      if (res.data) setStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  const fetchBots = async () => {
    try {
      const res = await axios.get('/api/trade/bots');
      if (res.data.success) setBots(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bots:', err);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await axios.get('/api/trade/positions');
      if (res.data.success) setPositions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/trade/orders');
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await axios.get('/api/trade/prices');
      if (res.data.success) setPrices(res.data.data);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSettings(true);
    try {
      const res = await axios.post('/api/trade/settings', settings);
      if (res.data.success) {
        showNotification('Settings saved successfully. Daemon notified.');
        fetchStatus();
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to save settings.', 'error');
    } finally {
      setUpdatingSettings(false);
    }
  };

  const toggleMarketCheckbox = (market: string) => {
    setSettings((prev) => {
      const enabledMarkets = prev.enabledMarkets.includes(market)
        ? prev.enabledMarkets.filter((m) => m !== market)
        : [...prev.enabledMarkets, market];
      return { ...prev, enabledMarkets };
    });
  };

  const toggleBot = async (id: string, currentlyActive: boolean) => {
    try {
      const res = await axios.post('/api/trade/bots/toggle', { id, active: !currentlyActive });
      if (res.data.success) {
        showNotification(`Bot ${currentlyActive ? 'stopped' : 'started'} successfully.`);
        fetchBots();
        fetchStatus();
      }
    } catch (err: any) {
      showNotification('Failed to toggle bot status.', 'error');
    }
  };

  const exitPosition = async (symbol: string) => {
    if (!window.confirm(`Are you sure you want to market exit position for ${symbol}?`)) {
      return;
    }
    try {
      const res = await axios.post('/api/trade/positions/exit', { symbol });
      if (res.data.success) {
        showNotification(`Exit order placed for ${symbol}.`);
        fetchPositions();
        fetchOrders();
      } else {
        showNotification(res.data.message || 'Exit failed.', 'error');
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to place exit order.', 'error');
    }
  };

  const panicExitAll = async () => {
    if (!window.confirm('WARNING: Are you absolutely sure you want to close ALL open positions immediately?')) {
      return;
    }
    try {
      const res = await axios.post('/api/trade/panic-exit');
      if (res.data.success) {
        showNotification('Panic exit triggered! All positions closed.', 'success');
        fetchPositions();
        fetchOrders();
      }
    } catch (err: any) {
      showNotification('Panic exit failed to execute.', 'error');
    }
  };

  const handleAuthRedirect = () => {
    window.open('http://127.0.0.1:8082/auth/zerodha/login', '_blank', 'width=600,height=600');
  };

  // Determine daemon badge class
  let daemonBadgeClass = 'offline';
  let daemonBadgeText = 'Offline';
  if (!status.engine.offline) {
    if (status.engine.running) {
      daemonBadgeClass = 'running';
      daemonBadgeText = 'Running';
    } else {
      daemonBadgeClass = 'idle';
      daemonBadgeText = 'Idle';
    }
  }

  return (
    <div className="trading-page">
      {/* Top Header */}
      <div className="trading-header-bar">
        <div>
          <h1>Live & Paper Trading Control Center</h1>
          <div className="subtitle">Manage daemon, session settings, and active execution bots</div>
        </div>
        <div className={`status-badge ${daemonBadgeClass}`}>
          <span className="dot"></span>
          <span>Daemon: {daemonBadgeText}</span>
        </div>
      </div>

      {/* Notifications Alert Banner */}
      {message && (
        <div className={`notification-banner ${message.type}`}>
          <i className={`la ${message.type === 'success' ? 'la-check-circle' : 'la-exclamation-circle'}`}></i>
          <span>{message.text}</span>
        </div>
      )}

      <div className="trading-layout">
        {/* Left Column Controls */}
        <div className="controls-panel">
          {/* Zerodha Auth Status Card */}
          <div className="trading-card">
            <h3>
              <i className="la la-key"></i>
              Broker Authentication
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Zerodha API requires a fresh session token daily to execute live trades.
            </div>
            {status.zerodha.authenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' }}>
                <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                Authenticated
              </div>
            ) : (
              <div>
                <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Session Expired / Inactive
                </div>
                <button onClick={handleAuthRedirect} className="btn-primary" style={{ backgroundColor: '#22c55e' }}>
                  Connect Broker
                </button>
              </div>
            )}
          </div>

          {/* Settings Config Card */}
          <div className="trading-card">
            <h3>
              <i className="la la-cog"></i>
              System Settings
            </h3>
            <form onSubmit={saveSettings}>
              <div className="form-group">
                <label>Trading Mode</label>
                <select
                  value={settings.tradingMode}
                  onChange={(e) => setSettings({ ...settings, tradingMode: e.target.value as any })}
                >
                  <option value="paper">Paper Trading (In-Memory)</option>
                  <option value="live">Live Trading (DB Simulated)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Enabled Markets</label>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.enabledMarkets.includes('india')}
                      onChange={() => toggleMarketCheckbox('india')}
                    />
                    <span>India (NSE/BSE)</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.enabledMarkets.includes('us')}
                      onChange={() => toggleMarketCheckbox('us')}
                    />
                    <span>US (NYSE/NASDAQ)</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.enabledMarkets.includes('crypto')}
                      onChange={() => toggleMarketCheckbox('crypto')}
                    />
                    <span>Crypto (24/7)</span>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={updatingSettings} className="btn-primary">
                {updatingSettings ? 'Updating...' : 'Apply Configuration'}
              </button>
            </form>
          </div>

          {/* Spot Index Tracker Card */}
          <div className="trading-card">
            <h3>
              <i className="la la-broadcast-tower"></i>
              Live Index Tracker
            </h3>
            <div className="account-metric-grid">
              <div className="metric-box">
                <div className="label">Nifty 50</div>
                <div className="value">
                  {prices['NIFTY 50'] !== null ? `₹${prices['NIFTY 50'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Awaiting...'}
                </div>
              </div>
              <div className="metric-box">
                <div className="label">Nifty Bank</div>
                <div className="value">
                  {prices['NIFTY BANK'] !== null ? `₹${prices['NIFTY BANK'].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Awaiting...'}
                </div>
              </div>
            </div>
          </div>

          {/* Account Metrics Card */}
          <div className="trading-card">
            <h3>
              <i className="la la-wallet"></i>
              Broker Capital
            </h3>
            {status.account ? (
              <div className="account-metric-grid">
                <div className="metric-box">
                  <div className="label">Cash Balance</div>
                  <div className="value">₹{status.account.cashBalance.toLocaleString()}</div>
                </div>
                <div className="metric-box">
                  <div className="label">Portfolio Value</div>
                  <div className="value">₹{status.account.portfolioValue.toLocaleString()}</div>
                </div>
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No active broker session.</div>
            )}
          </div>

          {/* Panic Switch Card */}
          <div className="trading-card" style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}>
            <h3 style={{ color: '#991b1b' }}>
              <i className="la la-exclamation-triangle" style={{ color: '#ef4444' }}></i>
              Emergency Override
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#991b1b', margin: '0 0 1rem 0' }}>
              Instantly market sells all open positions and cancels any pending orders.
            </p>
            <button
              onClick={panicExitAll}
              disabled={status.engine.offline || (!positions.length && !orders.some(o => o.status === 'pending'))}
              className="panic-btn"
            >
              PANIC EXIT / CLOSE ALL
            </button>
          </div>
        </div>

        {/* Right Column Content Dashboard */}
        <div className="trading-dashboard-content">
          {/* Bots Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Strategy Bot Allocations
              </h3>
              <button
                onClick={handleOpenCreate}
                style={{
                  width: 'auto',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                + Add Bot
              </button>
            </div>
            {bots.length === 0 ? (
              <div className="trading-card" style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
                No strategy bots seeded or configured.
              </div>
            ) : (
              <div className="bot-card-grid">
                {bots.map((bot) => (
                  <div key={bot.id} className="bot-item-card">
                    <div className="bot-details">
                      <div className="bot-name" title={bot.name}>{bot.name}</div>
                      <div className="bot-sub">{bot.strategy} Strategy • {bot.symbol}</div>
                      <div className="bot-params" title={JSON.stringify(bot.parameters)}>
                        {JSON.stringify(bot.parameters)}
                      </div>
                    </div>
                    <div className="bot-actions">
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handleOpenEdit(bot)}
                          style={{
                            padding: '0.25rem 0.4rem',
                            fontSize: '0.7rem',
                            border: '1px solid #cbd5e1',
                            borderRadius: '3px',
                            background: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBot(bot.id, bot.name)}
                          style={{
                            padding: '0.25rem 0.4rem',
                            fontSize: '0.7rem',
                            border: '1px solid #fca5a5',
                            borderRadius: '3px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className={`bot-status-indicator ${bot.active ? 'active' : 'inactive'}`}>
                          <span className="dot"></span>
                        </div>
                        <button
                          onClick={() => toggleBot(bot.id, bot.active)}
                          className={bot.active ? 'btn-active' : ''}
                        >
                          {bot.active ? 'Stop' : 'Start'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Positions Table */}
          <div className="trading-card">
            <h3>
              <i className="la la-exchange-alt"></i>
              Open Positions
            </h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Avg. Entry</th>
                    <th>Market Price</th>
                    <th>Unrealized P/L</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                        No open positions.
                      </td>
                    </tr>
                  ) : (
                    positions.map((pos) => (
                      <tr key={pos.symbol}>
                        <td style={{ fontWeight: 700 }}>{pos.symbol}</td>
                        <td>{pos.qty}</td>
                        <td>₹{pos.avgEntryPrice.toFixed(2)}</td>
                        <td>₹{pos.marketPrice.toFixed(2)}</td>
                        <td className={`pnl-badge ${pos.unrealizedPL >= 0 ? 'positive' : 'negative'}`}>
                          {pos.unrealizedPL >= 0 ? '+' : ''}₹{pos.unrealizedPL.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => exitPosition(pos.symbol)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              border: '1px solid #fca5a5',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Exit Position
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders Executions Table */}
          <div className="trading-card">
            <h3>
              <i className="la la-history"></i>
              Recent Order Executions
            </h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Symbol</th>
                    <th>Side</th>
                    <th>Qty</th>
                    <th>Avg. Fill Price</th>
                    <th>Status</th>
                    <th>Executed At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                        No orders executed yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>{ord.id}</td>
                        <td style={{ fontWeight: 700 }}>{ord.symbol || 'SBIN'}</td>
                        <td>
                          <span className={`side-badge ${(ord.side === 'buy' || ord.side === 'BUY') ? 'buy' : 'sell'}`}>
                            {ord.side}
                          </span>
                        </td>
                        <td>{ord.filledQty}</td>
                        <td>₹{ord.avgFillPrice ? ord.avgFillPrice.toFixed(2) : '0.00'}</td>
                        <td>
                          <span className={`status-label ${ord.status.toLowerCase()}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {ord.filledAt ? new Date(ord.filledAt).toLocaleTimeString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Form Modal */}
      {showBotModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditMode ? 'Edit Strategy Bot Parameters' : 'Create New Strategy Bot'}</h2>
            <form onSubmit={handleSaveBot}>
              <div className="form-group">
                <label>Bot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nifty Bank Momentum"
                  value={botFormName}
                  onChange={(e) => setBotFormName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div className="form-group">
                <label>Strategy Type</label>
                <select
                  disabled={isEditMode}
                  value={botFormStrategy}
                  onChange={(e) => handleStrategyChange(e.target.value as keyof typeof AVAILABLE_STRATEGIES)}
                >
                  {Object.entries(AVAILABLE_STRATEGIES).map(([key, strat]) => (
                    <option key={key} value={key}>
                      {strat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Trading Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIFTY 50, SBIN, RELIANCE"
                  value={botFormSymbol}
                  onChange={(e) => setBotFormSymbol(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Dynamic Strategy Parameters Form Section */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Strategy Parameters
                </h4>
                {AVAILABLE_STRATEGIES[botFormStrategy]?.paramSchema.map((field: any) => (
                  <div key={field.name} className="form-group">
                    <label>{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={botFormParameters[field.name] ?? field.default}
                        onChange={(e) => setBotFormParameters({
                          ...botFormParameters,
                          [field.name]: e.target.value
                        })}
                      >
                        {field.options?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        required
                        value={botFormParameters[field.name] ?? field.default}
                        onChange={(e) => setBotFormParameters({
                          ...botFormParameters,
                          [field.name]: parseFloat(e.target.value) || 0
                        })}
                        style={{
                          width: '100%',
                          padding: '0.6rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowBotModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {isEditMode ? 'Save Changes' : 'Create Bot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default TradingPage;
