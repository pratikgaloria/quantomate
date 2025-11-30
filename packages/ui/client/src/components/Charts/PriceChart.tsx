import React, { useEffect, useRef } from 'react';
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
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, trades }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

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

    // Prepare OHLC data with colors based on trade P&L
    const ohlcData = data.map(d => {
      const timestamp = new Date(d.date).getTime();
      
      // Find if this candle is within a trade period
      let color = null;
      for (const pos of positions) {
        if (timestamp >= pos.entryDate && timestamp <= pos.exitDate) {
          color = pos.profit >= 0 ? '#26a69a' : '#ef5350';
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
    ohlcSeries.risingStroke(function() {
      const point = this as any;
      const dataItem = ohlcData.find(d => d.x === point.x);
      return dataItem?.stroke || '#26a69a';
    }, 1);
    
    ohlcSeries.fallingStroke(function() {
      const point = this as any;
      const dataItem = ohlcData.find(d => d.x === point.x);
      return dataItem?.stroke || '#ef5350';
    }, 1);

    // Add entry markers
    const entryTrades = trades.filter(t => t.type === 'entry');
    if (entryTrades.length > 0) {
      const entryData = entryTrades.map(t => [
        new Date(t.date).getTime(),
        t.price
      ]);
      const entryMarkers = plot.marker(entryData);
      entryMarkers.type('arrow-up');
      entryMarkers.fill('#4caf50');
      entryMarkers.stroke('#4caf50', 2);
      entryMarkers.size(10);
    }

    // Add exit markers (color-coded by reason)
    const exitTrades = trades.filter(t => t.type === 'exit');
    exitTrades.forEach(trade => {
      const color = trade.exitReason === 'stop-loss' ? '#f44336' :
                    trade.exitReason === 'take-profit' ? '#2196f3' :
                    '#ff9800';
      
      const exitData = [[new Date(trade.date).getTime(), trade.price]];
      const exitMarker = plot.marker(exitData);
      exitMarker.type('arrow-down');
      exitMarker.fill(color);
      exitMarker.stroke(color, 2);
      exitMarker.size(10);
    });

    // Configure chart with 2 decimal formatting
    chart.title('Price Chart with Trade Markers');
    plot.yAxis().title('Price ($)');
    plot.yAxis().labels().format('${%value}{decimalsCount:2}');

    // Set container and draw
    chart.container(chartRef.current);
    chart.draw();

    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data, trades]);

  return <div ref={chartRef} style={{ width: '100%', height: '800px' }} />;
};
