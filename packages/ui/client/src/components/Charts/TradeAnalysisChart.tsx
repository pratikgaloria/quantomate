import { FC, useEffect, useRef } from 'react';
import * as anychart from 'anychart';
import './TradeAnalysisChart.scss';

interface Trade {
  type: 'entry' | 'exit';
  tradedValue: number;
  date: string;
  short?: boolean;
  exitReason?: string;
}

interface PriceBar {
  date: Date | string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradeAnalysisChartProps {
  data: PriceBar[];
  trades: Trade[];
}

export const TradeAnalysisChart: FC<TradeAnalysisChartProps> = ({ data: prices, trades }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  // Group trades into positions
  const positions: Array<{
    profitLoss: number;
    profitLossPercent: number;
    bars: number;
  }> = [];

  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    if (trade.type === 'entry' && i + 1 < trades.length) {
      const exitTrade = trades[i + 1];
      if (exitTrade.type === 'exit') {
        const isShort = !!trade.short;
        const entryPrice = trade.tradedValue;
        const exitPrice = exitTrade.tradedValue;
        const profitLoss = isShort ? entryPrice - exitPrice : exitPrice - entryPrice;
        const profitLossPercent = entryPrice > 0 ? (profitLoss / entryPrice) * 100 : 0;

        // Count bars in trade
        const entryTime = new Date(trade.date).getTime();
        const exitTime = new Date(exitTrade.date).getTime();
        const barsCount = prices.filter(p => {
          const t = new Date(p.date).getTime();
          return t >= entryTime && t <= exitTime;
        }).length;

        positions.push({
          profitLoss,
          profitLossPercent,
          bars: barsCount,
        });
        i++; // Skip exit
      }
    }
  }

  const totalTrades = positions.length;
  const winners = positions.filter(p => p.profitLossPercent >= 0);
  const losers = positions.filter(p => p.profitLossPercent < 0);

  const avgPnLPercent = totalTrades > 0
    ? positions.reduce((sum, p) => sum + p.profitLossPercent, 0) / totalTrades
    : 0;

  const avgPnLValue = totalTrades > 0
    ? positions.reduce((sum, p) => sum + p.profitLoss, 0) / totalTrades
    : 0;

  const avgBars = totalTrades > 0
    ? Math.round(positions.reduce((sum, p) => sum + p.bars, 0) / totalTrades)
    : 0;

  const avgProfit = winners.length > 0
    ? winners.reduce((sum, p) => sum + p.profitLossPercent, 0) / winners.length
    : 0;

  const avgLoss = losers.length > 0
    ? losers.reduce((sum, p) => sum + p.profitLossPercent, 0) / losers.length
    : 0;

  useEffect(() => {
    if (!chartRef.current || positions.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const getThemeColor = (varName: string, fallback: string): string => {
      if (typeof window !== 'undefined') {
        const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        if (val) return val;
      }
      return fallback;
    };

    const colorProfitChart = getThemeColor('--color-profit-chart', '#26a69a');
    const colorLossChart = getThemeColor('--color-loss-chart', '#ef5350');

    // Define 13 bins from <-25% to >25%
    const bins = [
      { label: '<-25%', min: -Infinity, max: -25, count: 0, isWinner: false },
      { label: '-25%', min: -25, max: -20, count: 0, isWinner: false },
      { label: '-20%', min: -20, max: -15, count: 0, isWinner: false },
      { label: '-15%', min: -15, max: -10, count: 0, isWinner: false },
      { label: '-10%', min: -10, max: -5, count: 0, isWinner: false },
      { label: '-5%', min: -5, max: 0, count: 0, isWinner: false },
      { label: '0%', min: 0, max: 5, count: 0, isWinner: true },
      { label: '5%', min: 5, max: 10, count: 0, isWinner: true },
      { label: '10%', min: 10, max: 15, count: 0, isWinner: true },
      { label: '15%', min: 15, max: 20, count: 0, isWinner: true },
      { label: '20%', min: 20, max: 25, count: 0, isWinner: true },
      { label: '25%', min: 25, max: 30, count: 0, isWinner: true },
      { label: '>25%', min: 30, max: Infinity, count: 0, isWinner: true },
    ];

    positions.forEach(pos => {
      const roi = isNaN(pos.profitLossPercent) ? 0 : pos.profitLossPercent;
      for (const bin of bins) {
        if (roi >= bin.min && roi < bin.max) {
          bin.count++;
          break;
        }
      }
    });

    const chart = anychart.column();

    const chartData = bins.map(bin => ({
      x: bin.label,
      value: bin.count,
      isWinner: bin.isWinner
    }));

    const series = chart.column(chartData);

    series.fill(function(this: any) {
      return this.iterator.get('isWinner') ? colorProfitChart : colorLossChart;
    });
    series.stroke(function(this: any) {
      return this.iterator.get('isWinner') ? colorProfitChart : colorLossChart;
    });

    // Tooltip customization
    series.tooltip()
      .titleFormat('{%x} ROI Bin')
      .format('Trades: {%value}{decimalsCount:0}')
      .enabled(true);

    chart.padding(10, 0, 10, 0);
    chart.title(false);
    chart.legend().enabled(false);
    chart.yAxis().orientation('left');
    chart.yAxis().labels().position('inside');

    // Style borders and axes
    chart.yAxis().stroke('#e2e8f0');
    chart.xAxis().stroke('#e2e8f0');
    chart.yAxis().labels().format('{%value}{decimalsCount:0}');
    chart.xAxis().labels().rotation(0).fontSize(10).fontColor('#94a3b8');
    chart.yAxis().labels().fontSize(10).fontColor('#94a3b8');
    chart.yAxis().labels().offsetX(5);

    // Index mapping: index = 6 + (x / 5)
    const getMarkerIndex = (val: number): number => {
      if (val < -25) return 0;
      if (val >= 30) return 12;
      return 6 + val / 5;
    };

    // Draw average loss marker
    if (avgLoss < 0) {
      const idx = getMarkerIndex(avgLoss);
      const lossMarker = chart.lineMarker(0);
      lossMarker.layout('vertical');
      lossMarker.value(idx);
      lossMarker.stroke({ color: colorLossChart, dash: '3 3', width: 1.5 });
    }

    // Draw average profit marker
    if (avgProfit > 0) {
      const idx = getMarkerIndex(avgProfit);
      const profitMarker = chart.lineMarker(1);
      profitMarker.layout('vertical');
      profitMarker.value(idx);
      profitMarker.stroke({ color: colorProfitChart, dash: '3 3', width: 1.5 });
    }

    chart.container(chartRef.current);
    chart.draw();

    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [prices, trades]);

  if (totalTrades === 0) {
    return (
      <div className="trade-analysis-empty">
        <p>No trades executed to perform analysis.</p>
      </div>
    );
  }

  return (
    <div className="trade-analysis-container">
      <div className="trade-analysis-header">
        <div className="analysis-stat">
          <span className="stat-label">Average PnL</span>
          <span className={`stat-value ${avgPnLValue >= 0 ? 'positive' : 'negative'}`}>
            {avgPnLValue >= 0 ? '+' : ''}${avgPnLValue.toFixed(2)} ({avgPnLPercent.toFixed(2)}%)
          </span>
        </div>
        <div className="analysis-stat">
          <span className="stat-label">Average bars in trades</span>
          <span className="stat-value">{avgBars}</span>
        </div>
      </div>

      <div className="analysis-chart-title">ROI distribution</div>

      <div className="chart-canvas-wrapper">
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="trade-analysis-legend">
        <div className="legend-group">
          <span className="legend-item">
            <span className="dot dot-loser" /> Losers
          </span>
          <span className="legend-item">
            <span className="dot dot-winner" /> Winners
          </span>
        </div>
        <div className="legend-group">
          <span className="legend-item">
            <span className="line line-loser" /> Average loss <strong>{avgLoss.toFixed(2)}%</strong>
          </span>
          <span className="legend-item">
            <span className="line line-winner" /> Average profit <strong>{avgProfit.toFixed(2)}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
