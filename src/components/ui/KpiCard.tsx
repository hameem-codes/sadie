import React, { memo } from 'react';
import { Card } from './Card';
import { AnimatedNumber } from './AnimatedNumber';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * KpiCard component
 * Metric overview display with smooth animated count-up numbers.
 */
export const KpiCard: React.FC<KpiCardProps> = memo(({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon,
  badge,
  onClick,
  className = '',
  style
}) => {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={style}
      className={`p-4 sm:p-4.5 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium text-secondary uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="p-1.5 rounded-full bg-elevated text-secondary border border-border-hairline">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-none">
          <AnimatedNumber value={value} />
        </h3>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-elevated text-secondary border border-border-hairline font-medium">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-2.5 border-t border-border-hairline flex items-center justify-between gap-2 text-xs">
          {change && (
            <span
              className={`font-mono text-xs font-medium whitespace-nowrap ${isPositive ? 'text-emerald-600 dark:text-[#a3ffb2]' : 'text-amber-600 dark:text-[#ffcfa8]'
                }`}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-muted text-xs truncate ml-auto font-normal" title={subtitle}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Card>
  );
});

KpiCard.displayName = 'KpiCard';
