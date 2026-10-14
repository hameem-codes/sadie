import React, { memo } from 'react';
import { AnalysisStatus } from '../../types';

export interface StatusPillProps {
  status: AnalysisStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

/**
 * StatusPill component
 * Displays clinical analysis status with accessible WCAG AA/AAA compliant contrasts,
 * restrained medical color indicators, and optional pulsating dot.
 */
export const StatusPill: React.FC<StatusPillProps> = memo(({
  status,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const configs = {
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-50 dark:bg-[#122415]',
      border: 'border-emerald-200 dark:border-[#2f6b3a]/70',
      text: 'text-emerald-700 dark:text-[#a3ffb2]',
      dot: 'bg-emerald-600 dark:bg-[#4e9a4b]',
      pulse: false
    },
    processing: {
      label: 'Processing',
      bg: 'bg-amber-50 dark:bg-[#2d1b0a]',
      border: 'border-amber-200 dark:border-[#e58a3a]/70',
      text: 'text-amber-800 dark:text-[#ffcfa8]',
      dot: 'bg-amber-600 dark:bg-[#e58a3a]',
      pulse: true
    },
    failed: {
      label: 'Failed',
      bg: 'bg-rose-50 dark:bg-[#2a1212]',
      border: 'border-rose-200 dark:border-[#c8623c]/70',
      text: 'text-rose-700 dark:text-[#ffd5c5]',
      dot: 'bg-rose-600 dark:bg-[#c8623c]',
      pulse: false
    },
    draft: {
      label: 'Draft',
      bg: 'bg-slate-100 dark:bg-[#1a1a1a]',
      border: 'border-slate-300 dark:border-white/15',
      text: 'text-slate-600 dark:text-secondary',
      dot: 'bg-slate-400 dark:bg-muted',
      pulse: false
    }
  };

  const config = configs[status] || configs.draft;

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2.5 py-1 gap-1.5 font-medium'
    : 'text-[13px] px-3 py-1.5 gap-2 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-pill border ${config.bg} ${config.border} ${config.text} ${sizeClasses} select-none ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {config.pulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
});

StatusPill.displayName = 'StatusPill';
