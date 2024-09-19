const baseConfig = require("../renderer/tailwind.config");
const path = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [baseConfig],
	content: [path.join(__dirname, "index.html")],
	theme: {
		extend: {
			animation: {
				flot: "flot 60s linear infinite",
			},
			keyframes: {
				flot: {
					"0%": { transform: "translate3d(-100%, -5%, 0) scale(1)" },
					"50%": {
						transform: "translate3d(50vw, 10%, 0) translateX(-50%) scale(1.1)",
					},
					"100%": { transform: "translate3d(100vw, 2%, 0) scale(1)" },
				},
			},
		},
	},
};
