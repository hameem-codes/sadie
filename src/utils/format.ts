/**
 * SADIE Centralized Formatting Utilities
 * Standardizes date, time, file size, and score representations across the application.
 */

/**
 * Format ISO or standard date string to clinical readable format (e.g. "Oct 11, 2026")
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format relative or short date/time string
 */
export function formatTime(dateStr?: string): string {
  if (!dateStr) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

/**
 * Format file size in bytes or megabytes
 */
export function formatFileSize(bytesOrString: number | string): string {
  if (typeof bytesOrString === 'string') return bytesOrString;
  if (bytesOrString < 1024) return `${bytesOrString} B`;
  if (bytesOrString < 1024 * 1024) return `${(bytesOrString / 1024).toFixed(1)} KB`;
  return `${(bytesOrString / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format clinical score with percent sign and version benchmark
 */
export function formatScore(score: number | undefined | null): string {
  if (score === undefined || score === null) return '—';
  return `${score.toFixed(1)}%`;
}
