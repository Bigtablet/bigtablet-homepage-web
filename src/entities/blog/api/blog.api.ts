import {
	type BlogDetailResponse,
	type BlogOkResponse,
	blogDetailResponseSchema,
	blogListResponseSchema,
	blogOkResponseSchema,
} from "src/entities/blog/schema/blog.schema";
import { getParsed, patchParsed } from "src/shared/libs/api/zod";
import type { ListSchema } from "src/shared/schema/list/list.schema";

// 리스트
export const getBlogApi = async (
	{ page, size }: ListSchema,
	signal?: AbortSignal,
) => {
	return getParsed("/blog/list", blogListResponseSchema, {
		params: { page, size },
		signal,
	}).then((response) => response.data ?? []);
};

// 상세
export const getBlogDetailApi = async (idx: number, signal?: AbortSignal) =>
	getParsed("/blog", blogDetailResponseSchema, {
		params: { idx },
		signal,
	}).then((response: BlogDetailResponse) => {
		if (!response.data) throw new Error("Empty response");
		return response.data;
	});

// 조회수 증가
export const patchBlogViewApi = async (idx: number) =>
	patchParsed("/blog", blogOkResponseSchema, null, { params: { idx } }).then(
		(response: BlogOkResponse) => response,
	);
