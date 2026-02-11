/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ultra-dark backgrounds (Linear-inspired)
        bg: {
          DEFAULT: '#0a0a0a',
          elevated: '#111111',
          subtle: '#1a1a1a',
        },
        // Borders (very subtle)
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          hover: 'rgba(255, 255, 255, 0.12)',
          focus: 'rgba(139, 92, 246, 0.4)',
        },
        // Text hierarchy
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          tertiary: 'rgba(255, 255, 255, 0.45)',
          quaternary: 'rgba(255, 255, 255, 0.25)',
        },
        // Accent colors (used sparingly)
        accent: {
          purple: '#8b5cf6',
          'purple-glow': 'rgba(139, 92, 246, 0.15)',
          pink: '#ec4899',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-md': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'ultra-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'elevated': '0 2px 8px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'elevated-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.5), 0 2px 6px 0 rgba(0, 0, 0, 0.4)',
        'glow-subtle': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-medium': '0 0 40px rgba(139, 92, 246, 0.25), 0 0 10px rgba(139, 92, 246, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(139, 92, 246, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(236, 72, 153, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', boxShadow: '0 0 20px rgba(139, 92, 246, 0.15)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(139, 92, 246, 0.25)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        'ultra': '24px',
      },
    },
  },
  plugins: [],
}