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
  allocationSessionId?: string | null;
}

interface AllocationSession {
  id: string;
  name: string;
  capital: number;
  virtualCash: number;
  maxDrawdownPct: number;
  enabledMarkets: string[];
  provider: string;
  active: boolean;
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
  realizedPL?: number | null;
}

interface TradeStatus {
  zerodha: {
    authenticated: boolean;
    authenticatedAt: string | null;
  };
  tradier?: {
    authenticated: boolean;
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
  }
};

export function TradingPage() {
  const [status, setStatus] = useState<TradeStatus>({
    zerodha: { authenticated: false, authenticatedAt: null },
    tradier: { authenticated: false },
    engine: { running: false, activeBots: 0 },
    account: null,
  });

  const [bots, setBots] = useState<Bot[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<Record<string, number | null>>({});

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const getMarketForSymbol = (symbol: string) => {
    const sym = symbol.toUpperCase().trim();
    const cryptoAssets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'DOGE', 'XRP'];
    if (cryptoAssets.some(c => sym.startsWith(c) || sym.endsWith(c) || sym.includes('/USD') || sym.includes('-USD'))) {
      return 'crypto';
    }
    if (
      sym.startsWith('NIFTY') ||
      sym.startsWith('BANKNIFTY') ||
      sym.startsWith('^NSE') ||
      sym.endsWith('.NS') ||
      sym.includes('NSEI') ||
      sym.includes('NSEBANK') ||
      sym.startsWith('NSE:') ||
      sym.startsWith('NFO:') ||
      ['SBIN', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'].includes(sym)
    ) {
      return 'india';
    }
    return 'us';
  };

  const formatPrice = (symbol: string, price: number | null | undefined) => {
    if (price === null || price === undefined) return 'Awaiting...';
    const market = getMarketForSymbol(symbol);
    const currencySymbol = market === 'india' ? '₹' : '$';
    return `${currencySymbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Settings state
  const [settings, setSettings] = useState<SystemSettings>({
    tradingMode: 'paper',
    enabledMarkets: ['india'],
  });

  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Allocation Sessions State
  const [sessions, setSessions] = useState<AllocationSession[]>([]);

  // Session Form States
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isSessionEditMode, setIsSessionEditMode] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionFormName, setSessionFormName] = useState('');
  const [sessionFormCapital, setSessionFormCapital] = useState(10000);
  const [sessionFormMaxDrawdown, setSessionFormMaxDrawdown] = useState(10);
  const [sessionFormMarkets, setSessionFormMarkets] = useState<string[]>(['india']);
  const [sessionFormProvider, setSessionFormProvider] = useState('paper');

  // Bot creation/editing states
  const [showBotModal, setShowBotModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBotId, setEditingBotId] = useState<string | null>(null);
  const [botFormName, setBotFormName] = useState('');
  const [botFormStrategy, setBotFormStrategy] = useState<keyof typeof AVAILABLE_STRATEGIES>('GoldenCross');
  const [botFormSymbol, setBotFormSymbol] = useState('NIFTY 50');
  const [botFormParameters, setBotFormParameters] = useState<Record<string, any>>({});
  const [botFormSessionId, setBotFormSessionId] = useState('');
  const [symbolSuggestions, setSymbolSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const symbolMatchesBot = (tradeSymbol: string, botSym: string): boolean => {
    const tSym = tradeSymbol.toUpperCase();
    const bSym = botSym.toUpperCase();
    if (tSym === bSym) return true;
    if (bSym === 'NIFTY 50' && tSym.startsWith('NIFTY')) return true;
    if (bSym === 'NIFTY BANK' && tSym.startsWith('BANKNIFTY')) return true;
    if (tSym.startsWith(bSym)) return true;
    return false;
  };

  const calculateBotPL = (botSymbol: string) => {
    const botOrders = orders.filter(o => o.symbol && symbolMatchesBot(o.symbol, botSymbol) && o.status.toLowerCase() === 'filled');
    
    let realizedPL = 0;
    let currentQty = 0;
    let avgCost = 0;
    
    const sortedOrders = [...botOrders].sort((a, b) => new Date(a.filledAt || '').getTime() - new Date(b.filledAt || '').getTime());
    
    for (const ord of sortedOrders) {
      const isBuy = ord.side?.toLowerCase() === 'buy' || ord.side?.toLowerCase() === 'buy_to_open' || ord.side?.toLowerCase() === 'buy_to_close';
      const price = ord.avgFillPrice || 0;
      const qty = ord.filledQty || 0;
      const commission = ord.commissionPaid || 0;
      
      if (isBuy) {
        if (currentQty >= 0) {
          const newQty = currentQty + qty;
          avgCost = newQty > 0 ? (currentQty * avgCost + qty * price) / newQty : 0;
          currentQty = newQty;
        } else {
          const closedQty = Math.min(Math.abs(currentQty), qty);
          realizedPL += closedQty * (avgCost - price) - commission;
          currentQty += qty;
          if (currentQty > 0) avgCost = price;
        }
      } else {
        if (currentQty <= 0) {
          const newQty = currentQty - qty;
          avgCost = newQty < 0 ? (Math.abs(currentQty) * avgCost + qty * price) / Math.abs(newQty) : 0;
          currentQty = newQty;
        } else {
          const closedQty = Math.min(currentQty, qty);
          realizedPL += closedQty * (price - avgCost) - commission;
          currentQty -= qty;
          if (currentQty < 0) avgCost = price;
        }
      }
    }
    
    const botPositions = positions.filter(p => symbolMatchesBot(p.symbol, botSymbol));
    const unrealizedPL = botPositions.reduce((sum, pos) => sum + pos.unrealizedPL, 0);
    
    return {
      realizedPL,
      unrealizedPL,
      totalPL: realizedPL + unrealizedPL
    };
  };

  const calculateSessionPL = (session: AllocationSession) => {
    const sessionBots = bots.filter(b => b.allocationSessionId === session.id);
    
    const symbolMatchesAnyBot = (tradeSymbol: string): boolean => {
      return sessionBots.some(b => symbolMatchesBot(tradeSymbol, b.symbol));
    };

    const sessionPositions = positions.filter(p => symbolMatchesAnyBot(p.symbol));
    const positionsValue = sessionPositions.reduce((sum, pos) => sum + (pos.qty * pos.marketPrice), 0);
    
    const currentValue = session.virtualCash + positionsValue;
    const totalPL = currentValue - session.capital;
    const totalPLPct = session.capital > 0 ? (totalPL / session.capital) * 100 : 0;
    
    return {
      currentValue,
      totalPL,
      totalPLPct
    };
  };

  const enrichOrdersWithPL = (ordersList: Order[]): (Order & { realizedPL?: number | null })[] => {
    const sorted = [...ordersList].sort((a, b) => new Date(a.filledAt || '').getTime() - new Date(b.filledAt || '').getTime());
    
    const symbolPositions = new Map<string, { qty: number; avgPrice: number }>();
    
    const enriched = sorted.map(ord => {
      if (ord.status.toLowerCase() !== 'filled') return ord;
      
      const symbol = ord.symbol || '';
      const isBuy = ord.side?.toLowerCase() === 'buy' || ord.side?.toLowerCase() === 'buy_to_open' || ord.side?.toLowerCase() === 'buy_to_close';
      const price = ord.avgFillPrice || 0;
      const qty = ord.filledQty || 0;
      const commission = ord.commissionPaid || 0;
      
      let realizedPL: number | null = null;
      
      let pos = symbolPositions.get(symbol);
      if (!pos) {
        pos = { qty: 0, avgPrice: 0 };
        symbolPositions.set(symbol, pos);
      }
      
      if (isBuy) {
        if (pos.qty >= 0) {
          const newQty = pos.qty + qty;
          pos.avgPrice = newQty > 0 ? (pos.qty * pos.avgPrice + qty * price) / newQty : 0;
          pos.qty = newQty;
        } else {
          const closedQty = Math.min(Math.abs(pos.qty), qty);
          realizedPL = closedQty * (pos.avgPrice - price) - commission;
          pos.qty += qty;
          if (pos.qty > 0) pos.avgPrice = price;
        }
      } else {
        if (pos.qty <= 0) {
          const newQty = pos.qty - qty;
          pos.avgPrice = newQty < 0 ? (Math.abs(pos.qty) * pos.avgPrice + qty * price) / Math.abs(newQty) : 0;
          pos.qty = newQty;
        } else {
          const closedQty = Math.min(pos.qty, qty);
          realizedPL = closedQty * (price - pos.avgPrice) - commission;
          pos.qty -= qty;
          if (pos.qty < 0) pos.avgPrice = price;
        }
      }
      
      return {
        ...ord,
        realizedPL
      };
    });
    
    return enriched.reverse();
  };

  useEffect(() => {
    if (!botFormSymbol || !botFormSessionId) {
      setSymbolSuggestions([]);
      return;
    }

    const selectedSession = sessions.find(s => s.id === botFormSessionId);
    const market = selectedSession?.enabledMarkets?.[0] || 'india';

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await axios.get(`/api/trade/search-symbols?market=${market}&query=${botFormSymbol}`);
        if (res.data.success) {
          setSymbolSuggestions(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [botFormSymbol, botFormSessionId, sessions]);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial fetches
    fetchSettings();
    fetchStatus();
    fetchBots();
    fetchPositions();
    fetchOrders();
    fetchPrices();
    fetchSessions();

    // Start polling loop every 3 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchStatus();
      fetchPositions();
      fetchOrders();
      fetchPrices();
      fetchSessions();
    }, 3000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/trade/sessions');
      if (res.data.success) {
        setSessions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const handleOpenCreateSession = () => {
    setIsSessionEditMode(false);
    setEditingSessionId(null);
    setSessionFormName('');
    setSessionFormCapital(10000);
    setSessionFormMaxDrawdown(10);
    setSessionFormMarkets(['india']);
    setSessionFormProvider('paper');
    setShowSessionModal(true);
  };

  const handleOpenEditSession = (session: AllocationSession) => {
    setIsSessionEditMode(true);
    setEditingSessionId(session.id);
    setSessionFormName(session.name);
    setSessionFormCapital(session.capital);
    setSessionFormMaxDrawdown(session.maxDrawdownPct);
    setSessionFormMarkets(session.enabledMarkets || []);
    setSessionFormProvider(session.provider);
    setShowSessionModal(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionFormName || !sessionFormCapital) {
      showNotification('Please fill in name and capital.', 'error');
      return;
    }

    const payload = {
      name: sessionFormName,
      capital: sessionFormCapital,
      maxDrawdownPct: sessionFormMaxDrawdown,
      enabledMarkets: sessionFormMarkets,
      provider: sessionFormProvider,
    };

    try {
      if (isSessionEditMode && editingSessionId) {
        await axios.put(`/api/trade/sessions/${editingSessionId}`, payload);
        showNotification('Session updated successfully.');
      } else {
        await axios.post('/api/trade/sessions', payload);
        showNotification('Session created successfully.');
      }
      setShowSessionModal(false);
      fetchSessions();
    } catch (err: any) {
      showNotification('Failed to save session.', 'error');
    }
  };

  const handleDeleteSession = async (id: string, name: string) => {
    if (!window.confirm(`WARNING: Deleting session "${name}" will permanently DELETE all strategy bots associated with it. Are you sure you want to proceed?`)) {
      return;
    }
    try {
      await axios.delete(`/api/trade/sessions/${id}`);
      showNotification('Session deleted successfully.');
      fetchSessions();
      fetchBots();
    } catch (err) {
      showNotification('Failed to delete session.', 'error');
    }
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
    setBotFormSymbol('');
    setBotFormParameters(AVAILABLE_STRATEGIES.GoldenCross.defaultParams);
    setBotFormSessionId('');
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
    setBotFormSessionId(bot.allocationSessionId || '');
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
      allocationSessionId: botFormSessionId || null,
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

  // Keep panicExitAll referenced to avoid unused local compilation errors
  if (typeof window !== 'undefined') {
    (window as any).panicExitAll = panicExitAll;
  }

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
        <div className="header-actions">
          {/* Daemon status */}
          <div className={`status-badge ${daemonBadgeClass}`}>
            <span className="dot"></span>
            <span>Daemon: {daemonBadgeText}</span>
          </div>

          {/* Zerodha connection */}
          <div className="connection-status-item">
            <span className={`status-dot ${status.zerodha.authenticated ? 'connected' : 'disconnected'}`}></span>
            <span className="connection-label">KiteConnect</span>
            {!status.zerodha.authenticated && (
              <button className="btn-connect-sm" onClick={handleAuthRedirect}>Connect</button>
            )}
          </div>

          {/* Tradier connection */}
          <div className="connection-status-item">
            <span className={`status-dot ${status.tradier?.authenticated ? 'connected' : 'disconnected'}`}></span>
            <span className="connection-label">Tradier</span>
            {!status.tradier?.authenticated && (
              <button className="btn-connect-sm" onClick={() => showNotification('Please configure TRADIER_API_KEY in your root .env file and restart the daemon to connect.', 'error')}>Connect</button>
            )}
          </div>

          {/* Settings Toggle Button */}
          <button className="settings-toggle-btn" onClick={() => setShowSettingsModal(true)} title="System Settings">
            <i className="la la-cog"></i>
          </button>
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

          {/* Allocation Sessions Card */}
          <div className="trading-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>
                <i className="la la-server"></i>
                Allocation Sessions
              </h3>
              <button
                onClick={handleOpenCreateSession}
                style={{
                  width: 'auto',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.65rem',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                + New
              </button>
            </div>

            {sessions.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '0.5rem 0' }}>
                No sessions configured.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                {sessions.map(sess => (
                  <div key={sess.id} className="session-item-card" style={{ padding: '0.6rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>{sess.name}</span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => handleOpenEditSession(sess)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}>Edit</button>
                        <button onClick={() => handleDeleteSession(sess.id, sess.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}>Delete</button>
                      </div>
                    </div>
                    {(() => {
                      const sessPL = calculateSessionPL(sess);
                      const isIndia = sess.provider === 'zerodha';
                      const sym = isIndia ? '₹' : '$';
                      return (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                            <span>Cap: {sym}{sess.capital.toLocaleString()}</span>
                            <span style={{ fontWeight: 600, color: sess.virtualCash >= sess.capital ? '#16a34a' : '#ef4444' }}>
                              Cash: {sym}{sess.virtualCash.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                            <span>Val: {sym}{sessPL.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            <span style={{ fontWeight: 600, color: sessPL.totalPL >= 0 ? '#16a34a' : '#ef4444' }}>
                              P/L: {sessPL.totalPL >= 0 ? '+' : ''}{sym}{sessPL.totalPL.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({sessPL.totalPLPct.toFixed(2)}%)
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="bot-name" title={bot.name}>{bot.name}</div>
                          <div className="bot-sub">
                            {bot.strategy} Strategy • {bot.symbol} • {sessions.find(s => s.id === bot.allocationSessionId)?.name || 'Unassigned'}
                          </div>
                        </div>
                        <div className="bot-card-price" style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div className="price-label" style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Last Price</div>
                          <div className="price-value" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                            {formatPrice(bot.symbol, prices[bot.symbol])}
                          </div>
                        </div>
                      </div>
                      <div className="bot-params" title={JSON.stringify(bot.parameters)}>
                        {JSON.stringify(bot.parameters)}
                      </div>
                      {(() => {
                        const botPL = calculateBotPL(bot.symbol);
                        const isIndia = getMarketForSymbol(bot.symbol) === 'india';
                        const sym = isIndia ? '₹' : '$';
                        return (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              Realized: <span style={{ fontWeight: 600, color: botPL.realizedPL >= 0 ? '#16a34a' : '#ef4444' }}>
                                {botPL.realizedPL >= 0 ? '+' : ''}{sym}{botPL.realizedPL.toFixed(2)}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              Unrealized: <span style={{ fontWeight: 600, color: botPL.unrealizedPL >= 0 ? '#16a34a' : '#ef4444' }}>
                                {botPL.unrealizedPL >= 0 ? '+' : ''}{sym}{botPL.unrealizedPL.toFixed(2)}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 700 }}>
                              Total: <span style={{ color: botPL.totalPL >= 0 ? '#16a34a' : '#ef4444' }}>
                                {botPL.totalPL >= 0 ? '+' : ''}{sym}{botPL.totalPL.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
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
                    <th>Realized P/L</th>
                    <th>Status</th>
                    <th>Executed At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                        No orders executed yet.
                      </td>
                    </tr>
                  ) : (
                    enrichOrdersWithPL(orders).map((ord) => {
                      const currencySymbol = getMarketForSymbol(ord.symbol || '') === 'india' ? '₹' : '$';
                      return (
                        <tr key={ord.id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>{ord.id}</td>
                          <td style={{ fontWeight: 700 }}>{ord.symbol || 'SBIN'}</td>
                          <td>
                            <span className={`side-badge ${(ord.side === 'buy' || ord.side === 'BUY' || ord.side === 'buy_to_open' || ord.side === 'buy_to_close') ? 'buy' : 'sell'}`}>
                              {ord.side}
                            </span>
                          </td>
                          <td>{ord.filledQty}</td>
                          <td>{currencySymbol}{ord.avgFillPrice ? ord.avgFillPrice.toFixed(2) : '0.00'}</td>
                          <td style={{ fontWeight: 600 }} className={ord.realizedPL !== undefined && ord.realizedPL !== null ? (ord.realizedPL >= 0 ? 'pnl-badge positive' : 'pnl-badge negative') : ''}>
                            {ord.realizedPL !== undefined && ord.realizedPL !== null ? (
                              `${ord.realizedPL >= 0 ? '+' : ''}${currencySymbol}${ord.realizedPL.toFixed(2)}`
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <span className={`status-label ${ord.status.toLowerCase()}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {ord.filledAt ? new Date(ord.filledAt).toLocaleTimeString() : '-'}
                          </td>
                        </tr>
                      );
                    })
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
                <label>Allocation Session</label>
                <select
                  required
                  value={botFormSessionId}
                  onChange={(e) => {
                    setBotFormSessionId(e.target.value);
                    // Clear symbol when session changes to force selection of a correct symbol for new market
                    setBotFormSymbol('');
                  }}
                >
                  <option value="">Select a session...</option>
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.provider === 'zerodha' ? '₹' : '$'}{s.capital.toLocaleString()})</option>
                  ))}
                </select>
              </div>

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

              <div className="form-group" style={{ position: 'relative' }}>
                <label>Trading Symbol</label>
                <input
                  type="text"
                  required
                  disabled={!botFormSessionId}
                  placeholder={
                    !botFormSessionId
                      ? 'Please select a session first...'
                      : 'Type to search (e.g. NIFTY, SBIN, AAPL)...'
                  }
                  value={botFormSymbol}
                  onChange={(e) => {
                    setBotFormSymbol(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    // Slight delay to allow clicking on list items before they disappear
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
                
                {showSuggestions && botFormSessionId && (symbolSuggestions.length > 0 || loadingSuggestions) && (
                  <div
                    className="suggestions-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      background: 'white',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      marginTop: '2px'
                    }}
                  >
                    {loadingSuggestions && (
                      <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                        Loading...
                      </div>
                    )}
                    {!loadingSuggestions && symbolSuggestions.map((item) => (
                      <div
                        key={item.symbol}
                        onMouseDown={() => {
                          setBotFormSymbol(item.symbol);
                          setShowSuggestions(false);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.85rem'
                        }}
                        className="suggestion-item"
                      >
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.symbol}</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* System Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>System Settings</h2>
            <form onSubmit={(e) => { saveSettings(e); setShowSettingsModal(false); }}>
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

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowSettingsModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={updatingSettings} className="btn-save">
                  {updatingSettings ? 'Updating...' : 'Apply Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isSessionEditMode ? 'Edit Allocation Session' : 'Create New Allocation Session'}</h2>
            <form onSubmit={handleSaveSession}>
              <div className="form-group">
                <label>Session Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India Options"
                  value={sessionFormName}
                  onChange={(e) => setSessionFormName(e.target.value)}
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
                <label>Allocated Capital</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={sessionFormCapital}
                  onChange={(e) => setSessionFormCapital(parseFloat(e.target.value) || 0)}
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
                <label>Max Drawdown Limit (%)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={sessionFormMaxDrawdown}
                  onChange={(e) => setSessionFormMaxDrawdown(parseFloat(e.target.value) || 0)}
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
                <label>Execution Provider</label>
                <select
                  value={sessionFormProvider}
                  onChange={(e) => setSessionFormProvider(e.target.value)}
                >
                  <option value="paper">Paper Trading (In-Memory)</option>
                  <option value="zerodha">Zerodha / KiteConnect</option>
                  <option value="tradier">Tradier Brokerage</option>
                </select>
              </div>

              <div className="form-group">
                <label>Enabled Market</label>
                <select
                  value={sessionFormMarkets[0] || 'india'}
                  onChange={(e) => setSessionFormMarkets([e.target.value])}
                >
                  <option value="india">India (NSE/BSE)</option>
                  <option value="us">US (NYSE/NASDAQ)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowSessionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {isSessionEditMode ? 'Save Changes' : 'Create Session'}
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
