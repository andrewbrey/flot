const baseConfig = require('../renderer/tailwind.config');
const path = require('path');

module.exports = {
  presets: [baseConfig],
  mode: 'jit',
  purge: [path.join(__dirname, 'index.html')],
};
