const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["**/*.tsx", "**/*.html"],
  safelist: [
    "simplebar-content",
    "simplebar-content-wrapper",
    "simplebar-scroll-content",
    "simplebar-track",
    "simplebar-scrollbar",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Work Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
