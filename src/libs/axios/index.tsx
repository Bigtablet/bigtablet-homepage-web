import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const BigtabletAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: false,
    timeout: 10000,
});

// 요청 인터셉터
BigtabletAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const isFormData = config.data instanceof FormData;

    if (config.headers) {
        config.headers.set("Content-Type", isFormData ? "multipart/form-data" : "application/json");
        config.headers.set("Accept", "*/*");
    }

    return config;
});

// 응답 인터셉터
BigtabletAxios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const status = error.response?.status ?? 0;
        const message =
            (error.response?.data as any)?.message ??
            error.message ??
            "network_error";

        return Promise.reject(
            Object.assign(new Error(message), {
                name: "HttpError",
                status,
                data: error.response?.data,
            })
        );
    }
);

export default BigtabletAxios;