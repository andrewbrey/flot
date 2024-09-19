module.exports = {
	output: "export",
	distDir: process.env.NODE_ENV === "production" ? "../app" : ".next",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.target = "electron-renderer";
			config.node = {
				__dirname: true,
			};
		}

		return config;
	},
};
