import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({});

const nextConfig = {
	output: "standalone",
	reactCompiler: true,

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
			},
		],
	},

	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "X-DNS-Prefetch-Control", value: "on" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains",
					},
					{
						key: "X-XSS-Protection",
						value: "0",
					},
				],
			},
			{
				source: "/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/media/:path*",
				headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
			},
		];
	},

	async rewrites() {
		return [
			{
				source: "/media/:id*",
				destination: "https://storage.googleapis.com/bigtablet-homepage/:id*",
			},
		];
	},

	async redirects() {
		return [{ source: "/", destination: "/main", permanent: true }];
	},

	sassOptions: {
		includePaths: ["./src/shared/styles"],
	},
};

export default withNextIntl(nextConfig);
