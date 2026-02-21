import React, { useEffect, useRef } from 'react';
import * as anychart from 'anychart';
import { ChartCard } from '../components/ChartCard';
import './DashboardPage.scss';

// --- Balance Chart Component ---
const BalanceChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.dispose();

    // Mock data
    const data = [
      ['Jan', 10000, 12000],
      ['Feb', 12000, 13200],
      ['Mar', 11500, 12800],
      ['Apr', 13000, 14500],
      ['May', 15000, 16000],
      ['Jun', 15750, 17500],
      ['Jul', 16000, 17800],
    ];

    const chart = anychart.area();

    // Configure Series 1 (Invested)
    const series1 = chart.area(data.map(d => [d[0], d[1]]));
    series1.name('Invested');
    series1.stroke('2 #93c5fd');
    series1.fill('#bfdbfe 0.5');
    series1.hovered().stroke('3 #60a5fa').markers().enabled(true);

    // Configure Series 2 (Current Value)
    const series2 = chart.area(data.map(d => [d[0], d[2]]));
    series2.name('Current Value');
    series2.stroke('3 #3b82f6');
    series2.fill('#dbeafe 0.3');
    series2.hovered().stroke('4 #2563eb').markers().enabled(true);

    // General Chart Settings
    chart.yAxis().labels().format('${%value}{groupsSeparator:,}');
    chart.xAxis().labels().fontColor('#9ca3af');
    chart.yAxis().labels().fontColor('#9ca3af');

    // Tooltip
    chart.tooltip().format('${%value}{groupsSeparator:,}');
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);

    // Legend
    chart.legend().enabled(false);

    // Padding
    chart.padding(10, 20, 5, 0);

    // Remove background/border
    chart.background().fill('transparent');

    chart.container(chartRef.current);
    chart.draw();
    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) chartInstance.current.dispose();
    };
  }, []);

  return <div ref={chartRef} className="chart-container" />;
};

// --- Allocation Chart Component ---
const AllocationChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.dispose();

    const data = [
      { x: 'Stocks', value: 65, fill: '#4f46e5' },
      { x: 'Bonds', value: 20, fill: '#818cf8' },
      { x: 'Cash', value: 10, fill: '#c7d2fe' },
      { x: 'Crypto', value: 5, fill: '#e0e7ff' },
    ];

    const chart = anychart.pie(data);

    // Donut configuration
    chart.innerRadius('60%');

    // Remove labels/connector lines to keep it clean like the screenshot
    chart.labels().enabled(false);
    chart.connectorStroke(null);

    // Tooltip
    chart.tooltip().format('{%value}%');

    // Legend
    chart.legend().enabled(false);

    // Padding
    chart.padding(10);

    // Remove background
    chart.background().fill('transparent');

    chart.container(chartRef.current);
    chart.draw();
    chartInstance.current = chart;

    return () => {
      if (chartInstance.current) chartInstance.current.dispose();
    };
  }, []);

  return <div ref={chartRef} className="chart-container" />;
};


export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        {/* Card 1: Balance History */}
        <ChartCard
          title="Balance"
          topContent={
            <div className="value-display">
              <div className="main-value">$20,245</div>
              <div className="sub-value">
                <span className="percentage positive">↑ 12%</span> vs last year
              </div>
              <div className="sub-value" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Invested: $15,750
              </div>
            </div>
          }
        >
          <BalanceChart />
        </ChartCard>

        {/* Card 2: Asset Allocation */}
        <ChartCard
          title="Allocation"
          bottomContent={
            <div className="allocation-footer">
               <div className="stat-item">
                 <span className="dot" style={{ background: '#4f46e5' }}></span>
                 <span className="label">Stocks</span>
                 <span className="value">65%</span>
               </div>
               <div className="stat-item">
                 <span className="dot" style={{ background: '#818cf8' }}></span>
                 <span className="label">Bonds</span>
                 <span className="value">20%</span>
               </div>
               <div className="stat-item">
                 <span className="dot" style={{ background: '#c7d2fe' }}></span>
                 <span className="label">Cash</span>
                 <span className="value">10%</span>
               </div>
               <div className="stat-item">
                 <span className="dot" style={{ background: '#e0e7ff' }}></span>
                 <span className="label">Crypto</span>
                 <span className="value">5%</span>
               </div>
            </div>
          }
        >
          <AllocationChart />
        </ChartCard>
      </div>
    </div>
  );
}
