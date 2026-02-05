import React, { useState } from 'react';
import './CollapsibleSection.scss';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`collapsible-section ${isExpanded ? 'expanded' : 'collapsed'} ${className}`}>
      <h3 onClick={() => setIsExpanded(!isExpanded)} className="collapsible-header">
        {title}
        <span className="arrow">▼</span>
      </h3>

      {isExpanded && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
};
