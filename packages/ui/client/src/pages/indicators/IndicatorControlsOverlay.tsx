import { FC, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IndicatorsState, ActiveIndicator } from './useIndicators';

interface IndicatorControlsOverlayProps {
  state: IndicatorsState;
}

// Mimics the exact color assignment logic from IndicatorChart.tsx
const getIndicatorColors = (activeIndicators: ActiveIndicator[]) => {
  const colors = ['#2196f3', '#ff9800', '#9c27b0', '#e91e63', '#4caf50', '#009688', '#03a9f4', '#795548'];
  const overlayTypes = ['SMA', 'EMA', 'WMA', 'DEMA', 'TEMA', 'VWAP', 'AVWAP', 'BB'];
  const separateTypes = ['RSI', 'MACD', 'Stochastic', 'ATR', 'CCI', 'ROC', 'MOM', 'WilliamsR', 'RVOL', 'Slope', 'PivotTrend'];

  let colorIdx = 0;
  const result: Record<string, string[]> = {};

  activeIndicators.forEach((ind) => {
    // 1. Overlay indicators
    if (overlayTypes.includes(ind.type)) {
      if (ind.visible === false) {
        colorIdx++;
        result[ind.id] = [];
        return;
      }
      const color = colors[colorIdx % colors.length];
      colorIdx++;
      result[ind.id] = [color];
    }
    // 2. Separate indicators
    else if (separateTypes.includes(ind.type)) {
      const color = colors[colorIdx % colors.length];
      colorIdx++;

      if (ind.visible === false) {
        result[ind.id] = [];
        return;
      }

      if (ind.type === 'RSI') {
        result[ind.id] = ['#9c27b0'];
      } else if (ind.type === 'Stochastic') {
        result[ind.id] = ['#2196f3', '#ff9800']; // %K, %D
      } else if (ind.type === 'MACD') {
        result[ind.id] = ['#2196f3', '#ff9800']; // MACD, Signal
      } else if (ind.type === 'WilliamsR') {
        result[ind.id] = ['#e91e63'];
      } else if (ind.type === 'RVOL') {
        result[ind.id] = ['rgba(33, 150, 243, 0.5)'];
      } else if (ind.type === 'PivotTrend') {
        result[ind.id] = ['#009688'];
      } else {
        result[ind.id] = [color];
      }
    }
  });

  return result;
};

export const IndicatorControlsOverlay: FC<IndicatorControlsOverlayProps> = ({ state }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const {
    symbol,
    symbolQuery,
    searchResults,
    setSearchResults,
    period,
    interval,
    activeIndicators,
    handleSymbolSearch,
    handleSelectSymbol,
    handlePeriodChange,
    setInterval,
    toggleVisibility,
    openSettings,
    removeIndicator,
    setLibraryOpen,
  } = state;

  // Sync autocomplete dropdown coordinates with input element
  useEffect(() => {
    if (searchResults.length > 0 && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  }, [searchResults]);

  // Click outside autocomplete input closes the results list
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchResults.length > 0) {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setSearchResults([]);
        }
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [searchResults, setSearchResults]);

  const indicatorColors = getIndicatorColors(activeIndicators);

  return (
    <div className="ind-chart-controls-container">
      {/* Row 1: Symbol, Period, Interval controls + Indicators modal button */}
      <div className="ind-controls-bar">
        <div className="tb-symbol-wrapper">
          <input
            ref={inputRef}
            className="tb-input"
            type="text"
            value={symbolQuery || symbol}
            onChange={(e) => handleSymbolSearch(e.target.value)}
            placeholder="Search symbol..."
            style={{ width: 100 }}
          />
        </div>

        <select
          className="tb-select"
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          style={{ minWidth: 80 }}
        >
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
        </select>

        <div className="ind-interval-buttons-row">
          {(period === '1d' || period === '1w') ? (
            <>
              {['1m', '5m', '15m', '1h'].map((intv) => (
                <button
                  key={intv}
                  className={`ind-interval-btn ${interval === intv ? 'active' : ''}`}
                  onClick={() => setInterval(intv)}
                >
                  {intv}
                </button>
              ))}
              {period === '1w' && (
                <button
                  className={`ind-interval-btn ${interval === '1d' ? 'active' : ''}`}
                  onClick={() => setInterval('1d')}
                >
                  1d
                </button>
              )}
            </>
          ) : (
            <>
              {['1d', '1wk', '1mo'].map((intv) => (
                <button
                  key={intv}
                  className={`ind-interval-btn ${interval === intv ? 'active' : ''}`}
                  onClick={() => setInterval(intv)}
                >
                  {intv === '1wk' ? '1wk' : intv === '1mo' ? '1mo' : '1d'}
                </button>
              ))}
            </>
          )}
        </div>

        <span className="tb-divider" />

        <button
          className="tb-btn"
          onClick={() => setLibraryOpen(true)}
          style={{ minWidth: 'auto', padding: '0 0.5rem', gap: '0.25rem', height: 22, fontSize: '0.72rem' }}
        >
          <i className="la la-chart-line" style={{ fontSize: '0.8rem' }} />
          Indicators
        </button>
      </div>

      {/* Row 2+: Applied indicators stack (vertical) */}
      <div className="ind-applied-stack">
        {activeIndicators.map(ind => {
          const colorsList = indicatorColors[ind.id] || [];
          return (
            <div
              key={ind.id}
              className={`ind-legend-row ${!ind.visible ? 'ind-legend-row--hidden' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {colorsList.length > 0 && (
                  <div className="ind-legend-row-color-dots">
                    {colorsList.map((col, cIdx) => (
                      <span
                        key={cIdx}
                        className="ind-legend-row-color-dot"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                )}
                <span className="ind-legend-row-name">{ind.name}</span>
              </div>

              <div className="ind-legend-row-actions">
                <button
                  className="ind-legend-row-action"
                  onClick={() => toggleVisibility(ind.id)}
                  title={ind.visible ? 'Hide' : 'Show'}
                  aria-label={ind.visible ? `Hide ${ind.name}` : `Show ${ind.name}`}
                >
                  <i className={ind.visible ? 'la la-eye' : 'la la-eye-slash'} />
                </button>
                <button
                  className="ind-legend-row-action"
                  onClick={() => openSettings(ind.id)}
                  title="Settings"
                  aria-label={`Settings for ${ind.name}`}
                >
                  <i className="la la-cog" />
                </button>
                <button
                  className="ind-legend-row-action ind-legend-row-action--remove"
                  onClick={() => removeIndicator(ind.id)}
                  title="Remove"
                  aria-label={`Remove ${ind.name}`}
                >
                  <i className="la la-times" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Autocomplete dropdown portal */}
      {searchResults.length > 0 && createPortal(
        <div 
          className="tb-autocomplete-dropdown" 
          style={{ 
            position: 'fixed', 
            top: coords.top + 2, 
            left: coords.left, 
            width: Math.max(coords.width, 240),
            zIndex: 9999 
          }}
        >
          {searchResults.map((item) => (
            <div
              key={item.symbol}
              className="tb-ac-item"
              onClick={() => handleSelectSymbol(item)}
            >
              <span className="tb-ac-symbol">{item.symbol}</span>
              <span className="tb-ac-exchange">{item.exchange}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};
