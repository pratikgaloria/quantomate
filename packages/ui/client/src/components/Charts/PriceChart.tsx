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
  trades?: Array<{
    type: 'entry' | 'exit';
    tradedValue: number;
    date: Date | string;
  }>;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, trades }) => {
  const chartContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainer.current || !data.length) return;

    // Create data table
    const table = anychart.data.table('date');

    // Map data to array of arrays
    const formattedData = data.map(item => [
      new Date(item.date).getTime(),
      item.open,
      item.high,
      item.low,
      item.close
    ]);

    table.addData(formattedData);

    // Create chart
    const mapping = table.mapAs({
      open: 1,
      high: 2,
      low: 3,
      close: 4
    });

    const chart = anychart.stock();
    const plot = chart.plot(0);
    plot.ohlc(mapping).name('Price');

    // Add trades markers if available
    if (trades && trades.length > 0) {
      const markersData = trades.map(trade => ({
        date: new Date(trade.date).getTime(),
        type: trade.type,
        price: trade.tradedValue,
        description: `${trade.type.toUpperCase()} @ ${trade.tradedValue}`
      }));
      
      const markersTable = anychart.data.table('date');
      markersTable.addData(markersData.map(m => [m.date, m.type, m.price, m.description]));

      const markersMapping = markersTable.mapAs({
        value: 2,
        type: 1,
        desc: 3
      });

      const markers = plot.marker(markersMapping);
      markers.name('Trades');
      markers.type('circle');
      markers.size(4);
      markers.fill(function(this: any) {
        const type = this.getData('type');
        return type === 'entry' ? '#4caf50' : '#f44336';
      });
      markers.stroke('none');

      // Tooltip for markers
      markers.tooltip().format(function(this: any) {
         return this.getData('desc');
      });
    }

    chart.container(chartContainer.current);
    chart.draw();

    return () => {
      chart.dispose();
    };
  }, [data, trades]);

  return (
    <div className="chart-container">
      <div ref={chartContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
