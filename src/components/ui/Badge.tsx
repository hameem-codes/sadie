import React, { memo } from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'subtle' | 'solid' | 'accent' | 'forest' | 'terracotta' | 'indigo';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

/**
 * Badge / Eyebrow Pill component
 * Implements Design System Section 6: Pill-shaped status indicator with transparent or subtle fills.
 */
export const Badge: React.FC<BadgeProps> = memo(({
  children,
  className = '',
  variant = 'subtle',
  size = 'sm',
  icon,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-medium tracking-wide',
    md: 'text-xs px-3 py-1 gap-2 font-medium tracking-wide'
  };

  const variantStyles = {
    // Design System Section 6: Transparent fill, 1px border-subtle, white text
    subtle: 'bg-transparent text-primary border border-border-subtle/80 backdrop-blur-sm',
    solid: 'bg-elevated text-secondary border border-border-hairline',
    accent: 'bg-white/10 text-white border border-white/30',
    forest: 'bg-illustration-forest/20 text-[#a3ffb2] border border-illustration-forest/40',
    terracotta: 'bg-illustration-terracotta/20 text-[#ffd5c5] border border-illustration-terracotta/40',
    indigo: 'bg-illustration-indigo/50 text-[#b5b4f8] border border-[#484672]'
  };

  return (
    <div
      className={`inline-flex items-center rounded-pill select-none uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </div>
  );
});

Badge.displayName = 'Badge';
