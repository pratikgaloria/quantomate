import { FC, useEffect } from 'react';
import { IndicatorChart } from '../components/Charts/IndicatorChart';
import { useIndicators } from './indicators/useIndicators';
import { IndicatorsLibraryModal } from './indicators/IndicatorsLibraryModal';
import { IndicatorSettingsModal } from './indicators/IndicatorSettingsModal';
import { IndicatorLegendOverlay } from './indicators/IndicatorLegendOverlay';
import './IndicatorVisualizationPage.scss';

export const IndicatorVisualizationPage: FC = () => {
  const state = useIndicators();

  const {
    market,
    symbol,
    symbolQuery,
    searchResults,
    period,
    interval,
    loading,
    error,
    quotes,
    activeIndicators,
    indicatorData,
    handleMarketChange,
    handleSymbolSearch,
    handleSelectSymbol,
    handlePeriodChange,
    handleRefresh,
    setInterval,
    setLibraryOpen,
    setToolbar,
  } = state;

  // Push toolbar: market, symbol search, period, interval, indicators button, refresh
  useEffect(() => {
    setToolbar(
      <>
        <span className="tb-label">Market</span>
        <button
          className={market === 'us' ? 'tb-btn' : 'tb-btn-outline'}
          onClick={() => handleMarketChange('us')}
          style={{ minWidth: 'auto', padding: '0 0.6rem' }}
        >US</button>
        <button
          className={market === 'india' ? 'tb-btn' : 'tb-btn-outline'}
          onClick={() => handleMarketChange('india')}
          style={{ minWidth: 'auto', padding: '0 0.6rem' }}
        >India</button>

        <span className="tb-divider" />

        <span className="tb-label">Symbol</span>
        <div className="tb-symbol-wrapper">
          <input
            className="tb-input"
            type="text"
            value={symbolQuery || symbol}
            onChange={(e) => handleSymbolSearch(e.target.value)}
            placeholder="Search..."
            style={{ width: 110 }}
          />
          {searchResults.length > 0 && (
            <div className="tb-autocomplete-dropdown">
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
            </div>
          )}
        </div>

        <span className="tb-divider" />

        <span className="tb-label">Period</span>
        <select
          className="tb-select"
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          style={{ minWidth: 90 }}
        >
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
        </select>

        <span className="tb-label">Interval</span>
        <select
          className="tb-select"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          disabled={period !== '1d' && period !== '1w'}
          style={{ minWidth: 90 }}
        >
          {period === '1d' || period === '1w' ? (
            <>
              <option value="1m">1 Min</option>
              <option value="5m">5 Min</option>
              <option value="15m">15 Min</option>
              <option value="1h">1 Hour</option>
              {period === '1w' && <option value="1d">Daily</option>}
            </>
          ) : (
            <option value="1d">Daily</option>
          )}
        </select>

        <span className="tb-divider" />

        <button
          className="tb-btn"
          onClick={() => setLibraryOpen(true)}
          style={{ minWidth: 'auto', padding: '0 0.6rem', gap: '0.3rem' }}
        >
          <i className="la la-chart-line" style={{ fontSize: '0.85rem' }} />
          Indicators
        </button>

        <button
          className="tb-btn-outline"
          onClick={handleRefresh}
          disabled={loading}
          style={{ minWidth: 'auto', padding: '0 0.6rem' }}
          aria-label="Refresh chart data"
        >
          <i className={`la la-sync ${loading ? 'la-spin' : ''}`} style={{ fontSize: '0.85rem' }} />
        </button>

        {loading && (
          <span style={{ fontSize: '0.72rem', color: 'hsl(var(--muted-foreground))', marginLeft: 4 }}>
            Loading...
          </span>
        )}
      </>
    );
  }, [market, symbol, symbolQuery, searchResults, period, interval, loading, setToolbar, handleMarketChange, handleSymbolSearch, handleSelectSymbol, handlePeriodChange, setInterval, setLibraryOpen, handleRefresh]);

  return (
    <div className="indicator-visualizer-page">
      {/* Error banner */}
      {error && <div className="ind-error-message">{error}</div>}

      {/* Full-screen chart area */}
      <div className="ind-chart-area">
        {/* Legend overlays rendered on top of the chart */}
        {quotes.length > 0 && <IndicatorLegendOverlay state={state} />}

        {!loading && quotes.length === 0 && !error && (
          <div className="ind-empty-state">
            <i className="la la-chart-area" />
            <p>No quote data loaded. Search for a symbol to get started.</p>
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
