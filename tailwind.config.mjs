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
      },
      transitionProperty: {
        'colours': 'color, background-color, border-color',
      },
    },
  },
  plugins: [],
}