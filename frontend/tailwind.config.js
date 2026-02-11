/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ultra-refined dark backgrounds
        bg: {
          DEFAULT: '#0a0a0a',
          elevated: '#0f0f0f',
          subtle: '#141414',
          hover: '#1a1a1a',
        },
        // Ultra-subtle borders
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 255, 255, 0.1)',
          focus: 'rgba(139, 92, 246, 0.3)',
          glow: 'rgba(139, 92, 246, 0.2)',
        },
        // Perfected text hierarchy
        text: {
          primary: 'rgba(255, 255, 255, 0.95)',
          secondary: 'rgba(255, 255, 255, 0.65)',
          tertiary: 'rgba(255, 255, 255, 0.4)',
          quaternary: 'rgba(255, 255, 255, 0.2)',
        },
        // Refined accent colors
        accent: {
          purple: '#8b5cf6',
          'purple-muted': '#7c3aed',
          'purple-glow': 'rgba(139, 92, 246, 0.08)',
          'purple-glow-hover': 'rgba(139, 92, 246, 0.15)',
          pink: '#ec4899',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      boxShadow: {
        'premium': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'premium-lg': '0 4px 12px 0 rgba(0, 0, 0, 0.5), 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        'premium-xl': '0 8px 24px 0 rgba(0, 0, 0, 0.6), 0 4px 8px 0 rgba(0, 0, 0, 0.5)',
        'glow-subtle': '0 0 20px rgba(139, 92, 246, 0.12)',
        'glow-medium': '0 0 30px rgba(139, 92, 246, 0.2)',
        'glow-strong': '0 0 40px rgba(139, 92, 246, 0.3)',
        'inner-subtle': 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-center': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'mesh-premium': `
          radial-gradient(at 27% 37%, rgba(139, 92, 246, 0.12) 0px, transparent 50%),
          radial-gradient(at 97% 21%, rgba(236, 72, 153, 0.08) 0px, transparent 50%),
          radial-gradient(at 52% 99%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
          radial-gradient(at 10% 29%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
          radial-gradient(at 97% 96%, rgba(236, 72, 153, 0.06) 0px, transparent 50%),
          radial-gradient(at 33% 50%, rgba(59, 130, 246, 0.06) 0px, transparent 50%),
          radial-gradient(at 79% 53%, rgba(139, 92, 246, 0.06) 0px, transparent 50%)
        `,
      },
      animation: {
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'float-medium': 'float-medium 15s ease-in-out infinite',
        'float-fast': 'float-fast 10s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(20px, -20px) rotate(3deg)' },
          '66%': { transform: 'translate(-15px, 15px) rotate(-3deg)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.7', filter: 'blur(25px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        'premium': '32px',
      },
      blur: {
        '4xl': '80px',
        '5xl': '120px',
      },
    },
  },
  plugins: [],
}