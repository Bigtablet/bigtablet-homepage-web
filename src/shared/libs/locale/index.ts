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
