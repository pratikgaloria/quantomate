import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { usePageContext } from '../../context/PageContext';

export interface IndicatorParam {
  name: string;
  label: string;
  type: 'number' | 'select';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface IndicatorSchema {
  type: string;
  name: string;
  description: string;
  params: IndicatorParam[];
}

export interface ActiveIndicator {
  id: string;
  type: string;
  name: string;
  params: Record<string, any>;
  visible: boolean;
}

export const INDICATORS_SCHEMA: IndicatorSchema[] = [
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

/** Overlay indicators render on the main price chart plot */
export const OVERLAY_TYPES = ['SMA', 'EMA', 'WMA', 'DEMA', 'TEMA', 'VWAP', 'AVWAP', 'BB'];
/** Separate-pane indicators render in their own sub-plots */
export const SEPARATE_TYPES = ['RSI', 'MACD', 'Stochastic', 'ATR', 'CCI', 'ROC', 'MOM', 'WilliamsR', 'RVOL', 'Slope', 'PivotTrend'];

function buildIndicatorLabel(type: string, params: Record<string, any>): string {
  const labelVal = params.period ?? params.signalPeriod ?? params.kPeriod ?? '';
  return `${type} (${labelVal})`;
}

export function useIndicators() {
  const { setPageTitle, setToolbar } = usePageContext();

  // Market / Symbol / Period / Interval
  const [market, setMarket] = useState<'us' | 'india'>('us');
  const [symbol, setSymbol] = useState('AAPL');
  const [symbolQuery, setSymbolQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [period, setPeriod] = useState('1y');
  const [interval, setIntervalState] = useState('1d');

  // Quote data
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active indicators with visibility
  const [activeIndicators, setActiveIndicators] = useState<ActiveIndicator[]>([
    { id: 'ema_14', type: 'EMA', name: 'EMA (14)', params: { period: 14, attribute: 'close' }, visible: true },
    { id: 'rsi_14', type: 'RSI', name: 'RSI (14)', params: { period: 14, attribute: 'close' }, visible: true }
  ]);
  const [indicatorData, setIndicatorData] = useState<Record<string, number[]>>({});

  // Modal states
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsTarget, setSettingsTarget] = useState<string | null>(null);

  const searchTimeout = useRef<any>(null);

  // Register page title
  useEffect(() => {
    setPageTitle('Indicators');
    return () => setToolbar(null);
  }, [setPageTitle, setToolbar]);

  // Fetch quotes and calculate indicators
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/trade/historical-prices', {
        params: { symbol, period, interval }
      });
      if (res.data.success) {
        const newQuotes = res.data.data;
        setQuotes(newQuotes);
        if (newQuotes.length > 0 && activeIndicators.length > 0) {
          const calcRes = await axios.post('/api/trade/calculate-indicators', {
            quotes: newQuotes,
            indicators: activeIndicators
          });
          if (calcRes.data.success) {
            setIndicatorData(calcRes.data.data.indicators);
          }
        } else {
          setIndicatorData({});
        }
      } else {
        setError(res.data.message || 'Failed to fetch historical quotes.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch quotes.');
    } finally {
      setLoading(false);
    }
  }, [symbol, period, interval, activeIndicators]);

  // Initial load on mount
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Period change handler
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    if (newPeriod === '1d') {
      if (interval === '1d') {
        setIntervalState('15m');
      }
    } else if (newPeriod !== '1w') {
      setIntervalState('1d');
    }
  };

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
      name: buildIndicatorLabel(schema.type, defaultParams),
      params: defaultParams,
      visible: true
    };

    setActiveIndicators(prev => [...prev, newInd]);
  };

  // Remove indicator
  const removeIndicator = (id: string) => {
    setActiveIndicators(prev => prev.filter(ind => ind.id !== id));
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    setActiveIndicators(prev =>
      prev.map(ind => ind.id === id ? { ...ind, visible: !ind.visible } : ind)
    );
  };

  // Handle parameter input changes
  const handleParamChange = (indId: string, paramName: string, value: any) => {
    setActiveIndicators(prev => prev.map(ind => {
      if (ind.id === indId) {
        const updatedParams = { ...ind.params, [paramName]: value };
        return {
          ...ind,
          name: buildIndicatorLabel(ind.type, updatedParams),
          params: updatedParams
        };
      }
      return ind;
    }));
  };

  // Open settings modal for a specific indicator
  const openSettings = (id: string) => {
    setSettingsTarget(id);
  };

  const closeSettings = () => {
    setSettingsTarget(null);
  };

  const settingsIndicator = settingsTarget
    ? activeIndicators.find(ind => ind.id === settingsTarget) ?? null
    : null;

  return {
    // Market / Symbol
    market,
    symbol,
    symbolQuery,
    searchResults,
    handleMarketChange,
    handleSymbolSearch,
    handleSelectSymbol,

    // Period / Interval
    period,
    interval,
    handlePeriodChange,
    setInterval: setIntervalState,

    // Data
    quotes,
    loading,
    error,
    handleRefresh,

    // Indicators
    activeIndicators,
    indicatorData,
    addIndicator,
    removeIndicator,
    toggleVisibility,
    handleParamChange,

    // Library modal
    libraryOpen,
    setLibraryOpen,

    // Settings modal
    settingsTarget,
    settingsIndicator,
    openSettings,
    closeSettings,

    // Page context
    setToolbar,
  };
}

export type IndicatorsState = ReturnType<typeof useIndicators>;
