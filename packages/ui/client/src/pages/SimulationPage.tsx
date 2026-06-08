import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { StrategyMetadata } from '../types';
import { CollapsibleSection } from '../components/CollapsibleSection';
import './SimulationPage.scss';

interface SimulationStatus {
  id?: string;
  symbol?: string;
  strategyId?: string;
  parameters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  interval?: string;
  speedMs?: number;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'stopped';
  progress: {
    current: number;
    total: number;
  };
  logs: string[];
  prices: { timestamp: number; price: number }[];
  initialCapital: number;
  accountInfo?: {
    accountId: string;
    cashBalance: number;
    portfolioValue: number;
    marginBuyingPower: number;
    currency: string;
    isPaper: boolean;
  };
  positions?: {
    symbol: string;
    qty: number;
    avgEntryPrice: number;
    marketPrice: number;
    unrealizedPL: number;
    costBasis: number;
  }[];
  orders?: {
    id: string;
    clientOrderId: string;
    status: string;
    filledQty: number;
    avgFillPrice?: number;
    filledAt?: string;
    commissionPaid?: number;
    symbol?: string;
    side?: string;
  }[];
}

export function SimulationPage() {
  const [strategies, setStrategies] = useState<StrategyMetadata[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [symbol, setSymbol] = useState('SBIN');
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-06-05');
  const [interval, setIntervalVal] = useState('1d');
  const [capital, setCapital] = useState(100000);
  const [speedMs, setSpeedMs] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [simState, setSimState] = useState<SimulationStatus>({
    status: 'idle',
    progress: { current: 0, total: 0 },
    logs: [],
    prices: [],
    initialCapital: 100000
  });

  const logsContainerRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load strategies on mount
  useEffect(() => {
    loadStrategies();
    // Fetch initial status
    fetchStatus();
    
    return () => {
      stopPolling();
    };
  }, []);

  // Poll for simulation status if it is running
  useEffect(() => {
    if (simState.status === 'running' || simState.status === 'paused') {
      startPolling();
    } else {
      stopPolling();
    }
  }, [simState.status]);

  // Scroll logs window to bottom
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [simState.logs]);

  const loadStrategies = async () => {
    try {
      const response = await axios.get('/api/strategies');
      const loadedStrategies = response.data.strategies;
      setStrategies(loadedStrategies);

      const rsiStrategy = loadedStrategies.find((s: any) => s.id === 'rsi-mean-reversion');
      if (rsiStrategy) {
        setSelectedStrategy('rsi-mean-reversion');
        const defaultParams: Record<string, any> = {};
        rsiStrategy.parameters.forEach((param: any) => {
          defaultParams[param.name] = param.default;
        });
        setParameters(defaultParams);
      } else if (loadedStrategies.length > 0) {
        setSelectedStrategy(loadedStrategies[0].id);
        const defaultParams: Record<string, any> = {};
        loadedStrategies[0].parameters.forEach((param: any) => {
          defaultParams[param.name] = param.default;
        });
        setParameters(defaultParams);
      }
    } catch (err: any) {
      setError('Failed to load strategies: ' + err.message);
    }
  };

  const startPolling = () => {
    if (pollIntervalRef.current) return;
    pollIntervalRef.current = setInterval(fetchStatus, 400); // Poll status every 400ms
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.get<SimulationStatus>('/api/simulation/status');
      setSimState(response.data);
    } catch (err: any) {
      console.error('Failed to fetch simulation status:', err);
    }
  };

  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      const defaultParams: Record<string, any> = {};
      strategy.parameters.forEach(param => {
        defaultParams[param.name] = param.default;
      });
      setParameters(defaultParams);
    }
  };

  const handleParameterChange = (name: string, value: any) => {
    setParameters(prev => ({ ...prev, [name]: value }));
  };

  const startSimulation = async () => {
    if (!selectedStrategy) {
      setError('Please select a strategy');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/simulation/start', {
        symbol,
        strategyId: selectedStrategy,
        parameters,
        startDate,
        endDate,
        interval,
        speedMs,
        initialCapital: capital,
      });
      
      // Fetch status immediately
      await fetchStatus();
    } catch (err: any) {
      setError('Failed to start simulation: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const pauseSimulation = async () => {
    try {
      await axios.post('/api/simulation/pause');
      await fetchStatus();
    } catch (err: any) {
      setError('Pause failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const resumeSimulation = async () => {
    try {
      await axios.post('/api/simulation/resume');
      await fetchStatus();
    } catch (err: any) {
      setError('Resume failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const stopSimulation = async () => {
    try {
      await axios.post('/api/simulation/stop');
      await fetchStatus();
    } catch (err: any) {
      setError('Stop failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const changeSpeed = async (newSpeedMs: number) => {
    setSpeedMs(newSpeedMs);
    if (simState.status === 'running' || simState.status === 'paused') {
      try {
        await axios.post('/api/simulation/speed', { speedMs: newSpeedMs });
      } catch (err: any) {
        console.error('Failed to change speed:', err);
      }
    }
  };

  const selectedStrategyMeta = strategies.find(s => s.id === selectedStrategy);
  const pnlPercent = simState.accountInfo 
    ? ((simState.accountInfo.portfolioValue - simState.initialCapital) / simState.initialCapital) * 100
    : 0;

  // Render SVG Line Chart
  const renderPriceChart = () => {
    const width = 800;
    const height = 300;
    const paddingX = 0;
    const paddingY = 20;
    const prices = simState.prices || [];
    
    if (prices.length === 0) {
      return (
        <div className="chart-empty-state">
          <i className="la la-chart-line"></i>
          <p>Simulation chart will populate once ticks arrive...</p>
        </div>
      );
    }

    const firstPrice = prices[0].price;
    const minPrice = firstPrice * 0.95;
    const maxPrice = firstPrice * 1.05;


    const totalTicks = Math.max(simState.progress.total || 0, prices.length || 1);
    const scaleX = (index: number) => {
      if (totalTicks <= 1) return paddingX;
      return paddingX + (index / (totalTicks - 1)) * (width - 2 * paddingX);
    };

    const scaleY = (val: number) => {
      if (maxPrice === minPrice) return height / 2;
      return height - paddingY - ((val - minPrice) / (maxPrice - minPrice)) * (height - 2 * paddingY);
    };

    // Construct path coordinates
    const points = prices.map((p, idx) => `${scaleX(idx)},${scaleY(p.price)}`).join(' ');
    
    // Construct area path
    const areaPoints = prices.length > 0 
      ? `${scaleX(0)},${height - paddingY} ${points} ${scaleX(prices.length - 1)},${height - paddingY}`
      : '';

    // Generate price labels for right-hand scale
    const priceRange = maxPrice - minPrice;
    const gridLines = [
      minPrice + priceRange * 0.25,
      minPrice + priceRange * 0.5,
      minPrice + priceRange * 0.75,
    ];

    // Filter trades that occurred during the simulation
    const orders = simState.orders || [];

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="sim-price-svg">
        <defs>
          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((price, idx) => (
          <g key={idx} className="grid-line-group">
            <line 
              x1={paddingX} 
              y1={scaleY(price)} 
              x2={width - paddingX} 
              y2={scaleY(price)} 
              stroke="#e2e8f0" 
              strokeDasharray="4 4"
            />
            <text 
              x={width - paddingX - 5} 
              y={scaleY(price) - 4} 
              fill="#94a3b8" 
              fontSize="9" 
              textAnchor="end"
            >
              {price.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Shaded Area */}
        {areaPoints && <polygon points={areaPoints} fill="url(#chartAreaGrad)" />}

        {/* Line Path */}
        {points && <polyline fill="none" stroke="#4f46e5" strokeWidth="2.5" points={points} />}

        {/* Transaction Markers */}
        {orders.map((order) => {
          if (order.status !== 'filled' || !order.avgFillPrice || !order.filledAt) return null;
          
          const orderTime = new Date(order.filledAt).getTime();
          // Find index of closest price tick to position the marker
          let closestIndex = 0;
          let minDiff = Infinity;
          for (let i = 0; i < prices.length; i++) {
            const diff = Math.abs(prices[i].timestamp - orderTime);
            if (diff < minDiff) {
              minDiff = diff;
              closestIndex = i;
            }
          }

          const x = scaleX(closestIndex);
          const y = scaleY(order.avgFillPrice);
          const isBuy = order.side?.startsWith('buy');

          return (
            <g key={order.id} className="trade-marker-group">
              <circle 
                cx={x} 
                cy={y} 
                r="6" 
                fill={isBuy ? '#10b981' : '#ef4444'} 
                stroke="#ffffff" 
                strokeWidth="1.5" 
              />
              <path 
                d={isBuy 
                  ? `M ${x} ${y - 10} L ${x - 4} ${y - 6} L ${x + 4} ${y - 6} Z`
                  : `M ${x} ${y + 10} L ${x - 4} ${y + 6} L ${x + 4} ${y + 6} Z`
                }
                fill={isBuy ? '#10b981' : '#ef4444'}
              />
              <title>{`${order.side?.toUpperCase()} Qty ${order.filledQty} @ ${order.avgFillPrice.toFixed(2)}`}</title>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="simulation-page">
      {/* Header and status badge */}
      <div className="simulation-header-bar">
        <div>
          <h1>Market Live Simulator</h1>
          <p className="subtitle">Simulate real-time paper trading over historical data periods.</p>
        </div>
        <div className={`status-badge ${simState.status}`}>
          <span className="dot"></span>
          {simState.status.toUpperCase()}
        </div>
      </div>

      <div className="simulation-layout">
        {/* Left column - Config Panel */}
        <div className="controls-panel">
          <h2>Simulation Settings</h2>
          
          <div className="form-group">
            <label>Strategy</label>
            <select
              value={selectedStrategy}
              onChange={(e) => handleStrategyChange(e.target.value)}
              disabled={simState.status === 'running' || simState.status === 'paused'}
            >
              <option value="">Select a strategy...</option>
              {strategies.map(strat => (
                <option key={strat.id} value={strat.id}>{strat.name}</option>
              ))}
            </select>
            {selectedStrategyMeta && (
              <p className="description">{selectedStrategyMeta.description}</p>
            )}
          </div>

          {selectedStrategyMeta && selectedStrategyMeta.parameters.length > 0 && (
            <CollapsibleSection title="Strategy Parameters" className="parameters-section">
              {selectedStrategyMeta.parameters.map(param => (
                <div key={param.name} className="form-group">
                  <label>{param.description}</label>
                  {param.type === 'number' && (
                    <input
                      type="number"
                      value={parameters[param.name] ?? param.default}
                      min={param.min}
                      max={param.max}
                      disabled={simState.status === 'running' || simState.status === 'paused'}
                      onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                    />
                  )}
                  {param.type === 'string' && (
                    <input
                      type="text"
                      value={parameters[param.name] ?? param.default ?? ''}
                      disabled={simState.status === 'running' || simState.status === 'paused'}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    />
                  )}
                  {param.type === 'select' && (
                    <select
                      value={parameters[param.name] ?? param.default}
                      disabled={simState.status === 'running' || simState.status === 'paused'}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    >
                      {param.options?.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </CollapsibleSection>
          )}

          <CollapsibleSection title="Asset & Period" className="stock-section">
            <div className="form-group">
              <label>Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                disabled={simState.status === 'running' || simState.status === 'paused'}
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={simState.status === 'running' || simState.status === 'paused'}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={simState.status === 'running' || simState.status === 'paused'}
              />
            </div>
            <div className="form-group">
              <label>Interval</label>
              <select
                value={interval}
                onChange={(e) => setIntervalVal(e.target.value)}
                disabled={simState.status === 'running' || simState.status === 'paused'}
              >
                <option value="1d">Daily</option>
                <option value="1h">1 Hour</option>
                <option value="15m">15 Minutes</option>
                <option value="5m">5 Minutes</option>
                <option value="1m">1 Minute</option>
              </select>
            </div>
            <div className="form-group">
              <label>Initial Capital (INR)</label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                min={100}
                disabled={simState.status === 'running' || simState.status === 'paused'}
              />
            </div>
          </CollapsibleSection>

          {/* Speed slider */}
          <div className="form-group speed-slider-group">
            <label>Playback Tick Interval: {speedMs}ms</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={speedMs}
              onChange={(e) => changeSpeed(Number(e.target.value))}
            />
            <div className="slider-labels">
              <span>Fastest (0ms)</span>
              <span>1s</span>
            </div>
          </div>

          <div className="simulation-buttons">
            {simState.status === 'idle' || simState.status === 'completed' || simState.status === 'stopped' ? (
              <button 
                className="run-button start"
                onClick={startSimulation}
                disabled={loading || !selectedStrategy}
              >
                {loading ? 'Starting...' : 'Start Simulation'}
              </button>
            ) : (
              <div className="control-btn-group">
                {simState.status === 'running' ? (
                  <button className="run-button pause" onClick={pauseSimulation}>
                    <i className="la la-pause"></i> Pause
                  </button>
                ) : (
                  <button className="run-button resume" onClick={resumeSimulation}>
                    <i className="la la-play"></i> Resume
                  </button>
                )}
                <button className="run-button stop" onClick={stopSimulation}>
                  <i className="la la-stop"></i> Stop
                </button>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Right column - Simulator Area */}
        <div className="results-panel">
          {simState.status === 'idle' ? (
            <div className="empty-state">
              <p>Configure simulation options on the left and click "Start Simulation".</p>
            </div>
          ) : (
            <div className="simulation-workspace">
              {/* Account Metrics Grid */}
              <div className="metrics-grid">
                <div className="metric">
                  <span className="metric-label">Cash Balance</span>
                  <span className="metric-value">
                    INR {simState.accountInfo?.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Portfolio Value</span>
                  <span className="metric-value font-semibold">
                    INR {simState.accountInfo?.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Total Return</span>
                  <span className={`metric-value ${pnlPercent >= 0 ? 'positive' : 'negative'}`}>
                    {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Ticks Processed</span>
                  <span className="metric-value">
                    {simState.progress.current} / {simState.progress.total}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {simState.progress.total > 0 && (
                <div className="sim-progress-bar-wrapper">
                  <div 
                    className="sim-progress-bar-fill" 
                    style={{ width: `${Math.min(100, (simState.progress.current / simState.progress.total) * 100)}%` }}
                  ></div>
                </div>
              )}

              {/* Chart */}
              <div className="sim-chart-card">
                <h3>Live Quote Stream ({simState.symbol})</h3>
                <div className="sim-chart-wrapper">
                  {renderPriceChart()}
                </div>
              </div>

              {/* Positions and orders */}
              <div className="simulation-details-tabs">
                <div className="details-card positions-card">
                  <h3>Open Positions</h3>
                  <div className="table-responsive" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <table className="scanner-table">
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Qty</th>
                          <th>Avg Entry</th>
                          <th>Market Price</th>
                          <th>Unrealized P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simState.positions && simState.positions.length > 0 ? (
                          simState.positions.map((pos) => (
                            <tr key={pos.symbol}>
                              <td className="symbol-cell">{pos.symbol}</td>
                              <td className={pos.qty >= 0 ? 'positive' : 'negative'}>{pos.qty}</td>
                              <td>INR {pos.avgEntryPrice.toFixed(2)}</td>
                              <td>INR {pos.marketPrice.toFixed(2)}</td>
                              <td className={pos.unrealizedPL >= 0 ? 'positive' : 'negative'}>
                                INR {pos.unrealizedPL.toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center text-slate-400 py-4">No active open positions</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="details-card orders-card">
                  <h3>Order Logs</h3>
                  <div className="table-responsive" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <table className="scanner-table">
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Side</th>
                          <th>Qty</th>
                          <th>Filled Price</th>
                          <th>Status</th>
                          <th>Filled At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simState.orders && simState.orders.length > 0 ? (
                          simState.orders.map((ord) => (
                            <tr key={ord.id}>
                              <td className="symbol-cell">{ord.symbol}</td>
                              <td>
                                <span className={`badge ${ord.side?.startsWith('buy') ? 'buy' : 'sell'}`}>
                                  {ord.side?.toUpperCase()}
                                </span>
                              </td>
                              <td>{ord.filledQty}</td>
                              <td>{ord.avgFillPrice ? `INR ${ord.avgFillPrice.toFixed(2)}` : '-'}</td>
                              <td>{ord.status.toUpperCase()}</td>
                              <td className="text-xs text-slate-500">
                                {ord.filledAt ? new Date(ord.filledAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' }) : '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center text-slate-400 py-4">No orders placed yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Logs Window */}
              <div className="sim-logs-card">
                <h3>Simulation Output Logs</h3>
                <div className="sim-logs-terminal" ref={logsContainerRef}>
                  {simState.logs.map((logLine, idx) => (
                    <div key={idx} className="log-line">{logLine}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SimulationPage;
