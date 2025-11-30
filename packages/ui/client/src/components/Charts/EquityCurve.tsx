import React, { useEffect, useRef } from 'react';
import * as anychart from 'anychart';

interface EquityCurveProps {
  data: Array<{
    date: Date | string;
    value: number;
  }>;
  initialCapital: number;
}

export const EquityCurve: React.FC<EquityCurveProps> = ({ data, initialCapital }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // Prepare equity data
    const equityData = data.map(d => [
      new Date(d.date).getTime(),
      d.value
    ]);

    // Create stock chart
    const chart = anychart.stock();
    const plot = chart.plot(0);
    plot.height('100%');

    // Create line series
    const series = plot.line(equityData);
    series.name('Equity');
    series.stroke('#2196f3', 2);

    // Add baseline at initial capital
    plot.lineMarker()
      .value(initialCapital)
      .stroke('#9e9e9e', 1, '5 5');

    // Configure chart
    chart.title('Equity Curve');
    plot.yAxis().title('Capital ($)');
    plot.yAxis().labels().format('${%value}{decimalsCount:2}');

    chart.container(chartRef.current);
    chart.draw();

    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data, initialCapital]);

  return <div ref={chartRef} style={{ width: '100%', height: '800px' }} />;
};
