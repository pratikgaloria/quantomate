import { FC, useEffect, useRef } from 'react';
import * as anychart from 'anychart';

interface PriceChartProps {
  data: Array<{
    date: Date | string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  trades: Array<{
    date: Date | string;
    type: 'entry' | 'exit';
    price: number;
    exitReason?: 'stop-loss' | 'take-profit' | 'strategy';
  }>;
  selectedTrade?: {
    entryDate: Date | string;
    exitDate: Date | string;
  } | null;
}

export const PriceChart: FC<PriceChartProps> = ({ data, trades, selectedTrade }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Shift timestamps to browser local time to bypass anychart default UTC interpretation
    const localData = data.map(d => {
      const dObj = new Date(d.date);
      const shifted = dObj.getTime() - (dObj.getTimezoneOffset() * 60 * 1000);
      return { ...d, date: new Date(shifted) };
    });

    const localTrades = trades.map(t => {
      const dObj = new Date(t.date);
      const shifted = dObj.getTime() - (dObj.getTimezoneOffset() * 60 * 1000);
      return { ...t, date: new Date(shifted) };
    });

    {
      const data = localData;
      const trades = localTrades;

      // Configure decimal count globally
      if (anychart && (anychart as any).format && (anychart as any).format.locales) {
        (anychart as any).format.locales.default.numberLocale.decimalsCount = 2;
        (anychart as any).format.locales.default.numberLocale.zeroFillDecimals = true;
      }

      // Dispose previous chart
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // Pair trades into positions with P&L
      const positions: Array<{
        entryDate: number;
        exitDate: number;
        profit: number;
      }> = [];

      for (let i = 0; i < trades.length; i++) {
        if (trades[i].type === 'entry' && i + 1 < trades.length && trades[i + 1].type === 'exit') {
          const entryTrade = trades[i];
          const exitTrade = trades[i + 1];
          const profit = exitTrade.price - entryTrade.price;
          
          positions.push({
            entryDate: new Date(entryTrade.date).getTime(),
            exitDate: new Date(exitTrade.date).getTime(),
            profit,
          });
          i++; // Skip exit trade
        }
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
      const colorProfit = getThemeColor('--color-profit', '#10b981');
      const colorExitSL = getThemeColor('--color-exit-sl', '#b91c1c');
      const colorExitTP = getThemeColor('--color-exit-tp', '#1d4ed8');
      const colorExitStrat = getThemeColor('--color-exit-strat', '#c2410c');

      // Prepare OHLC data with colors based on trade P&L
      const ohlcData = data.map(d => {
        const timestamp = new Date(d.date).getTime();
        
        // Find if this candle is within a trade period
        let color = null;
        for (const pos of positions) {
          if (timestamp >= pos.entryDate && timestamp <= pos.exitDate) {
            color = pos.profit >= 0 ? colorProfitChart : colorLossChart;
            break;
          }
        }

        return {
          x: timestamp,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          fill: color,
          stroke: color,
        };
      });

      // Create stock chart
      const chart = anychart.stock();
      
      // Create plot
      const plot = chart.plot(0);
      plot.height('100%');

      // Create OHLC series
      const ohlcSeries = plot.ohlc(ohlcData.map(d => [d.x, d.open, d.high, d.low, d.close]));
      ohlcSeries.name('Price');
      
      // Style OHLC with custom colors
      ohlcSeries.risingStroke(function(this: any) {
        const point = this as any;
        const dataItem = ohlcData.find(d => d.x === point.x);
        return dataItem?.stroke || colorProfitChart;
      }, 1);
      
      ohlcSeries.fallingStroke(function(this: any) {
        const point = this as any;
        const dataItem = ohlcData.find(d => d.x === point.x);
        return dataItem?.stroke || colorLossChart;
      }, 1);

      // Add entry markers
      const entryTrades = trades.filter(t => t.type === 'entry');
      if (entryTrades.length > 0) {
        const entryData = entryTrades.map(t => [
          new Date(t.date).getTime(),
          t.price
        ]);
        const entryMarkers = plot.marker(entryData);
        entryMarkers.name('Entry');
        entryMarkers.type('triangle-up');
        entryMarkers.fill(colorProfit);
        entryMarkers.stroke(null);
        entryMarkers.size(7);
        entryMarkers.tooltip().enabled(false);
      }

      // Add exit markers (grouped by exit reason to avoid creating multiple series)
      const exitTrades = trades.filter(t => t.type === 'exit');
      
      const exitReasons: Array<'stop-loss' | 'take-profit' | 'strategy'> = ['stop-loss', 'take-profit', 'strategy'];
      const exitColors = {
        'stop-loss': colorExitSL,
        'take-profit': colorExitTP,
        'strategy': colorExitStrat
      };
      const exitNames = {
        'stop-loss': 'Stop-Loss Exit',
        'take-profit': 'Take-Profit Exit',
        'strategy': 'Strategy Exit'
      };

      exitReasons.forEach(reason => {
        const reasonTrades = exitTrades.filter(t => t.exitReason === reason || (!t.exitReason && reason === 'strategy'));
        if (reasonTrades.length > 0) {
          const exitData = reasonTrades.map(t => [
            new Date(t.date).getTime(),
            t.price
          ]);
          const exitMarker = plot.marker(exitData);
          exitMarker.name(exitNames[reason]);
          exitMarker.type('triangle-down');
          const color = exitColors[reason];
          exitMarker.fill(color);
          exitMarker.stroke(null);
          exitMarker.size(7);
          exitMarker.tooltip().enabled(false);
        }
      });

      // Configure chart formatting
      chart.padding(10, 0, 10, 0);
      chart.scroller().enabled(false);
      plot.legend().enabled(false);
      plot.yAxis().orientation('left');
      plot.yAxis().labels().position('inside');
      plot.yAxis().labels().format('${%value}{decimalsCount:0}');
      plot.yAxis().labels().fontSize(10).fontColor('#94a3b8');
      plot.yAxis().labels().offsetX(5);
      plot.yAxis().stroke('#e2e8f0');

      // Set container and draw
      chart.container(chartRef.current);
      chart.draw();

      chartInstance.current = chart;
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data, trades]);

  // Update range marker dynamically when selectedTrade changes
  useEffect(() => {
    if (!chartInstance.current) return;
    const plot = chartInstance.current.plot(0);
    if (!plot) return;

    const rangeMarker = plot.rangeMarker(0);

    const localSelectedTrade = selectedTrade ? {
      entryDate: new Date(new Date(selectedTrade.entryDate).getTime() - (new Date(selectedTrade.entryDate).getTimezoneOffset() * 60 * 1000)),
      exitDate: new Date(new Date(selectedTrade.exitDate).getTime() - (new Date(selectedTrade.exitDate).getTimezoneOffset() * 60 * 1000)),
    } : null;

    {
      const selectedTrade = localSelectedTrade;
      if (selectedTrade) {
        rangeMarker.layout('vertical');
        rangeMarker.axis(plot.xAxis()); // Bind to timeline X-axis!
        rangeMarker.from(new Date(selectedTrade.entryDate).getTime());
        rangeMarker.to(new Date(selectedTrade.exitDate).getTime());
        rangeMarker.fill("rgba(148, 163, 184, 0.15)");
        rangeMarker.enabled(true);
      } else {
        rangeMarker.enabled(false);
      }
    }
  }, [selectedTrade, data, trades]);

  return (
    <div className="chart-container">
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
