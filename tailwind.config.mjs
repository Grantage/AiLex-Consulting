/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        'european-blue': '#1e3a8a',
        'innovation-indigo': '#4f46e5',
        'compliance-green': '#047857',
        'advisory-grey': '#525252',
        'institutional-grey': '#64748b',
        'success-green': '#16a34a',
        'parchment': '#fefcf3',
        'platinum': '#f8fafc',
      },
      transitionProperty: {
        'colours': 'color, background-color, border-color',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}