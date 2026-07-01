import React from 'react';
import { AVAILABLE_STRATEGIES, TIMEFRAME_INTERVALS } from './availableStrategies';

interface StrategyModalProps {
  isEditMode: boolean;
  formName: string;
  setFormName: (val: string) => void;
  formBaseType: string;
  handleBaseTypeChange: (val: string) => void;
  formInterval: string;
  setFormInterval: (val: string) => void;
  formParameters: Record<string, any>;
  setFormParameters: (val: any) => void;
  handleSave: (e: React.FormEvent) => void;
  setShowModal: (val: boolean) => void;
}

export function StrategyModal({
  isEditMode, formName, setFormName, formBaseType, handleBaseTypeChange,
  formInterval, setFormInterval, formParameters, setFormParameters,
  handleSave, setShowModal
}: StrategyModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <h2>{isEditMode ? 'Edit Strategy' : 'Create Strategy'}</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Strategy Name</label>
            <input
              type="text" placeholder="e.g. Pivot Trend Intraday 15m"
              value={formName} onChange={e => setFormName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem' }}
              required
            />
          </div>
          <div className="form-group">
            <label>Base Strategy Type</label>
            <select value={formBaseType} onChange={e => handleBaseTypeChange(e.target.value)}>
              {Object.entries(AVAILABLE_STRATEGIES).map(([k, v]: any) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Timeframe Interval</label>
            <select value={formInterval} onChange={e => setFormInterval(e.target.value)}>
              {TIMEFRAME_INTERVALS.map(intv => (
                <option key={intv} value={intv}>{intv}</option>
              ))}
            </select>
          </div>
          {AVAILABLE_STRATEGIES[formBaseType]?.paramSchema.map((param: any) => {
            // Conditional visibility checks
            if (param.name === 'trendFilterInterval' && !formParameters.useTrendFilter) {
              return null;
            }
            if ((param.name === 'atrPeriod' || param.name === 'stopLossMultiplier') &&
                (formParameters.stopLossType === 'none' || formParameters.stopLossType === 'pivot')) {
              return null;
            }

            return (
              <div
                key={param.name}
                className="form-group"
                style={param.type === 'boolean' ? { display: 'flex', alignItems: 'center', gap: '8px' } : undefined}
              >
                {param.type === 'boolean' ? (
                  <>
                    <input
                      type="checkbox"
                      id={`param-${param.name}`}
                      checked={!!(formParameters[param.name] ?? param.default)}
                      onChange={e => setFormParameters((prev: any) => ({ ...prev, [param.name]: e.target.checked }))}
                      style={{ cursor: 'pointer', width: 'auto', margin: 0 }}
                    />
                    <label htmlFor={`param-${param.name}`} style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal' }}>
                      {param.label}
                    </label>
                  </>
                ) : (
                  <>
                    <label>{param.label}</label>
                    {param.type === 'select' ? (
                      <select
                        value={formParameters[param.name] ?? param.default}
                        onChange={e => setFormParameters((prev: any) => ({ ...prev, [param.name]: e.target.value }))}
                      >
                        {param.options?.map((opt: any) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        value={formParameters[param.name] ?? param.default}
                        onChange={e => setFormParameters((prev: any) => ({ ...prev, [param.name]: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem' }}
                        required
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-save">Save Strategy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
