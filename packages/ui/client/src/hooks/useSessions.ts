import { useState } from 'react';
import axios from 'axios';

export function useSessions(showNotification: any) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isSessionEditMode, setIsSessionEditMode] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/trade/sessions');
      if (res.data.success) setSessions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const handleSaveSession = async (payload: any) => {
    try {
      if (isSessionEditMode && editingSessionId) {
        await axios.put(`/api/trade/sessions/${editingSessionId}`, payload);
      } else {
        await axios.post('/api/trade/sessions', payload);
      }
      fetchSessions();
      setShowSessionModal(false);
      showNotification('Session saved successfully.');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to save session.', 'error');
    }
  };

  const handleDeleteSession = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete session "${name}"?`)) return;
    try {
      await axios.delete(`/api/trade/sessions/${id}`);
      fetchSessions();
      showNotification('Session deleted successfully.');
    } catch (err) {
      showNotification('Failed to delete session.', 'error');
    }
  };

  return {
    sessions,
    showSessionModal,
    setShowSessionModal,
    isSessionEditMode,
    setIsSessionEditMode,
    editingSessionId,
    setEditingSessionId,
    fetchSessions,
    handleSaveSession,
    handleDeleteSession,
  };
}
