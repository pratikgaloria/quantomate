import { FC, useEffect, useRef } from 'react';
import * as anychart from 'anychart';

interface IndicatorChartProps {
  data: Array<{
    date: Date | string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  activeIndicators: Array<{
    id: string;
    type: string;
    name: string;
    params: Record<string, any>;
    visible?: boolean;
  }>;
  indicatorData: Record<string, number[]>;
}

export const IndicatorChart: FC<IndicatorChartProps> = ({ data, activeIndicators, indicatorData }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Configure decimal count globally
    if (anychart && (anychart as any).format && (anychart as any).format.locales) {
      (anychart as any).format.locales.default.numberLocale.decimalsCount = 2;
      (anychart as any).format.locales.default.numberLocale.zeroFillDecimals = true;
    }

    // Dispose previous chart
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // Create stock chart
    const chart = anychart.stock();
    chart.padding(10, 15, 10, 15);

    // Create primary data table
    const mainTable = anychart.data.table();
    const mainRows = data.map(d => [
      new Date(d.date).getTime(),
      d.open,
      d.high,
      d.low,
      d.close,
      d.volume
    ]);
    mainTable.addData(mainRows);

    // Primary series mappings
    const ohlcMapping = mainTable.mapAs({
      open: 1,
      high: 2,
      low: 3,
      close: 4
    });

    // List of overlay vs separate indicators
    const overlayTypes = ['SMA', 'EMA', 'WMA', 'DEMA', 'TEMA', 'VWAP', 'AVWAP', 'BB'];
    const separateTypes = ['RSI', 'MACD', 'Stochastic', 'ATR', 'CCI', 'ROC', 'MOM', 'WilliamsR', 'RVOL', 'Slope', 'PivotTrend'];

    // Count active separate indicators
    const separateIndicators = activeIndicators.filter(ind => separateTypes.includes(ind.type));
    const numSeparate = separateIndicators.length;

    // Main plot height configuration
    let mainPlotHeight = '100%';
    let separatePlotHeight = '20%';

    if (numSeparate === 1) {
      mainPlotHeight = '80%';
      separatePlotHeight = '20%';
    } else if (numSeparate > 1) {
      mainPlotHeight = '70%';
      separatePlotHeight = `${Math.floor(30 / numSeparate)}%`;
    }

    // Main Plot (OHLC and overlays)
    const mainPlot = chart.plot(0);
    mainPlot.height(mainPlotHeight);

    // OHLC series
    const ohlcSeries = mainPlot.ohlc(ohlcMapping);
    ohlcSeries.name('Price');
    ohlcSeries.risingStroke('#26a69a', 1.5);
    ohlcSeries.fallingStroke('#ef5350', 1.5);

    // Track plot count
    let plotCount = 1;
    const colors = ['#2196f3', '#ff9800', '#9c27b0', '#e91e63', '#4caf50', '#009688', '#03a9f4', '#795548'];
    let colorIdx = 0;

    // Draw Overlay Indicators on Plot 0
    activeIndicators.forEach((ind) => {
      if (overlayTypes.includes(ind.type)) {
        // Skip hidden indicators
        if (ind.visible === false) {
          colorIdx++;
          return;
        }
        const key = ind.id;
        const color = colors[colorIdx % colors.length];
        colorIdx++;

        if (ind.type === 'BB') {
          // Upper band
          const upperVals = indicatorData[key + '_upper'];
          if (upperVals) {
            const upTable = anychart.data.table();
            upTable.addData(data.map((d, i) => [new Date(d.date).getTime(), upperVals[i]]));
            const upSeries = mainPlot.line(upTable.mapAs({ value: 1 }));
            upSeries.name(`${ind.name} Upper`).stroke({ color, dash: '2 2', width: 1.5 });
          }
          // Middle band
          const middleVals = indicatorData[key + '_middle'];
          if (middleVals) {
            const midTable = anychart.data.table();
            midTable.addData(data.map((d, i) => [new Date(d.date).getTime(), middleVals[i]]));
            const midSeries = mainPlot.line(midTable.mapAs({ value: 1 }));
            midSeries.name(`${ind.name} Middle`).stroke({ color, width: 1 });
          }
          // Lower band
          const lowerVals = indicatorData[key + '_lower'];
          if (lowerVals) {
            const lowTable = anychart.data.table();
            lowTable.addData(data.map((d, i) => [new Date(d.date).getTime(), lowerVals[i]]));
            const lowSeries = mainPlot.line(lowTable.mapAs({ value: 1 }));
            lowSeries.name(`${ind.name} Lower`).stroke({ color, dash: '2 2', width: 1.5 });
          }
        } else {
          // Simple overlay lines: SMA, EMA, WMA, DEMA, TEMA, VWAP, AVWAP
          const vals = indicatorData[key];
          if (vals) {
            const indTable = anychart.data.table();
            indTable.addData(data.map((d, i) => [new Date(d.date).getTime(), vals[i]]));
            const lineSeries = mainPlot.line(indTable.mapAs({ value: 1 }));
            lineSeries.name(ind.name).stroke(color, 1.5);
          }
        }
      }
    });

    // Draw Separate-Pane Indicators
    activeIndicators.forEach((ind) => {
      if (separateTypes.includes(ind.type)) {
        const key = ind.id;
        const color = colors[colorIdx % colors.length];
        colorIdx++;

        // Add a new plot pane (always allocate to preserve layout)
        const panePlot = chart.plot(plotCount);
        panePlot.height(separatePlotHeight);
        plotCount++;

        // Skip hidden indicators — pane is kept but no series drawn
        if (ind.visible === false) return;

        if (ind.type === 'RSI') {
          const vals = indicatorData[key];
          if (vals) {
            const rsiTable = anychart.data.table();
            rsiTable.addData(data.map((d, i) => [new Date(d.date).getTime(), vals[i]]));
            const rsiSeries = panePlot.line(rsiTable.mapAs({ value: 1 }));
            rsiSeries.name(ind.name).stroke('#9c27b0', 1.5);
            
            // Fixed levels 0-100 and line markers
            panePlot.yScale().minimum(0).maximum(100);
            
            const m30 = panePlot.lineMarker(0);
            m30.value(30);
            m30.stroke({ color: 'rgba(0, 0, 0, 0.15)', dash: '2 2' });
            
            const m70 = panePlot.lineMarker(1);
            m70.value(70);
            m70.stroke({ color: 'rgba(0, 0, 0, 0.15)', dash: '2 2' });
          }
        } else if (ind.type === 'Stochastic') {
          const kVals = indicatorData[key + '_k'];
          const dVals = indicatorData[key + '_d'];
          
          if (kVals) {
            const kTable = anychart.data.table();
            kTable.addData(data.map((d, i) => [new Date(d.date).getTime(), kVals[i]]));
            const kSeries = panePlot.line(kTable.mapAs({ value: 1 }));
            kSeries.name(`${ind.name} %K`).stroke('#2196f3', 1.5);
          }
          if (dVals) {
            const dTable = anychart.data.table();
            dTable.addData(data.map((d, i) => [new Date(d.date).getTime(), dVals[i]]));
            const dSeries = panePlot.line(dTable.mapAs({ value: 1 }));
            dSeries.name(`${ind.name} %D`).stroke('#ff9800', 1.5);
          }
          
          panePlot.yScale().minimum(0).maximum(100);
          
          const m20 = panePlot.lineMarker(0);
          m20.value(20);
          m20.stroke({ color: 'rgba(0, 0, 0, 0.15)', dash: '2 2' });
          
          const m80 = panePlot.lineMarker(1);
          m80.value(80);
          m80.stroke({ color: 'rgba(0, 0, 0, 0.15)', dash: '2 2' });
        } else if (ind.type === 'MACD') {
          const macdVals = indicatorData[key];
          const signalVals = indicatorData[key + '_signal'];
          const histVals = indicatorData[key + '_hist'];

          if (histVals) {
            const histTable = anychart.data.table();
            histTable.addData(data.map((d, i) => [new Date(d.date).getTime(), histVals[i]]));
            const histSeries = panePlot.column(histTable.mapAs({ value: 1 }));
            histSeries.name(`${ind.name} Hist`).fill((point: any) => {
              return point.value >= 0 ? 'rgba(38, 166, 154, 0.6)' : 'rgba(239, 83, 80, 0.6)';
            }).stroke(null);
          }

          if (macdVals) {
            const macdTable = anychart.data.table();
            macdTable.addData(data.map((d, i) => [new Date(d.date).getTime(), macdVals[i]]));
            const macdSeries = panePlot.line(macdTable.mapAs({ value: 1 }));
            macdSeries.name(`${ind.name} MACD`).stroke('#2196f3', 1.5);
          }

          if (signalVals) {
            const sigTable = anychart.data.table();
            sigTable.addData(data.map((d, i) => [new Date(d.date).getTime(), signalVals[i]]));
            const sigSeries = panePlot.line(sigTable.mapAs({ value: 1 }));
            sigSeries.name(`${ind.name} Signal`).stroke('#ff9800', 1.5);
          }
        } else if (ind.type === 'WilliamsR') {
          const vals = indicatorData[key];
          if (vals) {
            const wrTable = anychart.data.table();
            wrTable.addData(data.map((d, i) => [new Date(d.date).getTime(), vals[i]]));
            const wrSeries = panePlot.line(wrTable.mapAs({ value: 1 }));
            wrSeries.name(ind.name).stroke('#e91e63', 1.5);
            
            panePlot.yScale().minimum(-100).maximum(0);
            
            const m20 = panePlot.lineMarker(0);
            m20.value(-20);
            m20.stroke({ color: 'rgba(0, 0, 0, 0.15)', dash: '2 2' });
            
            const m80 = panePlot.lineMarker(1);
            m80.value(-80);
            m80.stroke({ color: 'rgba(0, 0, 0, 0.15)', dash: '2 2' });
          }
        } else if (ind.type === 'RVOL') {
          const vals = indicatorData[key];
          if (vals) {
            const rvolTable = anychart.data.table();
            rvolTable.addData(data.map((d, i) => [new Date(d.date).getTime(), vals[i]]));
            const rvolSeries = panePlot.column(rvolTable.mapAs({ value: 1 }));
            rvolSeries.name(ind.name).fill('rgba(33, 150, 243, 0.5)').stroke(null);
          }
        } else if (ind.type === 'PivotTrend') {
          const vals = indicatorData[key];
          if (vals) {
            const pivotTable = anychart.data.table();
            pivotTable.addData(data.map((d, i) => [new Date(d.date).getTime(), vals[i]]));
            const pivotSeries = panePlot.stepLine(pivotTable.mapAs({ value: 1 }));
            pivotSeries.name(ind.name).stroke('#009688', 2);
            panePlot.yScale().minimum(-1.2).maximum(1.2);
          }
        } else {
          // Simple oscillator lines: ATR, CCI, ROC, MOM, Slope
          const vals = indicatorData[key];
          if (vals) {
            const oscTable = anychart.data.table();
            oscTable.addData(data.map((d, i) => [new Date(d.date).getTime(), vals[i]]));
            const oscSeries = panePlot.line(oscTable.mapAs({ value: 1 }));
            oscSeries.name(ind.name).stroke(color, 1.5);
          }
        }
      }
    });

    // Share x-axis zoom state among all plots
    mainPlot.xAxis(true);
    for (let i = 0; i < plotCount; i++) {
      chart.plot(i).xAxis(i === plotCount - 1); // Only enable xAxis labels on bottom plot
    }

    // Set container and draw
    chart.container(chartRef.current);
    chart.draw();

    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data, activeIndicators, indicatorData]);

  return (
    <div className="chart-container">
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
