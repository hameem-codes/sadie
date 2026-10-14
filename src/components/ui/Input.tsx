import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  icon,
  trailingIcon,
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full bg-surface border border-border-hairline text-primary placeholder-muted text-sm rounded-md transition-all duration-200 py-2.5 ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${trailingIcon ? 'pr-10' : 'pr-3.5'} focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-status-failed focus:border-status-failed focus:ring-status-failed' : ''
          } ${className}`}
          {...props}
        />
        {trailingIcon && (
          <div className="absolute right-3 flex items-center text-muted">
            {trailingIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-status-failed">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
