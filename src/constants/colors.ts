/**
 * SADIE Design System Color Constants
 * Matches DESIGN_SYSTEM.md specifications with accessible WCAG AA/AAA contrasts
 */

export const COLORS = {
  // Base Canvas & Surfaces
  bg: {
    base: '#0A0A0A',
    surface: '#141414',
    elevated: '#1C1C1C',
    elevatedHover: '#242424',
  },

  // Typography
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B8B8', // Matches DESIGN_SYSTEM.md
    muted: '#7A7A7A',     // Matches DESIGN_SYSTEM.md
  },

  // Hairlines & Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.25)',
    hairline: 'rgba(255, 255, 255, 0.12)',
    hover: 'rgba(255, 255, 255, 0.35)',
  },

  // Illustration Palette (Section 2)
  illustration: {
    forest: '#2F6B3A',
    leaf: '#4E9A4B',
    terracotta: '#C8623C',
    orange: '#E58A3A',
    pink: '#D98BA8',
    sky: '#8EC5E8',
    cream: '#F2E6C8',
    indigo: '#2B2A44',
  },

  // High-Contrast WCAG-Compliant Status Colors
  status: {
    completed: {
      bg: '#122415',
      border: 'rgba(47, 107, 58, 0.7)',
      text: '#A3FFB2',
      dot: '#4E9A4B',
    },
    processing: {
      bg: '#2D1B0A',
      border: 'rgba(229, 138, 58, 0.7)',
      text: '#FFCFA8',
      dot: '#E58A3A',
    },
    failed: {
      bg: '#2A1212',
      border: 'rgba(200, 98, 60, 0.7)',
      text: '#FFD5C5',
      dot: '#C8623C',
    },
    draft: {
      bg: '#1A1A1A',
      border: 'rgba(255, 255, 255, 0.15)',
      text: '#B8B8B8',
      dot: '#7A7A7A',
    },
  },
} as const;
