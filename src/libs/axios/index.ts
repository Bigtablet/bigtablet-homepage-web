import axios, { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ACCESS_TOKEN, REQUEST_TOKEN } from "src/constants/token/token.constants";
import Token from "src/libs/token/cookie";

declare module "axios" {
    interface InternalAxiosRequestConfig { skipAuth?: boolean }
    interface AxiosRequestConfig { skipAuth?: boolean }
}

const isServer = typeof window === "undefined";
const rawBase = isServer ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL;

const normalize = (s?: string) => (s ?? "").trim().replace(/\/+$/, "");
const BASE_URL = normalize(rawBase);

if (!BASE_URL) {
    throw new Error(
        "Missing API base URL. Set API_BASE_URL (server) and NEXT_PUBLIC_API_BASE_URL (client)."
    );
}

const BigtabletAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

(BigtabletAxios.defaults as any).skipAuth = false;
delete (BigtabletAxios.defaults.headers as any).common?.["Content-Type"];
delete (BigtabletAxios.defaults.headers as any).post?.["Content-Type"];

BigtabletAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.url && !/^https?:\/\//i.test(config.url) && !config.url.startsWith("/")) {
        config.url = `/${config.url}`;
    }

    const headers = (config.headers ??= new AxiosHeaders());

    if (!config.skipAuth) {
        const token = Token.getToken(ACCESS_TOKEN);
        if (token) {
            headers.set(REQUEST_TOKEN, `Bearer ${token}`);
        } else {
            if (headers instanceof AxiosHeaders) headers.delete(REQUEST_TOKEN);
            else delete (headers as any)[REQUEST_TOKEN];
        }
    } else {
        if (headers instanceof AxiosHeaders) headers.delete(REQUEST_TOKEN);
        else delete (headers as any)[REQUEST_TOKEN];
    }

    return config;
});

BigtabletAxios.interceptors.response.use(
    (res: AxiosResponse) => res,
    (err: AxiosError) => {
        const status = err.response?.status ?? 0;
        const message = (err.response?.data as any)?.message ?? err.message ?? "network_error";
        return Promise.reject(Object.assign(new Error(message), { name: "HttpError", status, data: err.response?.data }));
    }
);

export default BigtabletAxios;