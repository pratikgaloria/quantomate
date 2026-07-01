import React, { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  children,
  className = '',
  ...props
}) => {
  const selectClass = cn(
    "flex w-full appearance-none border border-slate-300 dark:border-slate-700 bg-background px-[0.65rem] py-[0.55rem] pr-8 text-[0.8rem] text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    error ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive" : "",
    className
  );

  const selectElement = (
    <div className="relative w-full">
      <select className={selectClass} {...props}>
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 dark:text-slate-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  if (label) {
    return (
      <div className="mb-3">
        <label className="block text-xs font-medium text-muted-foreground/80 mb-1">
          {label}
        </label>
        {selectElement}
        {error && <span className="block text-[0.7rem] text-destructive mt-[0.2rem]">{error}</span>}
      </div>
    );
  }

  return selectElement;
};
