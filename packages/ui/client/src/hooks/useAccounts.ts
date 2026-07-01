import { useState } from 'react';
import axios from 'axios';

export function useAccounts(showNotification: any) {
  const [accounts, setAccounts] = useState<any[]>([]);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('/api/trade/sessions');
      if (res.data.success) setAccounts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  const updateAccountCapital = async (id: string, capital: number) => {
    try {
      await axios.put(`/api/trade/sessions/${id}`, { capital });
      fetchAccounts();
      showNotification('Account capital updated successfully.');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to update account.', 'error');
    }
  };

  return {
    accounts,
    fetchAccounts,
    updateAccountCapital,
  };
}
