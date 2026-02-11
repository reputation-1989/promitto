/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ultra-dark backgrounds
        bg: {
          DEFAULT: '#0a0a0a',
          elevated: '#121212',
          subtle: '#1a1a1a',
        },
        // Borders
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.14)',
          focus: 'rgba(139, 92, 246, 0.5)',
        },
        // Text hierarchy (improved contrast)
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.75)',
          tertiary: 'rgba(255, 255, 255, 0.5)',
          quaternary: 'rgba(255, 255, 255, 0.3)',
        },
        // Accent colors
        accent: {
          purple: '#8b5cf6',
          'purple-subtle': 'rgba(139, 92, 246, 0.08)',
          'purple-medium': 'rgba(139, 92, 246, 0.15)',
          'purple-glow': 'rgba(139, 92, 246, 0.2)',
          pink: '#ec4899',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-xl': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
      },
      boxShadow: {
        'ultra-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 4px 16px 0 rgba(0, 0, 0, 0.6), 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        'elevated-lg': '0 12px 32px 0 rgba(0, 0, 0, 0.7), 0 4px 8px 0 rgba(0, 0, 0, 0.5)',
        'glow-subtle': '0 0 24px rgba(139, 92, 246, 0.2)',
        'glow-medium': '0 0 48px rgba(139, 92, 246, 0.3), 0 0 16px rgba(139, 92, 246, 0.4)',
        'inner-subtle': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(236, 72, 153, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.12) 0px, transparent 50%), radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 100%)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 24px rgba(139, 92, 246, 0.2)' },
          '50%': { opacity: '1', boxShadow: '0 0 48px rgba(139, 92, 246, 0.3)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        'ultra': '32px',
      },
    },
  },
  plugins: [],
}