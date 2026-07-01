import { useState } from 'react';
import axios from 'axios';

export function usePositionsOrders(showNotification: any) {
  const [positions, setPositions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, number | null>>({});

  const fetchPositions = async () => {
    try {
      const res = await axios.get('/api/trade/positions');
      if (res.data.success) setPositions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/trade/orders');
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await axios.get('/api/trade/prices');
      if (res.data.success) setPrices(res.data.data);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    }
  };

  const exitPosition = async (symbol: string) => {
    if (!window.confirm(`Are you sure you want to market exit position for ${symbol}?`)) return;
    try {
      const res = await axios.post('/api/trade/positions/exit', { symbol });
      if (res.data.success) {
        showNotification(`Exit order placed for ${symbol}.`);
        fetchPositions();
        fetchOrders();
      } else {
        showNotification(res.data.message || 'Exit failed.', 'error');
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to place exit order.', 'error');
    }
  };

  return {
    positions,
    orders,
    prices,
    setPrices,
    fetchPositions,
    fetchOrders,
    fetchPrices,
    exitPosition,
  };
}
