import BigtabletAxios from "src/libs/axios";
import type { NewsListResponse, NewsItem } from "src/types/news/news.type";

export const getNewsApi = async (page: number, size: number): Promise<NewsItem[]> => {
    const { data } = await BigtabletAxios.get<NewsListResponse>("/news/list", { params: { page, size } });
    return data.data;
};

export const getNewsDetailApi = async (idx: number): Promise<NewsItem> => {
    const { data } = await BigtabletAxios.get<{ status: number; message: string; data: NewsItem }>("/news", {params: {idx}});
    return data.data;
};

export const createNewsApi = async (payload: Omit<NewsItem, "idx" | "createdAt" | "modifiedAt">) => {
    const { data } = await BigtabletAxios.post<{ status: number; message: string; data?: unknown }>("/news", payload);
    return data;
};

export const updateNewsApi = async (payload: { idx: number } & Omit<NewsItem, "createdAt" | "modifiedAt">) => {
    const { data } = await BigtabletAxios.put<{ status: number; message: string; data?: unknown }>("/news", payload);
    return data;
};

export const deleteNewsApi = async (idx: number) => {
    const { data } = await BigtabletAxios.delete<{ status: number; message: string }>(`/news`, { params: { idx } });
    return data;
};