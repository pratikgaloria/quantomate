import { FC } from 'react';
import { IndicatorsState, OVERLAY_TYPES, SEPARATE_TYPES } from './useIndicators';

interface IndicatorLegendOverlayProps {
  state: IndicatorsState;
}

export const IndicatorLegendOverlay: FC<IndicatorLegendOverlayProps> = ({ state }) => {
  const {
    symbol,
    period,
    interval,
    activeIndicators,
    removeIndicator,
    toggleVisibility,
    openSettings,
  } = state;

  const overlayIndicators = activeIndicators.filter(ind => OVERLAY_TYPES.includes(ind.type));
  const separateIndicators = activeIndicators.filter(ind => SEPARATE_TYPES.includes(ind.type));

  // Calculate the percentage-based top offsets for separate panes
  // The main chart takes up the remaining height; separate panes divide evenly from the bottom.
  const numSeparate = separateIndicators.length;
  let mainPctHeight = 100;
  let separatePctHeight = 20;

  if (numSeparate === 1) {
    mainPctHeight = 80;
    separatePctHeight = 20;
  } else if (numSeparate > 1) {
    mainPctHeight = 70;
    separatePctHeight = Math.floor(30 / numSeparate);
  }

  return (
    <div className="ind-legends-container">
      {/* Main chart legend: symbol info + overlay indicators */}
      <div className="ind-legend ind-legend--main" style={{ top: 0 }}>
        <div className="ind-legend__symbol">
          <span className="ind-legend__symbol-name">{symbol}</span>
          <span className="ind-legend__symbol-tf">{period.toUpperCase()} / {interval}</span>
        </div>
        {overlayIndicators.map(ind => (
          <div
            key={ind.id}
            className={`ind-legend__entry ${!ind.visible ? 'ind-legend__entry--hidden' : ''}`}
          >
            <span className="ind-legend__entry-name">{ind.name}</span>
            <div className="ind-legend__entry-actions">
              <button
                className="ind-legend__action"
                onClick={() => toggleVisibility(ind.id)}
                title={ind.visible ? 'Hide' : 'Show'}
                aria-label={ind.visible ? `Hide ${ind.name}` : `Show ${ind.name}`}
              >
                <i className={ind.visible ? 'la la-eye' : 'la la-eye-slash'} />
              </button>
              <button
                className="ind-legend__action"
                onClick={() => openSettings(ind.id)}
                title="Settings"
                aria-label={`Settings for ${ind.name}`}
              >
                <i className="la la-cog" />
              </button>
              <button
                className="ind-legend__action ind-legend__action--remove"
                onClick={() => removeIndicator(ind.id)}
                title="Remove"
                aria-label={`Remove ${ind.name}`}
              >
                <i className="la la-times" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Separate pane legends: positioned at the top-left of each sub-plot */}
      {separateIndicators.map((ind, idx) => {
        // Calculate top offset: main chart % height + cumulative separate pane heights
        const topPct = mainPctHeight + (idx * separatePctHeight);
        return (
          <div
            key={ind.id}
            className={`ind-legend ind-legend--separate ${!ind.visible ? 'ind-legend--dimmed' : ''}`}
            style={{ top: `${topPct}%` }}
          >
            <div className="ind-legend__entry">
              <span className="ind-legend__entry-name">{ind.name}</span>
              <div className="ind-legend__entry-actions">
                <button
                  className="ind-legend__action"
                  onClick={() => toggleVisibility(ind.id)}
                  title={ind.visible ? 'Hide' : 'Show'}
                  aria-label={ind.visible ? `Hide ${ind.name}` : `Show ${ind.name}`}
                >
                  <i className={ind.visible ? 'la la-eye' : 'la la-eye-slash'} />
                </button>
                <button
                  className="ind-legend__action"
                  onClick={() => openSettings(ind.id)}
                  title="Settings"
                  aria-label={`Settings for ${ind.name}`}
                >
                  <i className="la la-cog" />
                </button>
                <button
                  className="ind-legend__action ind-legend__action--remove"
                  onClick={() => removeIndicator(ind.id)}
                  title="Remove"
                  aria-label={`Remove ${ind.name}`}
                >
                  <i className="la la-times" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
