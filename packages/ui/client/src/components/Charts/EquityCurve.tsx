import { FC, useEffect, useRef } from 'react';
import * as anychart from 'anychart';

interface EquityCurveProps {
  data: Array<{
    date: Date | string;
    value: number;
  }>;
  initialCapital: number;
  selectedTrade?: {
    entryDate: Date | string;
    exitDate: Date | string;
  } | null;
}

export const EquityCurve: FC<EquityCurveProps> = ({ data, initialCapital, selectedTrade }) => {
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

    {
      const data = localData;

      // Configure decimal count globally
      if (anychart && (anychart as any).format && (anychart as any).format.locales) {
        (anychart as any).format.locales.default.numberLocale.decimalsCount = 2;
        (anychart as any).format.locales.default.numberLocale.zeroFillDecimals = true;
      }

      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // Prepare equity data as percentage returns relative to initial capital
      const equityData = data.map(d => [
        new Date(d.date).getTime(),
        initialCapital > 0 ? ((d.value - initialCapital) / initialCapital) * 100 : 0
      ]);

      // Create stock chart
      const chart = anychart.stock();
      const plot = chart.plot(0);
      plot.height('100%');

      // Create line series
      const series = plot.line(equityData);
      series.name('Return');
      series.stroke('#2196f3', 2);

      // Add baseline at 0%
      plot.lineMarker()
        .value(0)
        .stroke('#9e9e9e', 1, '5 5');

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
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data, initialCapital]);

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
  }, [selectedTrade, data, initialCapital]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};
