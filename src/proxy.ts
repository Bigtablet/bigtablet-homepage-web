import { type NextRequest, NextResponse } from "next/server";

const LOCALE_PREFIX_RE = /^\/(en|ko)(?=\/|$)/i;
const LOCALE_COOKIE_KEY = "NEXT_LOCALE";
const SUPPORTED_LOCALES = ["ko", "en"];
const DEFAULT_LOCALE = "en";

/**
 * @description
 * CSP nonce를 생성하고 Content-Security-Policy 헤더를 설정합니다.
 */
const buildCsp = (nonce: string) => {
	/* dev에서는 React DevTools가 eval()을 사용하므로 unsafe-eval 허용. production은 strict. */
	const isDev = process.env.NODE_ENV === "development";
	const scriptSrc = `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`;
	return [
		"default-src 'self'",
		scriptSrc,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' https://storage.googleapis.com data:",
		"font-src 'self'",
		"connect-src 'self' https://*.sentry.io",
		"frame-src 'none'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
	].join("; ");
};

/**
 * @description
 * Next.js proxy (구 middleware) — CSP nonce 주입, locale 리다이렉트 및 쿠키 설정.
 * Next 16에서 middleware 파일 컨벤션이 deprecated되어 proxy로 rename됨.
 */
export function proxy(request: NextRequest) {
	const url = new URL(request.url);

	// /en/... 또는 /ko/... 이면 → 접두사 제거 후 308 리다이렉트
	if (LOCALE_PREFIX_RE.test(url.pathname)) {
		const stripped = url.pathname.replace(LOCALE_PREFIX_RE, "") || "/";
		const to = new URL(stripped + url.search, url.origin);
		return NextResponse.redirect(to, 308);
	}

	// CSP nonce 생성
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-nonce", nonce);

	const response = NextResponse.next({ request: { headers: requestHeaders } });
	/**
	 * 운영에서는 CSP 강제(enforce). report-only는 검사기에서 high로 평가됨.
	 * 깨지는 inline script/style이 발견되면 nonce 부여 또는 정책 완화로 대응.
	 */
	response.headers.set("Content-Security-Policy", buildCsp(nonce));

	// locale 쿠키 자동 설정
	if (!request.cookies.has(LOCALE_COOKIE_KEY)) {
		const acceptLanguage = request.headers.get("accept-language");
		let detectedLocale = DEFAULT_LOCALE;

		if (acceptLanguage) {
			const preferredLocale = acceptLanguage
				.split(",")
				.map((lang) => lang.split(";")[0].trim().substring(0, 2))
				.find((lang) => SUPPORTED_LOCALES.includes(lang));

			if (preferredLocale) {
				detectedLocale = preferredLocale;
			}
		}

		response.cookies.set(LOCALE_COOKIE_KEY, detectedLocale, {
			maxAge: 60 * 60 * 24 * 365,
			path: "/",
		});
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|images|fonts|media|monitoring|robots.txt|sitemap.xml).*)",
	],
};
