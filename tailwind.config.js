/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,jsx}',
    './src/App.js'
  ],
  theme: {
    screens: {
      'amd': '777px',
      'gmob-lsm': {'min': '500px', 'max': '640px'},
      'nmob': {'min': '400px'},
      ...defaultTheme.screens
    }
  },
  plugins: [],
}
