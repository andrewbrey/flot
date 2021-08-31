const baseConfig = require('../renderer/tailwind.config');
const path = require('path');

module.exports = {
  presets: [baseConfig],
  mode: 'jit',
  theme: {
    extend: {
      animation: {
        flot: 'flot 60s linear infinite',
      },
      keyframes: {
        flot: {
          '0%': { transform: 'translate3d(-100%, -5%, 0) scale(1)' },
          '50%': { transform: 'translate3d(50vw, 10%, 0) translateX(-50%) scale(1.1)' },
          '100%': { transform: 'translate3d(100vw, 2%, 0) scale(1)' },
        },
      },
    },
  },
  purge: [path.join(__dirname, 'index.html')],
};
