import "src/app/global.css";
import "./global.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { Suspense } from "react";
import { resolveLocale } from "src/shared/libs/locale";
import RouteLoading from "src/shared/ui/route-loading";
import Providers from "src/widgets/layout/provider";

export const metadata: Metadata = {
	title: "Bigtablet",
	description: "Bigtablet's Official Website",
	/* Lighthouse CI 가 prod 가 새 빌드를 서빙하는지 polling 검증할 때 사용. Metadata API 의
	   `other` 속성 → Next 가 <head> 에 <meta name="build-sha" content="..."> 삽입. */
	...(process.env.NEXT_PUBLIC_BUILD_SHA
		? { other: { "build-sha": process.env.NEXT_PUBLIC_BUILD_SHA } }
		: {}),
};

/* force-dynamic 제거 — cookies() 사용으로 next 가 자동 dynamic 처리. 명시 force는 정적 최적화 차단해 불필요. */

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const store = await cookies();
	const locale = resolveLocale(store.get("NEXT_LOCALE")?.value);

	/**
	 * 쿠키 기반으로 직접 messages 로드. (i18n) layout과 동일한 로직.
	 * getMessages()는 middleware가 next-intl routing을 안 쓰는 환경에서
	 * defaultLocale로 fallback되므로, root layout의 CookieConsent가
	 * 항상 영문으로 노출되는 버그가 있었음.
	 *
	 * import 실패 시 빈 객체로 fallback — 앱 전체가 500으로 멈추는 것보다
	 * 일부 텍스트만 빠진 채 렌더되는 게 낫다.
	 */
	let messages: Record<string, unknown> = {};
	try {
		messages = (await import(`../../messages/${locale}.json`)).default;
	} catch {
		messages = {};
	}

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<link rel="icon" href="/images/logo/favicon.png" />
				<link
					rel="preload"
					href="/fonts/Pretendard-Regular.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/Pretendard-Bold.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link rel="preconnect" href="https://storage.googleapis.com" />
			</head>
			<body className="font-sans antialiased">
				<Suspense fallback={null}>
					<RouteLoading />
				</Suspense>
				<div id="modal" />
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
