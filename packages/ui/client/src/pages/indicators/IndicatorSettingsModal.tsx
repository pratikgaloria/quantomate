import { FC, useState, useEffect, useRef } from 'react';
import { INDICATORS_SCHEMA, IndicatorsState } from './useIndicators';

interface IndicatorSettingsModalProps {
  state: IndicatorsState;
}

export const IndicatorSettingsModal: FC<IndicatorSettingsModalProps> = ({ state }) => {
  const { settingsIndicator, closeSettings, handleParamChange } = state;
  const [localParams, setLocalParams] = useState<Record<string, any>>({});
  const firstInputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  // Sync local params when the target indicator changes
  useEffect(() => {
    if (settingsIndicator) {
      setLocalParams({ ...settingsIndicator.params });
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
    schema.params.forEach(p => {
      let value = localParams[p.name];
      if (p.type === 'number') {
        value = Number(value);
        if (isNaN(value)) value = p.default;
        if (p.min !== undefined && value < p.min) value = p.min;
        if (p.max !== undefined && value > p.max) value = p.max;
      }
      handleParamChange(settingsIndicator.id, p.name, value);
    });
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
