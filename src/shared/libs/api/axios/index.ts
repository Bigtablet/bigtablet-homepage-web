import axios from "axios";
import { requestInterceptor } from "./request-interceptor";
import { createResponseErrorInterceptor } from "./response-error-interceptor";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_SERVER_URL is missing.");
}

const api = axios.create({
	baseURL: BASE_URL,
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
