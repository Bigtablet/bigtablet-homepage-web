import BigtabletAxios from "src/libs/axios";
import type { NewsListResponse, NewsItem } from "src/types/news/news.type";

export const getNewsApi = async (page: number, size: number): Promise<NewsItem[]> => {
    const { data } = await BigtabletAxios.get<NewsListResponse>("/news", { params: { page, size } });
    return data.data;
};