import axios, { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ACCESS_TOKEN, REQUEST_TOKEN } from "src/constants/token/token.constants";
import Token from "src/libs/token/cookie";

declare module "axios" {
    interface InternalAxiosRequestConfig { skipAuth?: boolean }
    interface AxiosRequestConfig { skipAuth?: boolean }
}

const normalize = (s?: string) => (s ?? "").trim().replace(/\/+$/, "");
const BASE_URL = normalize(process.env.NEXT_PUBLIC_SERVER_URL);
if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is missing. Set it in .env files or hosting env.");
}

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

(api.defaults as any).skipAuth = false;
delete (api.defaults.headers as any).common?.["Content-Type"];
delete (api.defaults.headers as any).post?.["Content-Type"];

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.url && !/^https?:\/\//i.test(config.url) && !config.url.startsWith("/")) {
        config.url = `/${config.url}`;
    }

    const headers = (config.headers ??= new AxiosHeaders());
    if (!config.skipAuth) {
        const token = Token.getToken(ACCESS_TOKEN);
        if (token) headers.set(REQUEST_TOKEN, `Bearer ${token}`);
        else headers instanceof AxiosHeaders ? headers.delete(REQUEST_TOKEN) : delete (headers as any)[REQUEST_TOKEN];
    } else {
        headers instanceof AxiosHeaders ? headers.delete(REQUEST_TOKEN) : delete (headers as any)[REQUEST_TOKEN];
    }
    return config;
});

api.interceptors.response.use(
    (res: AxiosResponse) => res,
    (err: AxiosError) => {
        const status = err.response?.status ?? 0;
        const message = (err.response?.data as any)?.message ?? err.message ?? "network_error";
        return Promise.reject(Object.assign(new Error(message), { name: "HttpError", status, data: err.response?.data }));
    }
);

export default api;
