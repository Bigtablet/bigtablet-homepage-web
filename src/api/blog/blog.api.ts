import BigtabletAxios from "src/libs/axios";
import type { BlogItem, BlogResponse, BlogDetailResponse } from "src/types/blog/blog.type";

export const getBlogApi = async (page: number, size: number): Promise<BlogItem[]> => {
    const { data } = await BigtabletAxios.get<BlogResponse>("/blog/list", {
        params: { page, size },
    });
    return data.data;
};

export const getBlogDetailApi = async (idx: number): Promise<BlogItem> => {
    const { data } = await BigtabletAxios.get<BlogDetailResponse>("/blog", { params: { idx } });
    return data.data;
};