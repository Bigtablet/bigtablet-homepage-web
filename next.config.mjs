import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({});

const analyze = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

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
		/* 30일 캐시 — news 썸네일 URL은 idx별로 안정적이라 길게 잡아도 안전 */
		minimumCacheTTL: 60 * 60 * 24 * 30,
		/* AVIF 우선 → WebP 폴백 — 페이로드 30~50% 감소 */
		formats: ["image/avif", "image/webp"],
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

export default withSentryConfig(analyze(withNextIntl(nextConfig)), {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	silent: true,
	tunnelRoute: "/monitoring",
	disableLogger: true,
	widenClientFileUpload: true,
});
