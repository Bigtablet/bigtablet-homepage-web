import {getParsed, patchParsed} from "src/shared/libs/api/zod";
import {
    blogListResponseSchema,
    blogDetailResponseSchema,
    blogOkResponseSchema,
    type BlogDetailResponse,
    type BlogOkResponse,
} from "src/entities/blog/model/schema/blog.schema";
import {ListProps} from "src/shared/types/list";

// 리스트
export const getBlogApi = async ({page, size}: ListProps) => {
    return getParsed("/blog/list", blogListResponseSchema, {
        params: {page, size},
    }).then((response) => response.data ?? []);
};

// 상세
export const getBlogDetailApi = async (idx: number) =>
    getParsed("/blog", blogDetailResponseSchema, {params: {idx}})
        .then((response: BlogDetailResponse) => {
            if (!response.data) throw new Error("Empty response");
            return response.data;
        });

// 조회수 증가
export const patchBlogViewApi = async (idx: number) =>
    patchParsed("/blog", blogOkResponseSchema, null, {params: {idx}})
        .then((response: BlogOkResponse) => response);