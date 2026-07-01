import { Button, Input, Select } from '../../components/atoms';
import { BacktestState } from './useBacktest';

interface BacktestControlsProps {
  state: BacktestState;
}

export function BacktestControls({ state }: BacktestControlsProps) {
  return (
    <div className="controls-panel">
      {/* 1. Top Section: Setup Controls */}
      <div className="controls-panel__top">
        <Input
          label="Symbol"
          type="text"
          value={state.symbol}
          onChange={(e) => state.setSymbol(e.target.value.toUpperCase())}
          placeholder="NVDA"
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Select
            label="Period"
            value={state.periodRange}
            onChange={(e) => state.handlePeriodRangeChange(e.target.value)}
          >
            <option value="yesterday">Yesterday</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
            <option value="6m">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="3y">3 Years</option>
            <option value="5y">5 Years</option>
            <option value="custom">Custom</option>
          </Select>

          <Select
            label="Interval"
            value={state.interval}
            onChange={(e) => state.setInterval(e.target.value)}
          >
            <option value="1d">Daily</option>
            <option value="1h">1 Hour</option>
            <option value="15m">15 Min</option>
            <option value="5m">5 Min</option>
            <option value="1m">1 Min</option>
          </Select>
        </div>

        {state.periodRange === 'custom' && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              label="Start Date"
              type="date"
              value={state.startDate}
              onChange={(e) => {
                state.setStartDate(e.target.value);
                state.setPeriodRange('custom');
              }}
            />
            <Input
              label="End Date"
              type="date"
              value={state.endDate}
              onChange={(e) => {
                state.setEndDate(e.target.value);
                state.setPeriodRange('custom');
              }}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="block text-xs font-medium text-muted-foreground/80 mb-1">Strategy</label>
          <Select
            value={state.selectedStrategy}
            onChange={(e) => state.handleStrategyChange(e.target.value)}
          >
            <option value="">Select...</option>
            {state.strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          {state.selectedStrategyMeta && (
            <div className="flex gap-1.5 items-start text-xs text-blue-600 dark:text-blue-400 mt-2 leading-normal">
              <svg
                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>{state.selectedStrategyMeta.description}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Middle Section: In-Place Scrollable Parameters List */}
      <div className="controls-panel__middle">
        {state.selectedStrategyMeta && state.selectedStrategyMeta.parameters.length > 0 && (
          <div className="parameters-list-container">
            <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">Parameters</h3>
            {state.selectedStrategyMeta.parameters.map((param) => {
              const value = state.parameters[param.name] ?? param.default;
              if (param.type === 'number') {
                return (
                  <Input
                    key={param.name}
                    label={param.description}
                    type="number"
                    value={value}
                    min={param.min}
                    max={param.max}
                    onChange={(e) => state.handleParameterChange(param.name, Number(e.target.value))}
                  />
                );
              }
              if (param.type === 'string') {
                return (
                  <Input
                    key={param.name}
                    label={param.description}
                    type="text"
                    value={value ?? ''}
                    onChange={(e) => state.handleParameterChange(param.name, e.target.value)}
                    placeholder={String(param.default ?? '')}
                  />
                );
              }
              if (param.type === 'boolean') {
                return (
                  <Select
                    key={param.name}
                    label={param.description}
                    value={String(value)}
                    onChange={(e) => state.handleParameterChange(param.name, e.target.value === 'true')}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
                );
              }
              if (param.type === 'select') {
                return (
                  <Select
                    key={param.name}
                    label={param.description}
                    value={value}
                    onChange={(e) => state.handleParameterChange(param.name, e.target.value)}
                  >
                    {param.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </Select>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* 3. Bottom Section: Action Button */}
      <div className="controls-panel__bottom">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={state.runBacktest}
          disabled={state.loading || !state.selectedStrategy}
        >
          {state.loading ? 'Running...' : 'Run Backtest'}
        </Button>

        {state.error && <div className="error-message mt-2">{state.error}</div>}
      </div>
    </div>
  );
}
