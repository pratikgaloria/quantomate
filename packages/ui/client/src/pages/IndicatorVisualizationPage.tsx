import { FC } from 'react';
import { IndicatorChart } from '../components/Charts/IndicatorChart';
import { useIndicators } from './indicators/useIndicators';
import { IndicatorsLibraryModal } from './indicators/IndicatorsLibraryModal';
import { IndicatorSettingsModal } from './indicators/IndicatorSettingsModal';
import { IndicatorControlsOverlay } from './indicators/IndicatorControlsOverlay';
import './IndicatorVisualizationPage.scss';

export const IndicatorVisualizationPage: FC = () => {
  const state = useIndicators();

  const {
    loading,
    error,
    quotes,
    activeIndicators,
    indicatorData,
  } = state;

  return (
    <div className="indicator-visualizer-page">
      {/* Error banner */}
      {error && <div className="ind-error-message">{error}</div>}

      {/* Full-screen chart area */}
      <div className="ind-chart-area">
        {/* Floating controls panel on the top-left */}
        <IndicatorControlsOverlay state={state} />

        {!loading && quotes.length === 0 && !error && (
          <div className="ind-empty-state">
            <i className="la la-chart-area" />
            <p>No data loaded. Type a symbol in the floating search bar to get started.</p>
          </div>
        )}

        {quotes.length > 0 && (
          <IndicatorChart
            data={quotes}
            activeIndicators={activeIndicators}
            indicatorData={indicatorData}
          />
        )}

        {loading && (
          <div className="ind-loading-overlay">
            <div className="spinner" />
            <span>Loading Historical Data...</span>
          </div>
        )}
      </div>

      {/* Modal dialogs */}
      <IndicatorsLibraryModal state={state} />
      <IndicatorSettingsModal state={state} />
    </div>
  );
};

export default IndicatorVisualizationPage;
