import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  extra,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "border border-input bg-card text-card-foreground flex flex-col p-4",
        className
      )}
      style={{ borderRadius: 0 }}
      {...props}
    >
      {(title || extra) && (
        <div className="flex items-center justify-between pb-3 min-h-[2.5rem]">
          {title && (
            <div className="text-[0.95rem] font-semibold text-foreground tracking-normal normal-case">
              {title}
            </div>
          )}
          {extra && (
            <div className="flex items-center gap-2">
              {extra}
            </div>
          )}
        </div>
      )}
      <div className="flex-1 min-h-0 w-full">
        {children}
      </div>
    </div>
  );
};
