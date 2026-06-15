import { useState, useEffect } from 'react';
import axios from 'axios';
import { StrategyMetadata, BacktestRequest, BacktestResponse } from '../types';
import { PriceChart } from '../components/Charts/PriceChart';
import { EquityCurve } from '../components/Charts/EquityCurve';
import { DrawdownChart } from '../components/Charts/DrawdownChart';
import { TradeList } from '../components/TradeList';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { usePageContext } from '../context/PageContext';

export function BacktestPage() {
  const { setPageTitle, setToolbar } = usePageContext();
  const [strategies, setStrategies] = useState<StrategyMetadata[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [symbol, setSymbol] = useState('NVDA');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2025-01-01');
  const [interval, setInterval] = useState('1d');
  const [capital, setCapital] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodRange, setPeriodRange] = useState<string>('custom');

  // Register page title
  useEffect(() => {
    setPageTitle('Backtest');
    return () => setToolbar(null);
  }, [setPageTitle, setToolbar]);

  // Load strategies on mount
  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const response = await axios.get('/api/strategies');
      const loadedStrategies = response.data.strategies;
      setStrategies(loadedStrategies);

      // Pre-select Strong Pullback if available
      const strongPullback = loadedStrategies.find((s: any) => s.id === 'strong-pullback');
      if (strongPullback) {
        setSelectedStrategy('strong-pullback');
        const defaultParams: Record<string, any> = {};
        strongPullback.parameters.forEach((param: any) => {
          defaultParams[param.name] = param.default;
        });
        setParameters(defaultParams);
      }
    } catch (err: any) {
      setError('Failed to load strategies: ' + err.message);
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

  const handlePeriodRangeChange = (range: string) => {
    setPeriodRange(range);
    if (range === 'custom') return;

    const end = new Date();
    const start = new Date();

    const getFormattedDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    if (range === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setStartDate(getFormattedDate(yesterday));
      setEndDate(getFormattedDate(yesterday));
    } else if (range === '1w') {
      start.setDate(end.getDate() - 7);
      setStartDate(getFormattedDate(start));
      setEndDate(getFormattedDate(end));
    } else if (range === '1m') {
      start.setMonth(end.getMonth() - 1);
      setStartDate(getFormattedDate(start));
      setEndDate(getFormattedDate(end));
    } else if (range === '6m') {
      start.setMonth(end.getMonth() - 6);
      setStartDate(getFormattedDate(start));
      setEndDate(getFormattedDate(end));
    } else if (range === '1y') {
      start.setFullYear(end.getFullYear() - 1);
      setStartDate(getFormattedDate(start));
      setEndDate(getFormattedDate(end));
    } else if (range === '3y') {
      start.setFullYear(end.getFullYear() - 3);
      setStartDate(getFormattedDate(start));
      setEndDate(getFormattedDate(end));
    } else if (range === '5y') {
      start.setFullYear(end.getFullYear() - 5);
      setStartDate(getFormattedDate(start));
      setEndDate(getFormattedDate(end));
    }
  };

  const runBacktest = async () => {
    if (!selectedStrategy) {
      setError('Please select a strategy');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: BacktestRequest = {
        strategyId: selectedStrategy,
        parameters,
        stock: {
          symbol,
          startDate,
          endDate,
          interval,
        },
        config: {
          capital,
        },
      };

      const response = await axios.post<BacktestResponse>('/api/backtest', request);
      setResult(response.data);
    } catch (err: any) {
      setError('Backtest failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const selectedStrategyMeta = strategies.find(s => s.id === selectedStrategy);

  // Push toolbar to app header area
  useEffect(() => {
    setToolbar(
      <>
        <span className="tb-label">Strategy</span>
        <select
          className="tb-select"
          value={selectedStrategy}
          onChange={(e) => handleStrategyChange(e.target.value)}
        >
          <option value="">Select...</option>
          {strategies.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <span className="tb-divider" />

        <span className="tb-label">Symbol</span>
        <input
          className="tb-input"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="AAPL"
          style={{ width: 72 }}
        />

        <span className="tb-divider" />

        <span className="tb-label">Period</span>
        <select
          className="tb-select"
          value={periodRange}
          onChange={(e) => handlePeriodRangeChange(e.target.value)}
          style={{ minWidth: 110 }}
        >
          <option value="custom">Custom</option>
          <option value="yesterday">Yesterday</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
        </select>

        <span className="tb-label">Interval</span>
        <select
          className="tb-select"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          style={{ minWidth: 90 }}
        >
          <option value="1d">Daily</option>
          <option value="1h">1 Hour</option>
          <option value="15m">15 Min</option>
          <option value="5m">5 Min</option>
          <option value="1m">1 Min</option>
        </select>

        <span className="tb-divider" />

        <button
          className="tb-btn"
          onClick={runBacktest}
          disabled={loading || !selectedStrategy}
        >
          {loading ? 'Running...' : 'Run Backtest'}
        </button>
      </>
    );
  }, [strategies, selectedStrategy, symbol, periodRange, interval, loading, setToolbar]);

  return (
    <div className="backtest-page">
      <div className="controls-panel">
        {/* Strategy description + params adjuster */}
        {selectedStrategyMeta && (
          <div className="form-group">
            <p className="description" style={{ marginTop: 0 }}>{selectedStrategyMeta.description}</p>
            {selectedStrategyMeta.parameters.length > 0 && (
              <button
                type="button"
                className="adjust-params-button"
                onClick={() => setIsModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Adjust Parameters
              </button>
            )}
          </div>
        )}

        {/* Date range configuration */}
        <CollapsibleSection title="Date Range" className="stock-section">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPeriodRange('custom');
              }}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPeriodRange('custom');
              }}
            />
          </div>
          <div className="form-group">
            <label>Initial Capital ($)</label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              min={100}
            />
          </div>
        </CollapsibleSection>

        {error && <div className="error-message">{error}</div>}
      </div>


      <div className="results-panel">
        <h2>Results</h2>
        {result ? (
          <div className="results-content">
            {result.report.numberOfTrades === 0 && (
              <div className="zero-trades-tip">
                <span className="tip-icon">💡</span>
                <div className="tip-message">
                  <strong>No trades executed:</strong> This is normal if the strategy's entry criteria (e.g. RSI going below the oversold threshold or fast/slow SMAs crossing) were not met during the selected time period. Try adjusting the strategy parameters or changing the date range.
                </div>
              </div>
            )}
            {/* Metrics */}
            <CollapsibleSection title="Performance Metrics" className="metrics-section">
              <div className="metrics-rows-container">
                {/* First row: Returns, Final Capital, Initial Capital, Other Costs */}
                <div className="metrics-row row-4">
                  <div className="metric">
                    <span className="metric-label">Returns</span>
                    <span className={`metric-value ${result.report.returns >= 0 ? 'positive' : 'negative'}`}>
                      ${result.report.returns.toFixed(2)} ({result.report.returnsPercentage.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Final Capital</span>
                    <span className="metric-value">${result.report.finalCapital.toFixed(2)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Initial Capital</span>
                    <span className="metric-value">${result.report.initialCapital.toFixed(2)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Other Costs</span>
                    <span className="metric-value" style={{ fontSize: '0.9rem' }}>
                      Comm: ${result.report.totalCommissions.toFixed(2)} / Slip: ${result.report.totalSlippage.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Second row: Number of Trades, Winning Trades, Losing Trades, Win Rate */}
                <div className="metrics-row row-4">
                  <div className="metric">
                    <span className="metric-label">Number of Trades</span>
                    <span className="metric-value">{result.report.numberOfTrades}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Winning Trades</span>
                    <span className="metric-value">
                      {result.report.numberOfWinningTrades} (${result.report.profit.toFixed(2)})
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Losing Trades</span>
                    <span className="metric-value">
                      {result.report.numberOfLosingTrades} (${result.report.loss.toFixed(2)})
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Win Rate</span>
                    <span className="metric-value">
                      {isNaN(result.report.winningRate) ? '0.00' : (result.report.winningRate * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Third row: Stop-Loss Exits, Take-Profit Exits, Strategy Exits */}
                <div className="metrics-row row-3">
                  <div className="metric">
                    <span className="metric-label">Stop-Loss Exits</span>
                    <span className="metric-value">{result.report.stopLossExits}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Take-Profit Exits</span>
                    <span className="metric-value">{result.report.takeProfitExits}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Strategy Exits</span>
                    <span className="metric-value">{result.report.strategyExits}</span>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Charts */}
            <CollapsibleSection title="Charts" className="charts-section">
              <PriceChart
                data={result.chartData.prices}
                trades={result.chartData.trades}
              />
              <div className="chart-wrapper">
                <EquityCurve
                  data={result.chartData.equity}
                  initialCapital={result.report.initialCapital}
                />
              </div>
              <div className="chart-wrapper">
                <DrawdownChart
                  equityData={result.chartData.equity}
                />
              </div>
            </CollapsibleSection>

            {/* Trade List */}
            <TradeList trades={result.report.trades} />
          </div>
        ) : (
          <div className="empty-state">
            <p>Configure and run a backtest to see results</p>
          </div>
        )}
      </div>

      {/* Parameters Modal */}
      {isModalOpen && selectedStrategyMeta && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedStrategyMeta.name} Parameters</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedStrategyMeta.parameters.map(param => (
                <div key={param.name} className="form-group">
                  <label>{param.description}</label>
                  {param.type === 'number' && (
                    <input
                      type="number"
                      value={parameters[param.name] ?? param.default}
                      min={param.min}
                      max={param.max}
                      onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                    />
                  )}
                  {param.type === 'string' && (
                    <input
                      type="text"
                      value={parameters[param.name] ?? param.default ?? ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      placeholder={String(param.default ?? '')}
                    />
                  )}
                  {param.type === 'boolean' && (
                    <select
                      value={String(parameters[param.name] ?? param.default)}
                      onChange={(e) => handleParameterChange(param.name, e.target.value === 'true')}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  )}
                  {param.type === 'select' && (
                    <select
                      value={parameters[param.name] ?? param.default}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    >
                      {param.options?.map(opt => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={() => setIsModalOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
