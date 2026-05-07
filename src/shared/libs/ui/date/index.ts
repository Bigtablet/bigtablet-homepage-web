import { resolveLocale } from "src/shared/libs/locale";

/* Intl.DateTimeFormat 인스턴스 캐시 — 매 호출마다 생성 비용 회피. 목록 페이지처럼 다수 호출 시 효과. */
const formatterCache = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (locale: string) => {
	const cached = formatterCache.get(locale);
	if (cached) return cached;
	const formatter = new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
		timeZone: "Asia/Seoul",
	});
	formatterCache.set(locale, formatter);
	return formatter;
};

/**
 * @description ISO 날짜 문자열을 로케일별 실제 날짜 표기로 변환한다.
 *
 * 예전엔 "X분 전" 같은 상대 시간을 반환했지만, server 렌더와 client 렌더
 * 사이에 흐른 시간 차로 인해 텍스트가 달라져 React hydration mismatch
 * (#418)를 일으켰다. 절대 날짜는 입력에만 의존하므로 server/client 결과가
 * 일치한다.
 *
 * timeZone: "Asia/Seoul"을 명시해 server(UTC) vs client(KST)에서 같은
 * 입력에 다른 날짜가 나오는 일을 막는다. 미명시 시 시스템 시간대 사용.
 *
 * @param dateStr - ISO 8601 날짜 문자열
 * @param locale - 로케일 ("ko" 또는 "en", region code 허용)
 * @returns 로케일에 맞는 날짜 문자열 (입력 누락 시 빈 문자열)
 *
 * @example
 * formatDate("2026-04-02T10:00:00Z", "ko") // "2026. 4. 2."
 * formatDate("2026-04-02T10:00:00Z", "en") // "Apr 2, 2026"
 */
export const formatDate = (dateStr?: string, locale?: string) => {
	if (!dateStr || !locale) return "";
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return "";
	return getFormatter(resolveLocale(locale)).format(date);
};
