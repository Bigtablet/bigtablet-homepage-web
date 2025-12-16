"use client";

import {useQuery} from "@tanstack/react-query";
import {getNewsApi,} from "src/entities/news/api/news.api";
import {NewsItem} from "src/entities/news/model/schema/news.schema";
import {newsQueryKeys} from "src/entities/news/query/keys";

export interface NewsPageResult {
    items: NewsItem[];
    hasNext: boolean;
}

/** GET /news?page&size */
export const useNewsPageQuery = ({
                                     page,
                                     size,
                                 }: {
    page: number;
    size: number;
}) =>
    useQuery<NewsPageResult>({
        queryKey: newsQueryKeys.page(page, size),
        queryFn: async () => {
            const res = await getNewsApi({page, size});

            const items = res.data ?? [];

            return {
                items,
                hasNext: items.length === size,
            };
        },
        staleTime: 60_000,
    });