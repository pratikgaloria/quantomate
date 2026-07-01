import { AVAILABLE_STRATEGIES } from './availableStrategies';

interface StrategyCardProps {
  strat: {
    id: string;
    name: string;
    baseType: string;
    interval: string;
    botCount: number;
    totalPL: number;
    parameters: Record<string, any>;
  };
  handleOpenEdit: (strat: any) => void;
  handleDelete: (id: string, name: string) => void;
}

export function StrategyCard({ strat, handleOpenEdit, handleDelete }: StrategyCardProps) {
  const baseName = AVAILABLE_STRATEGIES[strat.baseType]?.name || strat.baseType;
  return (
    <div className="strategy-item-card">
      <div className="strategy-card-main">
        <div className="strategy-header">
          <span className="strategy-name">{strat.name}</span>
          <span className="timeframe-badge">{strat.interval}</span>
        </div>
        <div className="strategy-meta">Base: <span className="base-type">{baseName}</span></div>
        <div className="strategy-params">
          {Object.entries(strat.parameters || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}
        </div>
      </div>
      <div className="strategy-stats">
        <div className="stat-box">
          <div className="label">Bots Count</div>
          <div className="value">{strat.botCount}</div>
        </div>
        <div className="stat-box">
          <div className="label">Total P/L</div>
          <div className={`value ${strat.totalPL >= 0 ? 'positive' : 'negative'}`}>
            {strat.totalPL >= 0 ? '+' : ''}₹{strat.totalPL.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="strategy-actions">
        <button onClick={() => handleOpenEdit(strat)}><i className="la la-edit" /> Edit</button>
        <button className="btn-delete" onClick={() => handleDelete(strat.id, strat.name)}>
          <i className="la la-trash" /> Delete
        </button>
      </div>
    </div>
  );
}
