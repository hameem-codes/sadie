import React from 'react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'filter' | 'suggestion';
}

export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  count,
  icon,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-[13px] font-medium rounded-pill whitespace-nowrap shrink-0 transition-all duration-200 select-none hover-lift focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 cursor-pointer';

  const stateStyles = active
    ? 'bg-btn-primary-bg text-btn-primary-text font-semibold shadow-sm border border-transparent'
    : 'bg-elevated text-secondary border border-border-hairline hover:text-primary hover:border-border-subtle hover:bg-elevated-hover';

  const suggestionStyles = 'bg-surface text-secondary border border-border-hairline hover:border-border-subtle hover:text-primary text-sm py-1.5 px-3.5';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${variant === 'suggestion' ? suggestionStyles : stateStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {typeof count === 'number' && (
        <span
          className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none ${
            active ? 'bg-base text-primary' : 'bg-surface text-muted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
