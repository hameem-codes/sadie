import React, { useEffect, useState, useRef } from 'react';

export interface AnimatedNumberProps {
  value: number | string;
  duration?: number; // duration in milliseconds
  className?: string;
}

/**
 * Parses numeric strings with prefixes, decimals, and suffixes.
 * Examples:
 *   "93.0%" -> prefix: "", numeric: 93.0, suffix: "%", decimals: 1
 *   12 -> prefix: "", numeric: 12, suffix: "", decimals: 0
 *   "+6.2%" -> prefix: "+", numeric: 6.2, suffix: "%", decimals: 1
 *   "94.6" -> prefix: "", numeric: 94.6, suffix: "", decimals: 1
 */
function parseNumericValue(val: number | string) {
  if (typeof val === 'number') {
    const decimals = Number.isInteger(val) ? 0 : (val.toString().split('.')[1]?.length || 0);
    return { prefix: '', numeric: val, suffix: '', decimals };
  }
  const str = String(val).trim();
  const match = str.match(/^([^\d\-+.]*?)([-+]?\d*\.?\d+)(.*)$/);
  if (!match) {
    return null;
  }
  const prefix = match[1];
  const numStr = match[2];
  const suffix = match[3];
  const numeric = parseFloat(numStr);
  if (isNaN(numeric)) return null;

  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  return { prefix, numeric, suffix, decimals };
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1750,
  className
}) => {
  const parsed = parseNumericValue(value);

  // If cannot parse numeric content, fall back to plain display
  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (!parsed) return String(value);
    return `${parsed.prefix}${(0).toFixed(parsed.decimals)}${parsed.suffix}`;
  });

  const prevNumericRef = useRef<number>(0);

  useEffect(() => {
    const currentParsed = parseNumericValue(value);
    if (!currentParsed) {
      setDisplayValue(String(value));
      return;
    }

    const startVal = prevNumericRef.current;
    const targetVal = currentParsed.numeric;
    const startTime = performance.now();

    let animFrameId: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic curve for natural, readable deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * ease;

      setDisplayValue(
        `${currentParsed.prefix}${current.toFixed(currentParsed.decimals)}${currentParsed.suffix}`
      );

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        prevNumericRef.current = targetVal;
        setDisplayValue(
          `${currentParsed.prefix}${targetVal.toFixed(currentParsed.decimals)}${currentParsed.suffix}`
        );
      }
    };

    animFrameId = requestAnimationFrame(step);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};
