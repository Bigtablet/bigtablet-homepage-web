import BigtabletAxios from "src/libs/axios";
import type { BlogItem, BlogListResponse } from "src/types/blog/blog.type";

export const getBlogApi = async (page: number, size: number): Promise<BlogItem[]> => {
    const { data } = await BigtabletAxios.get<BlogListResponse>("/blog/list", {
        params: { page, size },
    });
    return data.data;
};