import React, { ReactNode } from 'react';
import './ChartCard.scss';

interface ChartCardProps {
  title: string;
  options?: ReactNode;
  topContent?: ReactNode;
  children: ReactNode;
  bottomContent?: ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  options,
  topContent,
  children,
  bottomContent,
  className = '',
}) => {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
        <div className="chart-card-options">
          {options || <button className="options-btn"><i className="la la-ellipsis-h"></i></button>}
        </div>
      </div>

      {topContent && <div className="chart-card-top-content">{topContent}</div>}

      <div className="chart-card-content">
        {children}
      </div>

      {bottomContent && <div className="chart-card-bottom-content">{bottomContent}</div>}
    </div>
  );
};
