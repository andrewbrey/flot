const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  purge: {
    content: ['**/*.tsx', '**/*.html'],
    options: {
      safelist: [
        'simplebar-content',
        'simplebar-content-wrapper',
        'simplebar-scroll-content',
        'simplebar-track',
        'simplebar-scrollbar',
      ],
    },
  },
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Work Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
