import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StrategyMetadata, ScanResponse, ScanResult } from '../types';
import { CollapsibleSection } from '../components/CollapsibleSection';

export function ScreenerPage() {
  const [strategies, setStrategies] = useState<StrategyMetadata[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const runScan = async () => {
    if (!selectedStrategy) {
      setError('Please select a strategy');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post<ScanResponse>('/api/scan', {
        strategyId: selectedStrategy,
        parameters,
      });
      setResults(response.data);
    } catch (err: any) {
      setError('Scan failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const selectedStrategyMeta = strategies.find(s => s.id === selectedStrategy);

  return (
    <div className="screener-page">
      <div className="controls-panel">
        <h2>Stock Scanner</h2>
        <p className="subtitle">Scan for recent buy signals across your watchlists</p>

        <div className="form-group strategy-selector">
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

        {selectedStrategyMeta && selectedStrategyMeta.parameters.length > 0 && (
          <CollapsibleSection title="Parameters" className="parameters-section">
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
          </CollapsibleSection>
        )}

        <button
          className="run-button"
          onClick={runScan}
          disabled={loading || !selectedStrategy}
        >
          {loading ? 'Scanning...' : 'Run Scan'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="results-panel">
        <h2>Scan Results</h2>
        {results ? (
          <div className="results-content">
            {results.length > 0 ? (
              <table className="scanner-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Signal</th>
                    <th>Date</th>
                    <th>Age</th>
                    <th>Entry Price</th>
                    <th>Current Price</th>
                    <th>Move (%)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result: ScanResult) => (
                    <tr key={result.symbol} className={result.hasSignal ? 'signal-row' : ''}>
                      <td className="symbol-cell">{result.symbol}</td>
                      <td>
                        {result.hasSignal ? (
                          result.direction === 'short' ? (
                            <span className="badge sell">SELL SHORT</span>
                          ) : (
                            <span className="badge buy">BUY LONG</span>
                          )
                        ) : (
                          <span className="badge neutral">NO SIGNAL</span>
                        )}
                      </td>
                      <td>{result.signalDate ? new Date(result.signalDate).toLocaleDateString() : '-'}</td>
                      <td>{result.hasSignal ? `${result.barsSinceSignal} bars ago` : '-'}</td>
                      <td>{result.entryPrice ? `$${result.entryPrice.toFixed(2)}` : '-'}</td>
                      <td>{result.currentPrice ? `$${result.currentPrice.toFixed(2)}` : '-'}</td>
                      <td className={result.movePercentage && result.movePercentage >= 0 ? 'positive' : 'negative'}>
                        {result.movePercentage ? `${result.movePercentage.toFixed(2)}%` : '-'}
                      </td>
                      <td>
                        <button
                          className="view-backtest-btn"
                          onClick={() => navigate(`/backtest?symbol=${result.symbol}&strategy=${selectedStrategy}`)}
                        >
                          View Backtest
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No symbols found to scan.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>{loading ? 'Scanning stocks, please wait...' : 'Select a strategy and run the scan'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
