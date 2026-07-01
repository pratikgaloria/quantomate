import { FC, useEffect, useRef } from 'react';
import * as anychart from 'anychart';

interface DrawdownChartProps {
  equityData: Array<{
    date: Date | string;
    value: number;
  }>;
  selectedTrade?: {
    entryDate: Date | string;
    exitDate: Date | string;
  } | null;
}

export const DrawdownChart: FC<DrawdownChartProps> = ({ equityData, selectedTrade }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || equityData.length === 0) return;

    // Configure decimal count globally
    if (anychart && (anychart as any).format && (anychart as any).format.locales) {
      (anychart as any).format.locales.default.numberLocale.decimalsCount = 2;
      (anychart as any).format.locales.default.numberLocale.zeroFillDecimals = true;
    }

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
    chart.padding(10, 0, 10, 0);
    chart.scroller().enabled(false);
    plot.legend().enabled(false);
    plot.yAxis().orientation('left');
    plot.yAxis().labels().position('inside');
    plot.yAxis().labels().format('{%value}{decimalsCount:0}%');
    plot.yAxis().labels().fontSize(10).fontColor('#94a3b8');
    plot.yAxis().labels().offsetX(5);
    plot.yAxis().stroke('#e2e8f0');

    chart.container(chartRef.current);
    chart.draw();

    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [equityData]);

  // Update range marker dynamically when selectedTrade changes
  useEffect(() => {
    if (!chartInstance.current) return;
    const plot = chartInstance.current.plot(0);
    if (!plot) return;

    const rangeMarker = plot.rangeMarker(0);
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
  }, [selectedTrade, equityData]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};
