export type Locale = "ko" | "en";

const DEFAULT_LOCALE: Locale = "ko";

/**
 * @description
 * 입력 문자열을 지원 로케일(ko/en)로 정규화한다.
 * "en-US", "EN", "english" 등 region code/대소문자 변형을 모두 흡수.
 * 인식 불가 시 기본값(ko) 반환.
 *
 * @example
 * resolveLocale("en-US") // "en"
 * resolveLocale("ko-KR") // "ko"
 * resolveLocale(undefined) // "ko"
 */
export const resolveLocale = (value?: string | null): Locale => {
	if (!value) return DEFAULT_LOCALE;
	return value.toLowerCase().startsWith("en") ? "en" : "ko";
};

/** 입력이 한국어 로케일인지 판별. */
export const isKorean = (value?: string | null): boolean => resolveLocale(value) === "ko";

/**
 * @description
 * next-intl messages 에서 일부 namespace 만 추출. layout 이 무거운 namespace(`about` 등)를
 * 빼고 client provider 에 전달해 모든 페이지의 HTML serialize 크기를 줄이는 용도.
 *
 * @param messages - 전체 messages 객체
 * @param exclude - 제외할 top-level namespace 키 배열
 * @returns exclude 키를 뺀 새 객체 (얕은 복사)
 *
 * @example
 * const light = pickMessages(messages, { exclude: ["about"] });
 */
export const pickMessages = <T extends Record<string, unknown>>(
	messages: T | null | undefined,
	{ exclude }: { exclude: readonly string[] },
): Partial<T> => {
	if (!messages) return {} as Partial<T>;
	const excludeSet = new Set(exclude);
	const result: Record<string, unknown> = {};
	for (const key of Object.keys(messages)) {
		if (!excludeSet.has(key)) result[key] = messages[key];
	}
	return result as Partial<T>;
};
