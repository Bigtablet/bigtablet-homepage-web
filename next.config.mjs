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
	/* X-Powered-By: Next.js 헤더 제거 — 서버 기술 스택 정보 노출 방지 */
	poweredByHeader: false,

	experimental: {
		/* CSS 청크 7개로 split 되어 모바일 throttle 에서 8.4s render-blocking 발생.
		   strict 로 chunk 수 줄여 HTTP request waterfall 단축. */
		cssChunking: "strict",
		/* Critters 로 critical CSS inline + 나머지 defer — initial paint 차단 제거. */
		inlineCss: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
			},
		],
		/* 1일 캐시 — 외부 썸네일 갱신 가능성 고려해 짧게. 60s 기본보단 충분히 김 */
		minimumCacheTTL: 60 * 60 * 24,
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
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-XSS-Protection",
						value: "0",
					},
					/* Cross-origin isolation — observatory.mozilla.org medium */
					{
						key: "Cross-Origin-Opener-Policy",
						value: "same-origin",
					},
					{
						key: "Cross-Origin-Resource-Policy",
						value: "same-site",
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
				/* UUID 파일명은 불변 — 1년 immutable. 변경 시 새 UUID 발급해 cache-bust. */
				source: "/media/:path*",
				headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
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
		/* / 가 직접 메인 페이지를 렌더 — /main 으로 리다이렉트하지 않음. /main 접근 시 / 로 308 */
		return [{ source: "/main", destination: "/", permanent: true }];
	},

	sassOptions: {
		/* DS 3.1 dist/styles 를 load path 에 추가 — package exports 가 scss/token 외
		   서브패스를 막아(ERR_PACKAGE_PATH_NOT_EXPORTED) 직접 import 불가하므로,
		   심링크 경로를 직접 노출해 _ds-token.scss 가 개별 서브모듈(spacing 등)을
		   @forward 할 수 있게 한다. 우리 src/shared/styles 가 우선(같은 이름이면 먼저 매치).
		   modern Sass API 는 loadPaths 를 사용(includePaths 는 legacy 라 무시됨) —
		   둘 다 지정해 sass-loader api 버전과 무관하게 동작. */
		loadPaths: ["./src/shared/styles", "./node_modules/@bigtablet/design-system/dist/styles"],
		includePaths: ["./src/shared/styles", "./node_modules/@bigtablet/design-system/dist/styles"],
	},
};

export default withSentryConfig(analyze(withNextIntl(nextConfig)), {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	silent: true,
	tunnelRoute: "/monitoring",
	/* disableLogger 제거 — deprecated. Turbopack에서 webpack.treeshake.removeDebugLogging 미지원이라 대체도 없음. Sentry 자체 build-time pruning에 의존. */
	widenClientFileUpload: true,
});
