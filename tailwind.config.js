const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const { mode } = require('d3');

// TODO - Requiring tailwindcss/colors produces warnings on tailwind v3.
// see: https://github.com/tailwindlabs/tailwindcss/issues/4690

module.exports = {
  content: ['./pages/**/*.{html,js}', './components/**/*.{html,js}', './node_modules/flowbite/**/*.js'],
  mode: 'jit',
  theme: {
    fontFamily: {
      sans: ['Titillium Web', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      asafe_turquoise: '#15767a',
      ...colors,
    },
  },
  plugins: [],
};