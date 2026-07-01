import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}) => {
  const inputClass = cn(
    "flex w-full border border-slate-300 dark:border-slate-700 bg-background px-[0.65rem] py-[0.55rem] text-[0.8rem] text-foreground transition-colors file:border-0 file:bg-transparent file:text-[0.8rem] file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    error ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive" : "",
    className
  );

  const inputElement = <input type={type} className={inputClass} {...props} />;

  if (label) {
    return (
      <div className="mb-3">
        <label className="block text-xs font-medium text-muted-foreground/80 mb-1">
          {label}
        </label>
        {inputElement}
        {error && <span className="block text-[0.7rem] text-destructive mt-[0.2rem]">{error}</span>}
      </div>
    );
  }

  return inputElement;
};
