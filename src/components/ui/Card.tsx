import React, { memo } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'subtle';
  radius?: 'md' | 'lg' | 'frame';
  hoverable?: boolean;
}

/**
 * Card / Container component
 * Implements lightweight editorial framing using delicate border-hairlines and low-opacity backgrounds.
 * Avoids heavy skeuomorphic box shadows or generic AI-template card styling.
 */
export const Card: React.FC<CardProps> = memo(({
  children,
  className = '',
  variant = 'default',
  radius = 'lg',
  hoverable = false,
  ...props
}) => {
  const radiusStyles = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    frame: 'rounded-frame'
  };

  const variantStyles = {
    default: 'bg-surface/80 border border-border-hairline shadow-card-subtle backdrop-blur-sm',
    elevated: 'bg-elevated/90 border border-white/10 shadow-card-subtle backdrop-blur-sm',
    glass: 'glass-panel shadow-glow-subtle',
    subtle: 'bg-surface/30 border border-white/5'
  };

  const hoverStyles = hoverable ? 'hover-lift hover:border-white/25 transition-all duration-200' : '';

  return (
    <div
      className={`${radiusStyles[radius]} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
