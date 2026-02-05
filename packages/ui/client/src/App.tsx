import { useState, useEffect } from 'react';
import axios from 'axios';
import { StrategyMetadata, BacktestRequest, BacktestResponse } from './types';
import { PriceChart } from './components/Charts/PriceChart';
import { EquityCurve } from './components/Charts/EquityCurve';
import { DrawdownChart } from './components/Charts/DrawdownChart';
import { TradeList } from './components/TradeList';
import './styles/App.scss';

function App() {
  const [strategies, setStrategies] = useState<StrategyMetadata[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [symbol, setSymbol] = useState('AAPL');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [interval, setInterval] = useState('1d');
  const [capital, setCapital] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervals = [
    { label: '1 Minute', value: '1m' },
    { label: '2 Minutes', value: '2m' },
    { label: '5 Minutes', value: '5m' },
    { label: '15 Minutes', value: '15m' },
    { label: '30 Minutes', value: '30m' },
    { label: '60 Minutes', value: '60m' },
    { label: '90 Minutes', value: '90m' },
    { label: '1 Hour', value: '1h' },
    { label: '1 Day', value: '1d' },
    { label: '5 Days', value: '5d' },
    { label: '1 Week', value: '1wk' },
    { label: '1 Month', value: '1mo' },
    { label: '3 Months', value: '3mo' },
  ];

  // Load strategies on mount
  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const response = await axios.get('/api/strategies');
      setStrategies(response.data.strategies);
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Quantomate - Backtest Visualization</h1>
      </header>

      <div className="app-content">
        <div className="controls-panel">
          <h2>Configuration</h2>

          {/* Strategy Selector */}
          <div className="form-group">
            <label>Strategy</label>
            <select
              value={selectedStrategy}
              onChange={(e) => handleStrategyChange(e.target.value)}
            >
              <option value="">Select a strategy...</option>
              {strategies.map(strategy => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </select>
            {selectedStrategyMeta && (
              <p className="description">{selectedStrategyMeta.description}</p>
            )}
          </div>

          {/* Parameters */}
          {selectedStrategyMeta && selectedStrategyMeta.parameters.length > 0 && (
            <div className="parameters-section">
              <h3>Parameters</h3>
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
          )}

          {/* Stock Configuration */}
          <div className="stock-section">
            <h3>Stock & Period</h3>
            <div className="form-group">
              <label>Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Data Interval</label>
              <select 
                value={interval} 
                onChange={(e) => setInterval(e.target.value)}
              >
                {intervals.map(int => (
                  <option key={int.value} value={int.value}>
                    {int.label}
                  </option>
                ))}
              </select>
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
          </div>

          <button
            className="run-button"
            onClick={runBacktest}
            disabled={loading || !selectedStrategy}
          >
            {loading ? 'Running...' : 'Run Backtest'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="results-panel">
          <h2>Results</h2>
          {result ? (
            <div className="results-content">
              {/* Metrics */}
              <div className="metrics-grid">
                <div className="metric">
                  <span className="metric-label">Initial Capital</span>
                  <span className="metric-value">${result.report.initialCapital.toFixed(2)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Final Capital</span>
                  <span className="metric-value">${result.report.finalCapital.toFixed(2)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Returns</span>
                  <span className={`metric-value ${result.report.returns >= 0 ? 'positive' : 'negative'}`}>
                    ${result.report.returns.toFixed(2)} ({result.report.returnsPercentage.toFixed(2)}%)
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Number of Trades</span>
                  <span className="metric-value">{result.report.numberOfTrades}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Win Rate</span>
                  <span className="metric-value">{(result.report.winningRate * 100).toFixed(2)}%</span>
                </div>
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

              {/* Trade List */}
              <TradeList trades={result.report.trades} />

              {/* Charts */}
              <div className="charts-section">
                <PriceChart 
                  data={result.chartData.prices} 
                  trades={result.chartData.trades}
                />
                <EquityCurve 
                  data={result.chartData.equity}
                  initialCapital={result.report.initialCapital}
                />
                <DrawdownChart 
                  equityData={result.chartData.equity}
                />
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Configure and run a backtest to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
