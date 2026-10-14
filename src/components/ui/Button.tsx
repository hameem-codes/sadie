import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  pill?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Button component
 * Implements the editorial pill aesthetic with subtle hover lifts and tactile states.
 * - Primary: high-contrast solid white with dark text.
 * - Secondary: subtle elevated dark surface.
 * - Outline / Ghost: minimal hairline framing.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  pill = true,
  icon,
  iconPosition = 'right',
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none hover-lift';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-2', // Standardized gap-2 per Issue #6
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    icon: 'p-2 w-9 h-9 gap-0 aspect-square'
  };

  const variantStyles = {
    // Primary: white fill, dark text #0A0A0A per Design System Section 6 & 9
    primary: 'bg-white text-black hover:bg-white/90 active:bg-white/80 shadow-sm font-medium',
    // Secondary: dark elevated surface
    secondary: 'bg-elevated text-primary border border-white/10 hover:bg-elevated-hover hover:border-white/20 active:bg-surface',
    // Outline: subtle border hairline
    outline: 'bg-transparent text-primary border border-border-subtle hover:bg-elevated hover:border-white/40 active:bg-surface',
    // Ghost: transparent
    ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-elevated/70 active:bg-elevated',
    // Danger
    danger: 'bg-status-failed/20 text-status-failed border border-status-failed/40 hover:bg-status-failed/30 active:bg-status-failed/40'
  };

  const radiusStyle = pill ? 'rounded-pill' : 'rounded-md';

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${radiusStyle} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
