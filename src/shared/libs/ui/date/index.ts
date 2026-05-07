/**
 * @description ISO 날짜 문자열을 로케일별 실제 날짜 표기로 변환한다.
 *
 * 예전엔 "X분 전" 같은 상대 시간을 반환했지만, server 렌더와 client 렌더
 * 사이에 흐른 시간 차로 인해 텍스트가 달라져 React hydration mismatch
 * (#418)를 일으켰다. 이로 인해 React가 SSR HTML을 버리고 client에서 다시
 * 렌더링하면서 초기 페인트가 느려졌다. 절대 날짜는 입력에만 의존하므로
 * server/client 결과가 일치한다.
 *
 * @param dateStr - ISO 8601 날짜 문자열
 * @param locale - 로케일 ("ko" 또는 "en")
 * @returns 로케일에 맞는 날짜 문자열 (입력 누락 시 빈 문자열)
 *
 * @example
 * formatRelative("2026-04-02T10:00:00", "ko") // "2026. 4. 2."
 * formatRelative("2026-04-02T10:00:00", "en") // "Apr 2, 2026"
 */
export const formatRelative = (dateStr?: string, locale?: string) => {
	if (!dateStr || !locale) return "";
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat(locale.startsWith("ko") ? "ko" : "en", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
};
