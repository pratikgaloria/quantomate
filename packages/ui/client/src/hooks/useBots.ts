import { useState } from 'react';
import axios from 'axios';

export function useBots(showNotification: any, fetchSessions: any) {
  const [bots, setBots] = useState<any[]>([]);
  const [showBotModal, setShowBotModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBotId, setEditingBotId] = useState<string | null>(null);

  const fetchBots = async () => {
    try {
      const res = await axios.get('/api/trade/bots');
      if (res.data.success) setBots(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bots:', err);
    }
  };

  const handleSaveBot = async (payload: any) => {
    try {
      if (isEditMode && editingBotId) {
        await axios.put(`/api/trade/bots/${editingBotId}`, payload);
        showNotification('Bot updated successfully.');
      } else {
        await axios.post('/api/trade/bots', payload);
        showNotification('Bot created successfully.');
      }
      fetchBots();
      fetchSessions();
      setShowBotModal(false);
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to save bot.', 'error');
    }
  };

  const handleDeleteBot = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete bot "${name}"?`)) return;
    try {
      await axios.delete(`/api/trade/bots/${id}`);
      fetchBots();
      showNotification('Bot deleted successfully.');
    } catch (err: any) {
      showNotification('Failed to delete bot.', 'error');
    }
  };

  const toggleBot = async (id: string, currentlyActive: boolean) => {
    try {
      const res = await axios.post('/api/trade/bots/toggle', { id, active: !currentlyActive });
      if (res.data.success) {
        showNotification(`Bot ${currentlyActive ? 'stopped' : 'started'} successfully.`);
        fetchBots();
      }
    } catch (err: any) {
      showNotification('Failed to toggle bot status.', 'error');
    }
  };

  return {
    bots,
    showBotModal,
    setShowBotModal,
    isEditMode,
    setIsEditMode,
    editingBotId,
    setEditingBotId,
    fetchBots,
    handleSaveBot,
    handleDeleteBot,
    toggleBot,
  };
}
