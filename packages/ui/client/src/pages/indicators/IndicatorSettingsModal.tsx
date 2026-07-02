import { FC, useState, useEffect, useRef } from 'react';
import { INDICATORS_SCHEMA, IndicatorsState } from './useIndicators';

interface IndicatorSettingsModalProps {
  state: IndicatorsState;
}

export const IndicatorSettingsModal: FC<IndicatorSettingsModalProps> = ({ state }) => {
  const { settingsIndicator, closeSettings, updateIndicator, period } = state;
  const [localParams, setLocalParams] = useState<Record<string, any>>({});
  const [localTimeframe, setLocalTimeframe] = useState<string>('');
  const firstInputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  // Sync local states when the target indicator changes
  useEffect(() => {
    if (settingsIndicator) {
      setLocalParams({ ...settingsIndicator.params });
      setLocalTimeframe(settingsIndicator.timeframe || '');
    }
  }, [settingsIndicator]);

  // Focus first input on open
  useEffect(() => {
    if (settingsIndicator && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [settingsIndicator]);

  if (!settingsIndicator) return null;

  const schema = INDICATORS_SCHEMA.find(s => s.type === settingsIndicator.type);
  if (!schema) return null;

  const handleLocalChange = (paramName: string, value: any) => {
    setLocalParams(prev => ({ ...prev, [paramName]: value }));
  };

  const handleApply = () => {
    // Apply each changed param, with validation
    const updatedParams: Record<string, any> = {};
    schema.params.forEach(p => {
      let value = localParams[p.name];
      if (p.type === 'number') {
        value = Number(value);
        if (isNaN(value)) value = p.default;
        if (p.min !== undefined && value < p.min) value = p.min;
        if (p.max !== undefined && value > p.max) value = p.max;
      }
      updatedParams[p.name] = value;
    });
    
    updateIndicator(settingsIndicator.id, updatedParams, localTimeframe);
    closeSettings();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="ind-modal-backdrop" onClick={closeSettings}>
      <div
        className="ind-settings-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="ind-settings-modal__header">
          <span className="ind-settings-modal__title">
            {settingsIndicator.name} Settings
          </span>
          <button
            className="ind-settings-modal__close"
            onClick={closeSettings}
            aria-label="Close settings"
          >
            <i className="la la-times" />
          </button>
        </div>

        {/* Parameters Form */}
        <div className="ind-settings-modal__body">
          {schema.params.map((p, idx) => (
            <div key={p.name} className="ind-settings-modal__field">
              <label className="ind-settings-modal__label">{p.label}</label>
              {p.type === 'number' ? (
                <input
                  ref={idx === 0 ? firstInputRef as React.RefObject<HTMLInputElement> : undefined}
                  type="number"
                  className="ind-settings-modal__input"
                  value={localParams[p.name] ?? p.default}
                  min={p.min}
                  max={p.max}
                  step={p.step || 1}
                  onChange={(e) => handleLocalChange(p.name, Number(e.target.value))}
                />
              ) : (
                <select
                  ref={idx === 0 ? firstInputRef as React.RefObject<HTMLSelectElement> : undefined}
                  className="ind-settings-modal__select"
                  value={localParams[p.name] ?? p.default}
                  onChange={(e) => handleLocalChange(p.name, e.target.value)}
                >
                  {p.options?.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {/* Timeframe Selection */}
          <div className="ind-settings-modal__field">
            <label className="ind-settings-modal__label">Timeframe</label>
            <select
              className="ind-settings-modal__select"
              value={localTimeframe}
              onChange={(e) => setLocalTimeframe(e.target.value)}
            >
              <option value="">Chart Timeframe</option>
              {(period === '1d' || period === '1w') ? (
                <>
                  <option value="1m">1 Min</option>
                  <option value="5m">5 Min</option>
                  <option value="15m">15 Min</option>
                  <option value="1h">1 Hour</option>
                  <option value="1d">1 Day</option>
                </>
              ) : (
                <>
                  <option value="1d">1 Day</option>
                  <option value="1wk">1 Week</option>
                  <option value="1mo">1 Month</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="ind-settings-modal__footer">
          <button
            className="ind-settings-modal__btn ind-settings-modal__btn--cancel"
            onClick={closeSettings}
          >
            Cancel
          </button>
          <button
            className="ind-settings-modal__btn ind-settings-modal__btn--apply"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
