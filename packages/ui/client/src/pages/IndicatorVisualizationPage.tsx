import { FC, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { IndicatorChart } from '../components/Charts/IndicatorChart';
import './IndicatorVisualizationPage.scss';
import { usePageContext } from '../context/PageContext';

interface IndicatorSchema {
  type: string;
  name: string;
  description: string;
  params: Array<{
    name: string;
    label: string;
    type: 'number' | 'select';
    default: any;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  }>;
}

const INDICATORS_SCHEMA: IndicatorSchema[] = [
  {
    type: 'SMA',
    name: 'Simple Moving Average',
    description: 'Calculates simple moving average of an attribute.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 200 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'EMA',
    name: 'Exponential Moving Average',
    description: 'Calculates exponential moving average.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 200 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'WMA',
    name: 'Weighted Moving Average',
    description: 'Weighted moving average.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 200 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'DEMA',
    name: 'Double Exponential Moving Average',
    description: 'Double EMA.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 200 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'TEMA',
    name: 'Triple Exponential Moving Average',
    description: 'Triple EMA.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 200 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'RSI',
    name: 'Relative Strength Index',
    description: 'RSI oscillator.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 100 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'MACD',
    name: 'MACD',
    description: 'Moving Average Convergence Divergence.',
    params: [
      { name: 'signalPeriod', label: 'Signal Period', type: 'number', default: 9, min: 1, max: 50 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'BB',
    name: 'Bollinger Bands',
    description: 'Upper, Middle, and Lower volatility bands.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 },
      { name: 'multiplier', label: 'StdDev Mult', type: 'number', default: 2, min: 0.1, max: 10, step: 0.1 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'Stochastic',
    name: 'Stochastic Oscillator',
    description: 'K and D oscillator lines.',
    params: [
      { name: 'kPeriod', label: '%K Period', type: 'number', default: 14, min: 1, max: 100 },
      { name: 'dPeriod', label: '%D Period', type: 'number', default: 3, min: 1, max: 50 },
      { name: 'close', label: 'Close Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] },
      { name: 'high', label: 'High Source', type: 'select', default: 'high', options: ['high'] },
      { name: 'low', label: 'Low Source', type: 'select', default: 'low', options: ['low'] }
    ]
  },
  {
    type: 'ATR',
    name: 'Average True Range',
    description: 'Average True Range volatility indicator.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 100 },
      { name: 'close', label: 'Close Source', type: 'select', default: 'close', options: ['close'] },
      { name: 'high', label: 'High Source', type: 'select', default: 'high', options: ['high'] },
      { name: 'low', label: 'Low Source', type: 'select', default: 'low', options: ['low'] }
    ]
  },
  {
    type: 'CCI',
    name: 'Commodity Channel Index',
    description: 'CCI oscillator.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 },
      { name: 'close', label: 'Close Source', type: 'select', default: 'close', options: ['close'] },
      { name: 'high', label: 'High Source', type: 'select', default: 'high', options: ['high'] },
      { name: 'low', label: 'Low Source', type: 'select', default: 'low', options: ['low'] }
    ]
  },
  {
    type: 'ROC',
    name: 'Rate of Change',
    description: 'Percentage difference compared to N periods ago.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 12, min: 1, max: 100 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'MOM',
    name: 'Momentum',
    description: 'Difference compared to N periods ago.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 10, min: 1, max: 100 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'WilliamsR',
    name: 'Williams %R',
    description: 'Williams percent R oscillator.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 100 },
      { name: 'close', label: 'Close Source', type: 'select', default: 'close', options: ['close'] },
      { name: 'high', label: 'High Source', type: 'select', default: 'high', options: ['high'] },
      { name: 'low', label: 'Low Source', type: 'select', default: 'low', options: ['low'] }
    ]
  },
  {
    type: 'VWAP',
    name: 'VWAP',
    description: 'Volume Weighted Average Price.',
    params: [
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] },
      { name: 'volume', label: 'Volume Source', type: 'select', default: 'volume', options: ['volume'] }
    ]
  },
  {
    type: 'AVWAP',
    name: 'Anchored VWAP',
    description: 'VWAP anchored to a specific bar index.',
    params: [
      { name: 'anchorIndex', label: 'Anchor Index', type: 'number', default: 0, min: 0, max: 5000 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] },
      { name: 'volume', label: 'Volume Source', type: 'select', default: 'volume', options: ['volume'] }
    ]
  },
  {
    type: 'RVOL',
    name: 'Relative Volume',
    description: 'RVOL ratio.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 },
      { name: 'volume', label: 'Volume Source', type: 'select', default: 'volume', options: ['volume'] }
    ]
  },
  {
    type: 'Slope',
    name: 'Slope',
    description: 'Slope over N periods.',
    params: [
      { name: 'period', label: 'Period', type: 'number', default: 1, min: 1, max: 100 },
      { name: 'attribute', label: 'Source', type: 'select', default: 'close', options: ['close', 'open', 'high', 'low', 'hlc3'] }
    ]
  },
  {
    type: 'PivotTrend',
    name: 'Pivot Trend',
    description: 'Trend based on pivot calculations.',
    params: [
      { name: 'close', label: 'Close Source', type: 'select', default: 'close', options: ['close'] },
      { name: 'high', label: 'High Source', type: 'select', default: 'high', options: ['high'] },
      { name: 'low', label: 'Low Source', type: 'select', default: 'low', options: ['low'] }
    ]
  }
];

interface ActiveIndicator {
  id: string;
  type: string;
  name: string;
  params: Record<string, any>;
}

export const IndicatorVisualizationPage: FC = () => {
  const { setPageTitle, setToolbar } = usePageContext();
  const [market, setMarket] = useState<'us' | 'india'>('us');
  const [symbol, setSymbol] = useState('AAPL');
  const [symbolQuery, setSymbolQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [period, setPeriod] = useState('1y');
  const [interval, setInterval] = useState('1d');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register page title
  useEffect(() => {
    setPageTitle('Indicators');
    return () => setToolbar(null);
  }, [setPageTitle, setToolbar]);

  // Active Indicators in workspace
  const [activeIndicators, setActiveIndicators] = useState<ActiveIndicator[]>([
    { id: 'ema_14', type: 'EMA', name: 'EMA (14)', params: { period: 14, attribute: 'close' } },
    { id: 'rsi_14', type: 'RSI', name: 'RSI (14)', params: { period: 14, attribute: 'close' } }
  ]);
  const [indicatorData, setIndicatorData] = useState<Record<string, number[]>>({});

  const searchTimeout = useRef<any>(null);

  // Load quotes
  const loadQuotes = useCallback(async (targetSymbol: string, targetPeriod: string, targetInterval: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/trade/historical-prices', {
        params: { symbol: targetSymbol, period: targetPeriod, interval: targetInterval }
      });
      if (res.data.success) {
        setQuotes(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch historical quotes.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch quotes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate indicators on quotes change or indicators change
  const calculateIndicators = useCallback(async (currentQuotes: any[], indicators: ActiveIndicator[]) => {
    if (currentQuotes.length === 0 || indicators.length === 0) {
      setIndicatorData({});
      return;
    }

    try {
      const res = await axios.post('/api/trade/calculate-indicators', {
        quotes: currentQuotes,
        indicators
      });
      if (res.data.success) {
        setIndicatorData(res.data.data.indicators);
      }
    } catch (err: any) {
      console.error('Failed to calculate indicators:', err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadQuotes(symbol, period, interval);
  }, [symbol, period, interval, loadQuotes]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    if (newPeriod === '1d') {
      if (interval === '1d') {
        setInterval('15m');
      }
    } else if (newPeriod !== '1w') {
      setInterval('1d');
    }
  };

  // Recalculate indicators when quotes or activeIndicators configuration updates
  useEffect(() => {
    calculateIndicators(quotes, activeIndicators);
  }, [quotes, activeIndicators, calculateIndicators]);

  // Autocomplete symbol search
  const handleSymbolSearch = (val: string) => {
    setSymbolQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (val.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await axios.get('/api/trade/search-symbols', {
          params: { market, query: val }
        });
        if (res.data.success) {
          setSearchResults(res.data.data);
        }
      } catch (err: any) {
        console.error('Search error:', err.message);
      }
    }, 300);
  };

  const handleSelectSymbol = (item: any) => {
    setSymbol(item.symbol);
    setSymbolQuery('');
    setSearchResults([]);
  };

  const handleMarketChange = (newMarket: 'us' | 'india') => {
    setMarket(newMarket);
    const defaultSymbol = newMarket === 'india' ? 'NIFTY' : 'AAPL';
    setSymbol(defaultSymbol);
    setSymbolQuery('');
    setSearchResults([]);
  };

  // Add indicator to active list
  const addIndicator = (schema: IndicatorSchema) => {
    const id = `${schema.type.toLowerCase()}_${Date.now()}`;
    const defaultParams: Record<string, any> = {};
    schema.params.forEach(p => {
      defaultParams[p.name] = p.default;
    });

    const newInd: ActiveIndicator = {
      id,
      type: schema.type,
      name: `${schema.type} (${defaultParams.period || defaultParams.signalPeriod || ''})`,
      params: defaultParams
    };

    setActiveIndicators(prev => [...prev, newInd]);
  };

  // Remove indicator
  const removeIndicator = (id: string) => {
    setActiveIndicators(prev => prev.filter(ind => ind.id !== id));
  };

  // Handle parameter input changes
  const handleParamChange = (indId: string, paramName: string, value: any) => {
    setActiveIndicators(prev => prev.map(ind => {
      if (ind.id === indId) {
        const updatedParams = { ...ind.params, [paramName]: value };
        // Update label name dynamically
        const labelVal = updatedParams.period || updatedParams.signalPeriod || '';
        return {
          ...ind,
          name: `${ind.type} (${labelVal})`,
          params: updatedParams
        };
      }
      return ind;
    }));
  };

  // Push toolbar: market, symbol search, period, interval
  useEffect(() => {
    setToolbar(
      <>
        <span className="tb-label">Market</span>
        <button
          className={market === 'us' ? 'tb-btn' : 'tb-btn-outline'}
          onClick={() => handleMarketChange('us')}
          style={{ minWidth: 'auto', padding: '0 0.6rem' }}
        >US</button>
        <button
          className={market === 'india' ? 'tb-btn' : 'tb-btn-outline'}
          onClick={() => handleMarketChange('india')}
          style={{ minWidth: 'auto', padding: '0 0.6rem' }}
        >India</button>

        <span className="tb-divider" />

        <span className="tb-label">Symbol</span>
        <input
          className="tb-input"
          type="text"
          value={symbolQuery || symbol}
          onChange={(e) => handleSymbolSearch(e.target.value)}
          placeholder="Search..."
          style={{ width: 110 }}
        />

        <span className="tb-divider" />

        <span className="tb-label">Period</span>
        <select
          className="tb-select"
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          style={{ minWidth: 90 }}
        >
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
        </select>

        <span className="tb-label">Interval</span>
        <select
          className="tb-select"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          disabled={period !== '1d' && period !== '1w'}
          style={{ minWidth: 90 }}
        >
          {period === '1d' || period === '1w' ? (
            <>
              <option value="1m">1 Min</option>
              <option value="5m">5 Min</option>
              <option value="15m">15 Min</option>
              <option value="1h">1 Hour</option>
              {period === '1w' && <option value="1d">Daily</option>}
            </>
          ) : (
            <option value="1d">Daily</option>
          )}
        </select>

        {loading && <span style={{ fontSize: '0.72rem', color: '#888', marginLeft: 4 }}>Loading...</span>}
      </>
    );
  }, [market, symbol, symbolQuery, period, interval, loading, setToolbar]);

  return (
    <div className="indicator-visualizer-page">
      {/* Left controls and configuration panel */}
      <div className="controls-panel">
        {/* Search results dropdown (from toolbar input) */}
        {searchResults.length > 0 && (
          <div className="autocomplete-results" style={{ position: 'static', marginBottom: '0.75rem', border: '1px solid #eee' }}>
            {searchResults.map((item) => (
              <div
                key={item.symbol}
                className="result-item"
                onClick={() => handleSelectSymbol(item)}
              >
                <span className="symbol-name">{item.symbol}</span>
                <span className="exchange-tag">{item.exchange}</span>
              </div>
            ))}
          </div>
        )}

        {/* Indicators Library */}
        <h3>Indicator Library</h3>
        <div className="library-grid">
          {INDICATORS_SCHEMA.map((schema) => (
            <div
              key={schema.type}
              className="library-item"
              onClick={() => addIndicator(schema)}
              title={schema.description}
            >
              + {schema.type}
            </div>
          ))}
        </div>

        {/* Active Indicators and parameters tweaking forms */}
        <h3>Active Workspace</h3>
        <div className="active-indicators-list">
          {activeIndicators.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: '#8f96a3', textAlign: 'center', padding: '1rem' }}>
              No active indicators. Add some from the library library.
            </div>
          ) : (
            activeIndicators.map((ind) => {
              const schema = INDICATORS_SCHEMA.find(s => s.type === ind.type);
              if (!schema) return null;

              return (
                <div key={ind.id} className="active-ind-card">
                  <div className="card-header">
                    <span className="ind-name">{ind.name}</span>
                    <button className="remove-btn" onClick={() => removeIndicator(ind.id)}>
                      &times;
                    </button>
                  </div>
                  <div className="params-grid">
                    {schema.params.map((p) => (
                      <div key={p.name} className="param-row">
                        <label>{p.label}</label>
                        {p.type === 'number' ? (
                          <input
                            type="number"
                            value={ind.params[p.name] ?? p.default}
                            min={p.min}
                            max={p.max}
                            step={p.step || 1}
                            onChange={(e) => handleParamChange(ind.id, p.name, Number(e.target.value))}
                          />
                        ) : (
                          <select
                            value={ind.params[p.name] ?? p.default}
                            onChange={(e) => handleParamChange(ind.id, p.name, e.target.value)}
                          >
                            {p.options?.map(opt => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Price Chart and Sub-pane plot workspace */}
      <div className="results-panel">
        <div className="chart-header">
          <div className="asset-info">
            <span className="asset-title">{symbol}</span>
            <span className="timeframe-tag">{`${period.toUpperCase()} / ${interval}`}</span>
          </div>
          <div className="chart-actions">
            {loading && <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>}
          </div>
        </div>

        <div className="chart-body">
          {error && <div className="error-message" style={{ margin: '1rem' }}>{error}</div>}
          
          {!loading && quotes.length === 0 && !error && (
            <div className="empty-chart-state">
              <i className="la la-chart-area"></i>
              <p>No quote data loaded. Please search for an asset.</p>
            </div>
          )}

          {quotes.length > 0 && (
            <IndicatorChart
              data={quotes}
              activeIndicators={activeIndicators}
              indicatorData={indicatorData}
            />
          )}

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <span>Loading Historical Data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default IndicatorVisualizationPage;
