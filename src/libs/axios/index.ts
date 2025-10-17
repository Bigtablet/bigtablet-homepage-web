import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { ACCESS_TOKEN, REQUEST_TOKEN } from "src/constants/token/token.constants";
import Token from "src/libs/token/cookie";

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

declare module "axios" {
    interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
    interface InternalAxiosRequestConfig {
        skipAuth?: boolean;
    }
}

if (process.env.NODE_ENV === "production" && !BASE) {
    throw new Error("[API] NEXT_PUBLIC_SERVER_URL is empty at build time");
}

const BigtabletAxios = axios.create({
    baseURL: BASE || "/",
    withCredentials: true,
    timeout: 10000,
});

BigtabletAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 상대 경로 보정: "blog/list" → "/blog/list"
    if (config.url && !/^https?:\/\//i.test(config.url) && !config.url.startsWith("/")) {
        config.url = `/${config.url}`;
    }

    // 디버그 헤더(네트워크 탭에서 확인)
    (config.headers as any)["X-Debug-BaseURL"] = BigtabletAxios.defaults.baseURL || "(empty)";
    (config.headers as any)["X-Debug-Final-URL"] = config.url || "(no-url)";
    if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.log("[API]", { baseURL: BigtabletAxios.defaults.baseURL, url: config.url });
    }

    const token = Token.getToken(ACCESS_TOKEN);
    if (token) (config.headers as any)[REQUEST_TOKEN] = `Bearer ${token}`;
    else if (config.headers instanceof AxiosHeaders) config.headers.delete(REQUEST_TOKEN);
    else delete (config.headers as any)[REQUEST_TOKEN];

    return config;
});

export default BigtabletAxios;
export { BigtabletAxios };