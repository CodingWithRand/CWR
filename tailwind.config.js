/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'amd': '777px',
        'gmob-lsm': {'min': '500px', 'max': '640px'},
        'nmob': {'min': '400px'}
      },
      fontFamily: {
        'russo': ['Russo One', 'sans-serif'],
        'spartan': ['League Spartan', 'sans-serif'],
        'barlow': ['Barlow', 'sans-serif']
      }
    },
  },
  plugins: [],
}
