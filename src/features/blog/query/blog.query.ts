"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import { getBlogApi, getBlogDetailApi } from "src/entities/blog/api/blog.api";
import type { BlogItem } from "src/entities/blog/schema/blog.schema";
import type { ListSchema } from "src/shared/schema/list/list.schema";

export interface BlogPageResult {
	items: BlogItem[];
	hasNext: boolean;
}

/**
 * @description Blog query key factory
 * Organized hierarchically for cache management
 */
export const blogQueries = {
	all: ["blog"] as const,
	page: (page: number, size: number) =>
		queryOptions({
			queryKey: [...blogQueries.all, "page", { page, size }] as const,
			queryFn: async ({ signal }) => {
				const over = size + 1;
				const rows = await getBlogApi({ page, size: over }, signal);

				const hasNext = rows.length > size;
				const items = hasNext ? rows.slice(0, size) : rows;

				return { items, hasNext };
			},
		}),
	detail: (idx: number) =>
		queryOptions({
			queryKey: [...blogQueries.all, "detail", idx] as const,
			queryFn: ({ signal }) => getBlogDetailApi(idx, signal),
			enabled: Number.isFinite(idx) && idx > 0,
		}),
};

/**
 * @description Fetch blog page with pagination (size+1 pattern)
 * @param page Page number
 * @param size Items per page
 */
export const useBlogPageQuery = ({ page, size }: ListSchema) => {
	return useQuery({
		...blogQueries.page(page, size),
	});
};

/**
 * @description Fetch blog detail by index
 * @param idx Blog ID
 */
export const useBlogDetailQuery = (idx: number) => {
	return useQuery({
		...blogQueries.detail(idx),
	});
};
