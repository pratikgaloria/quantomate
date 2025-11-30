import React, { useEffect, useRef } from 'react';
import * as anychart from 'anychart';

interface DrawdownChartProps {
  equityData: Array<{
    date: Date | string;
    value: number;
  }>;
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ equityData }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || equityData.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // Calculate drawdown
    let peak = equityData[0].value;
    const drawdownData = equityData.map(d => {
      if (d.value > peak) peak = d.value;
      const drawdown = ((d.value - peak) / peak) * 100;
      return [new Date(d.date).getTime(), drawdown];
    });

    // Create chart
    const chart = anychart.stock();
    const plot = chart.plot(0);
    plot.height('100%');

    // Create area series
    const series = plot.area(drawdownData);
    series.name('Drawdown');
    series.fill('#ef5350 0.3');
    series.stroke('#ef5350', 2);

    // Configure chart
    chart.title('Drawdown');
    plot.yAxis().title('Drawdown (%)');
    plot.yAxis().labels().format('{%value}{decimalsCount:2}%');

    chart.container(chartRef.current);
    chart.draw();

    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [equityData]);

  return <div ref={chartRef} style={{ width: '100%', height: '800px' }} />;
};
