import BigtabletAxios from "src/libs/axios";
import type {
    BlogItem,
    BlogResponse,
    BlogDetailResponse,
    BlogCreateRequest,
    BlogUpdateRequest
} from "src/types/blog/blog.type";

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

export const postBlogApi = async (body: BlogCreateRequest, signal?: AbortSignal): Promise<{ ok: true }> => {
    await BigtabletAxios.post("/blog", body, { signal });
    return { ok: true };
};

export const putBlogApi = async (body: BlogUpdateRequest, signal?: AbortSignal): Promise<{ ok: true }> => {
    await BigtabletAxios.put("/blog", body, { signal });
    return { ok: true };
};

export const deleteBlogApi = async (idx: number, signal?: AbortSignal): Promise<{ ok: true }> => {
    await BigtabletAxios.delete("/blog", { params: { idx }, signal });
    return { ok: true };
};

export const patchBlogViewApi = async (idx: number, signal?: AbortSignal): Promise<{ ok: true }> => {
    await BigtabletAxios.patch("/blog", null, { params: { idx }, signal });
    return { ok: true };
};