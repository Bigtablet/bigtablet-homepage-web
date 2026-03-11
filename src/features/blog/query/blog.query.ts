"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogApi, getBlogDetailApi } from "src/entities/blog/api/blog.api";
import type { BlogItem } from "src/entities/blog/schema/blog.schema";
import type { ListSchema } from "src/shared/schema/list/list.schema";
import { blogQueryKeys } from "./keys";

export interface BlogPageResult {
	items: BlogItem[];
	hasNext: boolean;
}

/** 페이지 조회 (size+1 방식) */
export const useBlogPageQuery = ({ page, size }: ListSchema) =>
	useQuery<BlogPageResult>({
		queryKey: blogQueryKeys.page(page, size),
		queryFn: async ({ signal }) => {
			const over = size + 1;
			const rows = await getBlogApi({ page, size: over }, signal);

			const hasNext = rows.length > size;
			const items = hasNext ? rows.slice(0, size) : rows;

			return { items, hasNext };
		},
	});

/** 상세 조회 */
export const useBlogDetailQuery = (idx: number) =>
	useQuery<BlogItem>({
		queryKey: blogQueryKeys.detail(idx),
		queryFn: ({ signal }) => getBlogDetailApi(idx, signal),
		enabled: Number.isFinite(idx) && idx > 0,
	});
