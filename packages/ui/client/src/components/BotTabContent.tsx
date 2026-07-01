import { getMarketForSymbol, formatPrice, formatPL, calculateBotPL, getBotPositions, getBotOrders, groupOrdersIntoTrades, getOptionType } from '../utils/tradingHelpers';
import { TradeExecutionsGrid } from './TradeExecutionsGrid';

interface BotTabContentProps {
  bot: any;
  orders: any[];
  positions: any[];
  prices: Record<string, number | null>;
  onEditBot: (bot: any) => void;
  onDeleteBot: (id: string, name: string) => void;
  onToggleBot: (id: string, active: boolean) => void;
  onExitPosition: (symbol: string) => void;
  onClearBotState?: (id: string, name: string) => void;
}

export function BotTabContent({ bot, orders, positions, prices, onEditBot, onDeleteBot, onToggleBot, onExitPosition, onClearBotState }: BotTabContentProps) {
  const market = getMarketForSymbol(bot.symbol);
  const pl = calculateBotPL(bot.symbol, orders, positions);
  const botPositions = getBotPositions(bot.symbol, positions);
  const botOrders = getBotOrders(bot.symbol, orders).filter(o => o.status?.toLowerCase() === 'filled');
  const trades = groupOrdersIntoTrades(bot.symbol, orders, positions);
  const strategyName = bot.customStrategy?.name || bot.strategy || '-';
  const interval = bot.customStrategy?.interval || '1m';
  const params = bot.parameters || bot.customStrategy?.parameters || {};

  return (
    <div className="bot-content">
      {/* Controls Strip */}
      <div className="bot-content__controls">
        <div className="bot-content__controls-left">
          <button
            className={`bot-content__toggle-btn ${bot.active ? 'active' : ''}`}
            onClick={() => onToggleBot(bot.id, bot.active)}
          >
            <span className={`bot-content__toggle-dot ${bot.active ? 'running' : 'stopped'}`} />
            {bot.active ? 'Stop Bot' : 'Start Bot'}
          </button>
          <button className="bot-content__action-btn" onClick={() => onEditBot(bot)}>Edit</button>
          <button className="bot-content__action-btn danger" onClick={() => onDeleteBot(bot.id, bot.name)}>Delete</button>
          <button className="bot-content__action-btn" onClick={() => onClearBotState?.(bot.id, bot.name)}>Clear State</button>
        </div>
        <div className="bot-content__controls-right">
          <div className="bot-content__info-chip">
            <span className="bot-content__info-label">Strategy</span>
            <span className="bot-content__info-value">{strategyName}</span>
          </div>
          <div className="bot-content__info-chip">
            <span className="bot-content__info-label">Interval</span>
            <span className="bot-content__info-value">{interval}</span>
          </div>
          <div className="bot-content__info-chip">
            <span className="bot-content__info-label">Symbol</span>
            <span className="bot-content__info-value">{bot.symbol}</span>
          </div>
          {prices[bot.symbol] !== undefined && prices[bot.symbol] !== null && (
            <div className="bot-content__info-chip">
              <span className="bot-content__info-label">Last Price</span>
              <span className="bot-content__info-value">{formatPrice(bot.symbol, prices[bot.symbol])}</span>
            </div>
          )}
        </div>
      </div>

      {/* Strategy Parameters */}
      {Object.keys(params).length > 0 && (
        <div className="bot-content__params">
          <div className="bot-content__params-title">Parameters</div>
          <div className="bot-content__params-grid">
            {Object.entries(params).map(([key, val]) => (
              <div key={key} className="bot-content__param">
                <span className="bot-content__param-key">{key}</span>
                <span className="bot-content__param-val">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consolidated Metrics */}
      <div className="bot-content__metrics">
        <div className="bot-content__metric">
          <span className="bot-content__metric-label">Total Trades</span>
          <span className="bot-content__metric-value">{botOrders.length}</span>
        </div>
        <div className="bot-content__metric">
          <span className="bot-content__metric-label">Open Positions</span>
          <span className="bot-content__metric-value">{botPositions.length}</span>
        </div>
        <div className="bot-content__metric">
          <span className="bot-content__metric-label">Realised P/L</span>
          <span className={`bot-content__metric-value ${pl.realizedPL >= 0 ? 'positive' : 'negative'}`}>
            {formatPL(pl.realizedPL, market)}
          </span>
        </div>
        <div className="bot-content__metric">
          <span className="bot-content__metric-label">Unrealised P/L</span>
          <span className={`bot-content__metric-value ${pl.unrealizedPL >= 0 ? 'positive' : 'negative'}`}>
            {formatPL(pl.unrealizedPL, market)}
          </span>
        </div>
        <div className="bot-content__metric highlight">
          <span className="bot-content__metric-label">Total P/L</span>
          <span className={`bot-content__metric-value ${pl.totalPL >= 0 ? 'positive' : 'negative'}`}>
            {formatPL(pl.totalPL, market)}
          </span>
        </div>
      </div>

      {/* Open Positions */}
      {botPositions.length > 0 && (
        <div className="bot-content__section">
          <h4 className="bot-content__section-title">Open Positions</h4>
          <div className="table-responsive">
            <table className="bot-content__table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Avg. Entry</th>
                  <th>Market Price</th>
                  <th>Unrealized P/L</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {botPositions.map(pos => {
                  const optType = getOptionType(pos.symbol);
                  return (
                    <tr key={pos.symbol}>
                      <td className="font-bold">{pos.symbol}</td>
                      <td><span className={`option-type-badge ${optType === '-' ? 'none' : optType.toLowerCase()}`}>{optType}</span></td>
                      <td>{pos.qty}</td>
                      <td>{formatPrice(pos.symbol, pos.avgEntryPrice || pos.entryPrice)}</td>
                      <td>{formatPrice(pos.symbol, pos.marketPrice)}</td>
                      <td className={`pnl-value ${pos.unrealizedPL >= 0 ? 'positive' : 'negative'}`}>
                        {pos.unrealizedPL >= 0 ? '+' : ''}{formatPrice(pos.symbol, pos.unrealizedPL)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="exit-btn" onClick={() => onExitPosition(pos.symbol)}>Exit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trade Executions Grid */}
      <TradeExecutionsGrid trades={trades} market={market} />
    </div>
  );
}
