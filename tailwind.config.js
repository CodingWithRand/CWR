/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

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
        
        'xs-md': {'min': '0px', 'max': '768px'}
      },
      fontFamily: {
        'russo': ['Russo One', 'sans-serif'],
        'spartan': ['League Spartan', 'sans-serif'],
        'barlow': ['Barlow', 'sans-serif']
      }
    },
    screens: {
      'nmob': {'min': '400px'},
      ...defaultTheme.screens
    }
  },
  plugins: [],
}
