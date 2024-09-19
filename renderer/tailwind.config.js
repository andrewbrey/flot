const defaultTheme = require("tailwindcss/defaultTheme");
const path = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		`${path.join(__dirname, "app/**/*.{js,ts,jsx,tsx,mdx,html}")}`,
		`${path.join(__dirname, "components/**/*.{js,ts,jsx,tsx,mdx,html}")}`,
		`${path.join(__dirname, "pages/**/*.{js,ts,jsx,tsx,mdx,html}")}`,
	],
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
