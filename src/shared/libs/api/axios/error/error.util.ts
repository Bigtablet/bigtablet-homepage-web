/** HttpError 타입 (Axios 인터셉터에서 생성) */
type HttpError = Error & {
	status?: number;
	data?: unknown;
};

/**
 * @description
 * 에러 객체에서 사용자에게 표시할 메시지를 추출합니다.
 *
 * - HttpError.message → 서버 응답 메시지 우선
 * - Error.message → 일반 에러
 * - fallback → 둘 다 없을 경우 기본 메시지
 *
 * @param error - 에러 객체 (unknown)
 * @param fallback - 기본 메시지
 * @returns 사용자에게 표시할 에러 메시지
 */
export const getErrorMessage = (error: unknown, fallback?: unknown): string => {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	if (typeof error === "string" && error.length > 0) {
		return error;
	}

	if (typeof fallback === "string" && fallback.length > 0) {
		return fallback;
	}

	return "알 수 없는 오류가 발생했습니다.";
};
