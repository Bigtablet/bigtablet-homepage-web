import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 10000,
});

// 불필요한 기본 Content-Type 제거
delete (api.defaults.headers as any).common?.["Content-Type"];
delete (api.defaults.headers as any).post?.["Content-Type"];

// URL 정규화
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.url && !/^https?:\/\//i.test(config.url) && !config.url.startsWith("/")) {
        config.url = `/${config.url}`;
    }
    return config;
});

// 응답 에러 처리
api.interceptors.response.use(
    (res: AxiosResponse) => res,
    (err: AxiosError) => {
        const status = err.response?.status ?? 0;
        const message = (err.response?.data as any)?.message ?? err.message ?? "network_error";
        return Promise.reject(
            Object.assign(new Error(message), {
                name: "HttpError",
                status,
                data: err.response?.data,
            })
        );
    }
);

export default api;