import { ERROR_CODE_MESSAGES } from "./error-codes";
import {
	DEFAULT_ERROR_MESSAGE,
	HTTP_STATUS_MESSAGES,
	NETWORK_ERROR_MESSAGE,
} from "./error-messages";

interface HttpError extends Error {
	status?: number;
	code?: string;
}

/**
 * @description
 * 에러 객체에서 사용자에게 표시할 메시지를 추출합니다.
 *
 * 우선순위: 에러 코드 → HTTP 상태 → 서버 메시지 → fallback
 */
export const getErrorMessage = (error: unknown, fallback?: unknown): string => {
	if (isHttpError(error)) {
		// 1순위: 서버 에러 코드
		if (error.code && error.code in ERROR_CODE_MESSAGES) {
			return ERROR_CODE_MESSAGES[error.code];
		}

		// 2순위: HTTP 상태 코드
		if (error.status && error.status in HTTP_STATUS_MESSAGES) {
			return HTTP_STATUS_MESSAGES[error.status];
		}

		// 3순위: 서버 응답 메시지
		if (error.message && error.message !== "network_error") {
			return error.message;
		}

		// 네트워크 에러
		if (error.message === "network_error" || error.status === 0) {
			return NETWORK_ERROR_MESSAGE;
		}
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	if (typeof error === "string" && error.length > 0) {
		return error;
	}

	if (typeof fallback === "string" && fallback.length > 0) {
		return fallback;
	}

	return DEFAULT_ERROR_MESSAGE;
};

const isHttpError = (error: unknown): error is HttpError =>
	error instanceof Error && error.name === "HttpError";
