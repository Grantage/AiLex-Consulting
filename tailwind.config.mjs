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
        'caution-amber': '#b45309',
        'parchment': '#fefcf3',
        'institutional-grey': '#f1f5f9',
        'warm-white': '#fafbfc',
        'slate-warm': '#f8fafc',
      },
      transitionProperty: {
        'colours': 'color, background-color, border-color',
      },
      backgroundImage: {
        'european-gradient': 'linear-gradient(135deg, #fefcf3 0%, #f8fafc 50%, #f1f5f9 100%)',
        'institutional': 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      },
    },
  },
  plugins: [],
}