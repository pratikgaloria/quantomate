import { useState, useEffect } from 'react';
import axios from 'axios';
import { AVAILABLE_STRATEGIES } from './availableStrategies';

export function useStrategies(setPageTitle: any) {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formBaseType, setFormBaseType] = useState<string>('GoldenCross');
  const [formInterval, setFormInterval] = useState('1m');
  const [formParameters, setFormParameters] = useState<Record<string, any>>({});

  useEffect(() => { setPageTitle('Strategies'); }, [setPageTitle]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/strategies/custom');
      if (res.data.success) setStrategies(res.data.data);
    } catch (err) { showNotification('Failed to fetch custom strategies.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStrategies(); }, []);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormName('');
    setFormBaseType('GoldenCross');
    setFormInterval('1m');
    setFormParameters(AVAILABLE_STRATEGIES.GoldenCross.defaultParams);
    setShowModal(true);
  };

  const handleOpenEdit = (strat: any) => {
    setIsEditMode(true);
    setEditingId(strat.id);
    setFormName(strat.name);
    setFormBaseType(strat.baseType in AVAILABLE_STRATEGIES ? strat.baseType : 'GoldenCross');
    setFormInterval(strat.interval);
    setFormParameters(strat.parameters || {});
    setShowModal(true);
  };

  const handleBaseTypeChange = (base: string) => {
    setFormBaseType(base);
    setFormParameters(AVAILABLE_STRATEGIES[base]?.defaultParams || {});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBaseType || !formInterval) {
      showNotification('Please fill in name, base type, and interval.', 'error');
      return;
    }
    const payload = { name: formName, baseType: formBaseType, parameters: formParameters, interval: formInterval };
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
    if (!window.confirm(`WARNING: Deleting custom strategy "${name}" will permanently DELETE all active strategy bots associated with it. Are you sure you want to proceed?`)) return;
    try {
      await axios.delete(`/api/strategies/custom/${id}`);
      showNotification('Strategy deleted successfully.');
      fetchStrategies();
    } catch (err) { showNotification('Failed to delete strategy.', 'error'); }
  };

  return {
    strategies, loading, message, showModal, setShowModal, isEditMode, formName, setFormName,
    formBaseType, formInterval, setFormInterval, formParameters, setFormParameters,
    handleOpenCreate, handleOpenEdit, handleBaseTypeChange, handleSave, handleDelete
  };
}
