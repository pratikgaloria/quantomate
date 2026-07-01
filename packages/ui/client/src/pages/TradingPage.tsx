import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePageContext } from '../context/PageContext';
import { useAccounts } from '../hooks/useAccounts';
import { useBots } from '../hooks/useBots';
import { usePositionsOrders } from '../hooks/usePositionsOrders';
import { useTradingStatus } from '../hooks/useTradingStatus';
import { AccountStatsHeader } from '../components/AccountStatsHeader';
import { BotTabs } from '../components/BotTabs';
import { BotTabContent } from '../components/BotTabContent';
import { BotModal } from '../components/BotModal';
import { SettingsModal } from '../components/SettingsModal';
import './TradingPage.scss';

export function TradingPage() {
  const { setPageTitle, setToolbar } = usePageContext();
  const [notification, setNotification] = useState<{ text: string; type: string } | null>(null);
  const [customStrategies, setCustomStrategies] = useState<any[]>([]);
  const [editingBot, setEditingBot] = useState<any>(null);
  const [activeBotId, setActiveBotId] = useState<string | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const refreshAll = () => {
    fetchStatus();
    fetchSettings();
    fetchAccounts();
    fetchBots();
    fetchPositions();
    fetchOrders();
    fetchPrices();
  };

  const {
    accounts, fetchAccounts, updateAccountCapital
  } = useAccounts(showNotification);

  const {
    bots, showBotModal, setShowBotModal, isEditMode, setIsEditMode, setEditingBotId,
    fetchBots, handleSaveBot, handleDeleteBot, toggleBot
  } = useBots(showNotification, fetchAccounts);

  const {
    positions, orders, prices, fetchPositions, fetchOrders, fetchPrices, exitPosition
  } = usePositionsOrders(showNotification);

  const handleClearBotState = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to clear all previous positions and orders from the database for bot "${name}"?`)) return;
    try {
      await axios.post(`/api/trade/bots/${id}/clear`);
      showNotification('Bot state cleared successfully.');
      fetchPositions();
      fetchOrders();
    } catch (err: any) {
      showNotification('Failed to clear bot state.', 'error');
    }
  };

  const {
    status, settings, showSettingsModal, setShowSettingsModal, updatingSettings,
    fetchStatus, fetchSettings, saveSettings, handleResetControlCenter
  } = useTradingStatus(showNotification, refreshAll);

  // Auto-select first bot when bots change
  useEffect(() => {
    if (bots.length > 0 && (!activeBotId || !bots.find(b => b.id === activeBotId))) {
      setActiveBotId(bots[0].id);
    }
  }, [bots]);

  useEffect(() => {
    setPageTitle('Trading Dashboard');
    setToolbar(
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn-toolbar" onClick={() => setShowSettingsModal(true)}>Settings</button>
        <button className="btn-toolbar btn-danger" onClick={handleResetControlCenter}>Reset All</button>
      </div>
    );
    refreshAll();
    axios.get('/api/strategies/custom').then(res => setCustomStrategies(res.data.data || []));
    const timer = setInterval(() => {
      fetchStatus();
      fetchPositions();
      fetchOrders();
      fetchPrices();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const selectedBot = bots.find(b => b.id === activeBotId);
  const isZerodhaDisconnected = settings?.tradingMode === 'live' && status?.zerodha?.authenticated === false;
  const isTradierDisconnected = settings?.tradingMode === 'live' && status?.tradier?.authenticated === false;

  return (
    <div className="trading-page">
      {notification && <div className={`notification-banner ${notification.type}`}>{notification.text}</div>}

      {/* Disconnected broker warnings */}
      {isZerodhaDisconnected && (
        <div className="broker-warning">
          <span className="broker-warning__icon">⚠</span>
          <span>Zerodha is disconnected. All India bots are paused. Please <a href="/auth/zerodha/login" target="_blank" rel="noopener noreferrer">re-authenticate</a>.</span>
        </div>
      )}
      {isTradierDisconnected && (
        <div className="broker-warning">
          <span className="broker-warning__icon">⚠</span>
          <span>Tradier is disconnected. All US bots are paused. Please check your API key configuration.</span>
        </div>
      )}

      {/* Account Stats Header */}
      <AccountStatsHeader
        accounts={accounts}
        bots={bots}
        orders={orders}
        positions={positions}
        settings={settings}
        onUpdateCapital={updateAccountCapital}
      />

      {/* Bot Tabs */}
      <BotTabs
        bots={bots}
        orders={orders}
        positions={positions}
        activeBotId={activeBotId}
        onSelectBot={setActiveBotId}
        onCreateBot={() => { setIsEditMode(false); setEditingBot(null); setShowBotModal(true); }}
      />

      {/* Bot Tab Content */}
      {selectedBot ? (
        <BotTabContent
          bot={selectedBot}
          orders={orders}
          positions={positions}
          prices={prices}
          onEditBot={b => { setIsEditMode(true); setEditingBotId(b.id); setEditingBot(b); setShowBotModal(true); }}
          onDeleteBot={handleDeleteBot}
          onToggleBot={toggleBot}
          onExitPosition={exitPosition}
          onClearBotState={handleClearBotState}
        />
      ) : (
        <div className="empty-bot-state">
          <div className="empty-bot-state__icon">🤖</div>
          <div className="empty-bot-state__text">No strategy bots configured yet.</div>
          <button className="empty-bot-state__btn" onClick={() => { setIsEditMode(false); setEditingBot(null); setShowBotModal(true); }}>
            + Create Your First Bot
          </button>
        </div>
      )}

      {/* Modals */}
      <BotModal show={showBotModal} onClose={() => setShowBotModal(false)} sessions={accounts} customStrategies={customStrategies} isEditMode={isEditMode} editingBot={editingBot} onSave={handleSaveBot} />
      <SettingsModal show={showSettingsModal} onClose={() => setShowSettingsModal(false)} settings={settings} onSave={saveSettings} updating={updatingSettings} />
    </div>
  );
}
export default TradingPage;
