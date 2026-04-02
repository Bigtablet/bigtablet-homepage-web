import axios from "axios";
import { env } from "src/shared/libs/env";
import { requestInterceptor } from "./request-interceptor";
import { createResponseErrorInterceptor } from "./response-error-interceptor";

const api = axios.create({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	withCredentials: true,
	timeout: 10000,
});

// 불필요한 기본 Content-Type 제거
const headers = api.defaults.headers as Record<string, Record<string, unknown>>;
delete headers.common?.["Content-Type"];
delete headers.post?.["Content-Type"];

api.interceptors.request.use(requestInterceptor, (error) =>
	Promise.reject(error),
);

api.interceptors.response.use(
	(res) => res,
	createResponseErrorInterceptor(api),
);

export default api;
