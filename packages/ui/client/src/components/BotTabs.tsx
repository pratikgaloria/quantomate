import { getMarketForSymbol, getCurrencySymbol, calculateBotPL, getBotPositions, getBotOrders } from '../utils/tradingHelpers';

interface BotTabsProps {
  bots: any[];
  orders: any[];
  positions: any[];
  activeBotId: string | null;
  onSelectBot: (id: string) => void;
  onCreateBot: () => void;
}

export function BotTabs({ bots, orders, positions, activeBotId, onSelectBot, onCreateBot }: BotTabsProps) {
  return (
    <div className="bot-tabs">
      <div className="bot-tabs__list">
        {bots.map(bot => {
          const isActive = activeBotId === bot.id;
          const pl = calculateBotPL(bot.symbol, orders, positions);
          const openPos = getBotPositions(bot.symbol, positions);
          const filledOrders = getBotOrders(bot.symbol, orders).filter(o => o.status?.toLowerCase() === 'filled');
          const market = getMarketForSymbol(bot.symbol);
          const sym = getCurrencySymbol(market);

          return (
            <button
              key={bot.id}
              className={`bot-tab ${isActive ? 'bot-tab--active' : ''}`}
              onClick={() => onSelectBot(bot.id)}
            >
              <div className="bot-tab__indicator-row">
                <span className={`bot-tab__dot ${bot.active ? 'running' : 'stopped'}`} />
                <span className="bot-tab__name">{bot.name}</span>
              </div>
              <div className="bot-tab__meta">
                <span className="bot-tab__counts">{openPos.length}/{filledOrders.length}</span>
                <span className={`bot-tab__pl ${pl.totalPL >= 0 ? 'positive' : 'negative'}`}>
                  {pl.totalPL >= 0 ? '+' : ''}{sym}{pl.totalPL.toFixed(2)}
                </span>
              </div>
            </button>
          );
        })}
        <button className="bot-tab bot-tab--add" onClick={onCreateBot}>
          <span className="bot-tab__add-icon">+</span>
          <span className="bot-tab__add-text">Add Bot</span>
        </button>
      </div>
    </div>
  );
}
