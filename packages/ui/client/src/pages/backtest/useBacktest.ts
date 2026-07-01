import { useState, useEffect } from 'react';
import axios from 'axios';
import { StrategyMetadata, BacktestRequest, BacktestResponse } from '../../types';
import { usePageContext } from '../../context/PageContext';

export function useBacktest() {
  const { setPageTitle } = usePageContext();
  const [strategies, setStrategies] = useState<StrategyMetadata[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [symbol, setSymbol] = useState('NVDA');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2025-01-01');
  const [interval, setInterval] = useState('1d');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodRange, setPeriodRange] = useState<string>('1y');

  useEffect(() => {
    setPageTitle('Backtest');
    axios.get('/api/strategies').then(res => {
      const loaded = res.data.strategies;
      setStrategies(loaded);
      const sp = loaded.find((s: any) => s.id === 'strong-pullback');
      if (sp) {
        setSelectedStrategy('strong-pullback');
        const defaultParams: Record<string, any> = {};
        sp.parameters.forEach((param: any) => { defaultParams[param.name] = param.default; });
        setParameters(defaultParams);
      }
    }).catch(err => setError('Failed to load strategies: ' + err.message));
  }, [setPageTitle]);

  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      const defaultParams: Record<string, any> = {};
      strategy.parameters.forEach(p => { defaultParams[p.name] = p.default; });
      setParameters(defaultParams);
    }
  };

  const handleParameterChange = (name: string, value: any) => {
    setParameters(prev => ({ ...prev, [name]: value }));
  };

  const handlePeriodRangeChange = (range: string) => {
    setPeriodRange(range);
    if (range === 'custom') return;
    const end = new Date(), start = new Date();
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (range === 'yesterday') {
      const y = new Date(); y.setDate(y.getDate() - 1);
      setStartDate(fmt(y)); setEndDate(fmt(y));
    } else {
      const diff: Record<string, number> = { '1w': 7, '1m': 30, '6m': 180, '1y': 365, '3y': 1095, '5y': 1825 };
      start.setDate(end.getDate() - (diff[range] || 7));
      setStartDate(fmt(start)); setEndDate(fmt(end));
    }
  };

  const runBacktest = async () => {
    if (!selectedStrategy) { setError('Please select a strategy'); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const req: BacktestRequest = { strategyId: selectedStrategy, parameters, stock: { symbol, startDate, endDate, interval } };
      const response = await axios.post<BacktestResponse>('/api/backtest', req);
      setResult(response.data);
    } catch (err: any) {
      setError('Backtest failed: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const selectedStrategyMeta = strategies.find(s => s.id === selectedStrategy);

  return {
    strategies, selectedStrategy, parameters, symbol, startDate, endDate, interval,
    loading, result, error, isModalOpen, periodRange, setIsModalOpen, setSymbol, setStartDate, setEndDate,
    setPeriodRange, setInterval, handleStrategyChange, handleParameterChange, handlePeriodRangeChange, runBacktest,
    selectedStrategyMeta, setError
  };
}

export type BacktestState = ReturnType<typeof useBacktest>;
