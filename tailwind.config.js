/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/components/*.js',
    './src/App.js'
  ],
  theme: {
    extend: {
      screens: {
        'amd': '777px',
        'gmob-lsm': {'min': '500px', 'max': '640px'},
        'nmob': {'min': '400px'}
      }
    },
  },
  plugins: [],
}
