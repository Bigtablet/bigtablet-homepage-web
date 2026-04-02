/**
 * @description 날짜 문자열을 상대 시간 표현으로 변환한다.
 * "방금 전", "5분 전", "3시간 전", "2일 전" 등의 형식으로 반환.
 *
 * @param dateStr - 날짜 문자열 (ISO 8601)
 * @param locale - 로케일 ("ko" 또는 "en")
 * @returns 상대 시간 문자열 (입력이 없으면 빈 문자열)
 *
 * @example
 * formatRelative("2026-04-02T10:00:00", "ko") // "3시간 전"
 */
export const formatRelative = (dateStr?: string, locale?: string) => {
	if (!dateStr || !locale) return "";
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return "";
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const absSec = Math.round(Math.abs(diffMs) / 1000);
	const rtf = new Intl.RelativeTimeFormat(
		locale.startsWith("ko") ? "ko" : "en",
		{ numeric: "auto" },
	);

	if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
	const absMin = Math.round(absSec / 60);
	if (absMin < 60)
		return rtf.format(Math.round(diffMs / (60 * 1000)), "minute");
	const absHr = Math.round(absMin / 60);
	if (absHr < 24)
		return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour");
	return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day");
};
