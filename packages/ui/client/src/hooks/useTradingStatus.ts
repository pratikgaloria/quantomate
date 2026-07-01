import { useState } from 'react';
import axios from 'axios';

export function useTradingStatus(showNotification: any, refreshAll: () => void) {
  const [status, setStatus] = useState<any>({
    zerodha: { authenticated: false, authenticatedAt: null },
    tradier: { authenticated: false },
    engine: { running: false, activeBots: 0 },
    account: null,
  });
  const [settings, setSettings] = useState<any>({
    tradingMode: 'paper',
    enabledMarkets: ['india'],
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/api/trade/status');
      if (res.data.success) setStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/trade/settings');
      if (res.data.success) setSettings(res.data.data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const saveSettings = async (payload: any) => {
    setUpdatingSettings(true);
    try {
      const res = await axios.post('/api/trade/settings', payload);
      if (res.data.success) {
        showNotification('Settings saved successfully. Daemon notified.');
        fetchStatus();
        fetchSettings();
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to save settings.', 'error');
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleResetControlCenter = async () => {
    if (!window.confirm("WARNING: Resetting the control center will permanently delete all strategy bots, active sessions, database orders, positions, and restore broker balances. Are you sure you want to proceed?")) return;
    try {
      showNotification("Resetting trading control center...", "success");
      const res = await axios.post('/api/trade/reset');
      if (res.data.success) {
        showNotification("Trading control center reset completed successfully.", "success");
        refreshAll();
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || "Failed to reset.", "error");
    }
  };

  return {
    status,
    settings,
    setSettings,
    showSettingsModal,
    setShowSettingsModal,
    updatingSettings,
    fetchStatus,
    fetchSettings,
    saveSettings,
    handleResetControlCenter,
  };
}
