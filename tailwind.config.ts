import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px for micro uppercase badges/labels
        xs: ['0.875rem', { lineHeight: '1.25rem' }],       // 14px minimum body standard
        sm: ['0.875rem', { lineHeight: '1.25rem' }],       // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],          // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],       // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],        // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],    // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],      // 36px
        display: ['clamp(1.75rem, 1.2rem + 2vw, 2.75rem)', { lineHeight: '1.1' }],
        'display-sm': ['clamp(1.35rem, 1rem + 1.2vw, 1.875rem)', { lineHeight: '1.15' }],
      },
      colors: {
        base: 'rgb(var(--color-base) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        elevated: 'rgb(var(--color-elevated) / <alpha-value>)',
        'elevated-hover': 'rgb(var(--color-elevated-hover) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'border-subtle': 'var(--border-subtle)',
        'border-hairline': 'var(--border-hairline)',
        'border-hover': 'var(--border-hover)',

        'btn-primary-bg': 'rgb(var(--btn-primary-bg) / <alpha-value>)',
        'btn-primary-text': 'rgb(var(--btn-primary-text) / <alpha-value>)',
        'chat-light-bg': 'var(--chat-light-bg)',
        'chat-user-bubble': 'var(--chat-user-bubble)',
        'chip-gray': 'var(--chip-gray)',

        // Illustration Palette
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

        // Clinical Status Colors (using the illustration/restrained palette)
        status: {
          completed: '#4E9A4B',
          processing: '#E58A3A',
          failed: '#C8623C',
          draft: '#7A7A7A',
        }
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        pill: '999px',
        lg: '16px',
        md: '12px',
        frame: '12px',
      },
      boxShadow: {
        'glow-subtle': '0 0 25px rgba(255, 255, 255, 0.05)',
        'card-subtle': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.24)',
        'modal': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config
