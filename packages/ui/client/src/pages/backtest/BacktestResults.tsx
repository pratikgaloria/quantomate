import { useState } from 'react';
import { PriceChart } from '../../components/Charts/PriceChart';
import { EquityCurve } from '../../components/Charts/EquityCurve';
import { DrawdownChart } from '../../components/Charts/DrawdownChart';
import { TradeAnalysisChart } from '../../components/Charts/TradeAnalysisChart';
import { TradeList } from '../../components/TradeList';
import { BacktestMetrics } from './BacktestMetrics';
import { Card } from '../../components/atoms';
import { BacktestState } from './useBacktest';


interface BacktestResultsProps {
  state: BacktestState;
}

export function BacktestResults({ state }: BacktestResultsProps) {
  const [selectedTrade, setSelectedTrade] = useState<{ id: number; entryDate: string; exitDate: string } | null>(null);

  return (
    <div className="results-panel">
      {state.result ? (
        <div className="results-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {state.result.report.numberOfTrades === 0 && (
            <div className="zero-trades-tip">
              <span className="tip-icon">💡</span>
              <div className="tip-message">
                <strong>No trades executed:</strong> entry criteria were not met during the selected time period. Try adjusting parameters or changing the date range.
              </div>
            </div>
          )}

          {/* Row 1: Metric Cards directly on grey background */}
          <BacktestMetrics result={state.result} />

          {/* First main row: Left col = Trade History, Right col = Price and Equity charts */}
          <div className="backtest-dashboard-row-one">
            <div className="column-left">
              <TradeList
                trades={state.result.report.trades}
                initialCapital={state.result.report.initialCapital}
                periodRange={state.periodRange}
                selectedTrade={selectedTrade}
                onSelectTrade={setSelectedTrade}
              />
            </div>
            <div className="column-right">
              <Card title="Price & Trade Execution" className="h-[520px]">
                <div className="chart-inner-wrapper">
                  <PriceChart
                    data={state.result.chartData.prices}
                    trades={state.result.chartData.trades}
                    selectedTrade={selectedTrade}
                  />
                </div>
              </Card>

              <Card title="Equity Curve ($)" className="h-[520px]">
                <div className="chart-inner-wrapper">
                  <EquityCurve
                    data={state.result.chartData.equity}
                    initialCapital={state.result.report.initialCapital}
                    selectedTrade={selectedTrade}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Second row: Left col = Trade Analysis, Right col = Drawdown */}
          <div className="backtest-dashboard-row-two">
            <Card title="Trade Analysis" className="h-[420px]">
              <div className="chart-inner-wrapper">
                <TradeAnalysisChart data={state.result.chartData.prices} trades={state.result.report.trades} />
              </div>
            </Card>

            <Card title="Drawdown (%)" className="h-[420px]">
              <div className="chart-inner-wrapper">
                <DrawdownChart
                  equityData={state.result.chartData.equity}
                  selectedTrade={selectedTrade}
                />
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon-wrapper">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="0" stroke="currentColor" strokeWidth="1" />
              <path d="M3 12h18" strokeDasharray="2 2" />
              <path d="M12 3v18" strokeDasharray="2 2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16l3-4 3 2 5-5" />
            </svg>
          </div>
          <h3 className="empty-state__title">Backtest Analyzer</h3>
          <p className="empty-state__description">
            Select a strategy, symbol, and parameters in the sidebar, then run a backtest to analyze historical performance.
          </p>
        </div>
      )}
    </div>
  );
}
