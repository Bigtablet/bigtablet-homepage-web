import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getNewsApi } from "src/entities/news/api/news.api";
import type { NewsItem } from "src/entities/news/schema/news.schema";

export interface NewsPageResult {
	items: NewsItem[];
	hasNext: boolean;
}

/**
 * @description News query key factory
 * Organized hierarchically for cache management
 */
export const newsQueries = {
	all: ["news"] as const,
	page: (page: number, size: number) =>
		queryOptions({
			queryKey: [...newsQueries.all, "page", page, size] as const,
			queryFn: async ({ signal }) => {
				const response = await getNewsApi({ page, size }, signal);

				const items = response.data ?? [];

				return {
					items,
					hasNext: items.length === size,
				};
			},
		}),
};

/**
 * @description Fetch news page with pagination
 * @param page Page number
 * @param size Items per page
 */
export const useNewsPageQuery = ({ page, size }: { page: number; size: number }) => {
	return useQuery({
		...newsQueries.page(page, size),
	});
};

/**
 * @description Fetch news page with Suspense (AsyncBoundary용)
 */
export const useSuspenseNewsPageQuery = ({ page, size }: { page: number; size: number }) => {
	return useSuspenseQuery({
		...newsQueries.page(page, size),
	});
};
