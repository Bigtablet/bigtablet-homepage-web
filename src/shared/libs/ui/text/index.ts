/**
 * @description 텍스트가 최대 길이를 초과하면 말줄임표(…)를 추가한다.
 *
 * @param text - 원본 텍스트
 * @param max - 최대 길이 (기본 120)
 * @returns 잘린 텍스트 또는 원본 (빈 입력 시 빈 문자열)
 *
 * @example
 * ellipsis("긴 텍스트...", 5) // "긴 텍스…"
 * ellipsis(null)               // ""
 */
export const ellipsis = (text?: string | null, max = 120) => {
	if (!text) return "";
	if (text.length <= max) return text;
	return `${text.slice(0, max).trimEnd()}…`;
};
