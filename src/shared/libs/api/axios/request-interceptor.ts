import type { InternalAxiosRequestConfig } from "axios";

/**
 * @description
 * URL 정규화 — 상대 경로에 슬래시가 빠진 경우 보정합니다.
 */
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
	if (
		config.url &&
		!/^https?:\/\//i.test(config.url) &&
		!config.url.startsWith("/")
	) {
		config.url = `/${config.url}`;
	}
	return config;
};
