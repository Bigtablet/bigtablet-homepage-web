import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

const MAXIMUM_RETRY_COUNT = 2;
const INITIAL_RETRY_DELAY_MILLISECONDS = 1000;

/**
 * @description
 * Axios 응답 에러 인터셉터 팩토리 함수입니다.
 *
 * - 요청 취소 시: `null`로 resolve하여 무시
 * - 5xx 에러: 지수 백오프로 최대 2회 재시도 (1초, 2초)
 * - 그 외: HttpError로 변환하여 전파
 */
export const createResponseErrorInterceptor = (
	axiosInstance: AxiosInstance,
) => {
	return async (error: AxiosError) => {
		if (axios.isCancel(error)) {
			return Promise.resolve(null);
		}

		const httpStatusCode = error.response?.status ?? 0;

		// 5xx 에러 재시도
		if (httpStatusCode >= 500) {
			const requestConfig = error.config as AxiosRequestConfig & {
				retryCount?: number;
				skipRetry?: boolean;
			};

			if (!requestConfig.skipRetry) {
				const currentRetryCount = requestConfig.retryCount ?? 0;

				if (currentRetryCount < MAXIMUM_RETRY_COUNT) {
					requestConfig.retryCount = currentRetryCount + 1;
					const delayMilliseconds =
						INITIAL_RETRY_DELAY_MILLISECONDS * (currentRetryCount + 1);

					await new Promise((resolve) =>
						setTimeout(resolve, delayMilliseconds),
					);
					return axiosInstance(requestConfig);
				}
			}
		}

		// HttpError로 변환
		const message = String(
			(error.response?.data as Record<string, unknown>)?.message ??
				error.message ??
				"network_error",
		);
		const code = String(
			(error.response?.data as Record<string, unknown>)?.code ?? "",
		);

		return Promise.reject(
			Object.assign(new Error(message), {
				name: "HttpError",
				status: httpStatusCode,
				code,
				data: error.response?.data,
			}),
		);
	};
};
