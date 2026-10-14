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
      bg: 'bg-[#122415]',
      border: 'border-[#2f6b3a]/70',
      text: 'text-[#a3ffb2]', // High-contrast WCAG AA compliant (>5.2:1)
      dot: 'bg-[#4e9a4b]',
      pulse: false
    },
    processing: {
      label: 'Processing',
      bg: 'bg-[#2d1b0a]',
      border: 'border-[#e58a3a]/70',
      text: 'text-[#ffcfa8]', // High-contrast WCAG AA compliant (>5.0:1)
      dot: 'bg-[#e58a3a]',
      pulse: true
    },
    failed: {
      label: 'Failed',
      bg: 'bg-[#2a1212]',
      border: 'border-[#c8623c]/70',
      text: 'text-[#ffd5c5]', // High-contrast WCAG AA compliant (>5.4:1)
      dot: 'bg-[#c8623c]',
      pulse: false
    },
    draft: {
      label: 'Draft',
      bg: 'bg-[#1a1a1a]',
      border: 'border-white/15',
      text: 'text-secondary',
      dot: 'bg-muted',
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
