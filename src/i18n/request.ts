import { cookies } from "next/headers";
import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { resolveLocale } from "src/shared/libs/locale";

/**
 * @description
 * next-intl 서버 측 요청 설정. URL prefix 가 아닌 NEXT_LOCALE 쿠키 기반으로 locale 을 결정.
 *
 * 이전엔 routing config 의 `localePrefix: "never"` 때문에 next-intl 이 URL 에서 locale 추출 못 해
 * 항상 defaultLocale 로 fallback 됐음 — `getMessages()`/`getTranslations()` 가 한국어 사용자도
 * 영문 메시지 반환하던 버그의 근본 원인. 쿠키 직접 읽어 server-side i18n 헬퍼들이 정상 동작.
 */
export default getRequestConfig(async () => {
	const cookieValue = (await cookies()).get("NEXT_LOCALE")?.value;
	const locale = resolveLocale(cookieValue);
	const messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
	return { locale, messages };
});
