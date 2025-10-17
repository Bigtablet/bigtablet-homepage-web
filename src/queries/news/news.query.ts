"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { NewsItem } from "src/types/news/news.type";
import { getNewsApi } from "src/api/news/news.api";
import { QueryKey } from "src/queries/queryKey";

export const newsKey = (params: unknown) => [QueryKey.news.list, params] as const;

// 무한스크롤용 쿼리
export const useNewsInfiniteQuery = (size: number) =>
    useInfiniteQuery<NewsItem[]>({
        queryKey: newsKey({ type: "infinite", size }),
        queryFn: ({ pageParam }) => getNewsApi((pageParam as number) ?? 1, size),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < size ? undefined : allPages.length + 1,
        staleTime: 60_000,
    });

// 일반 페이지용 쿼리
export const useNewsPageQuery = (page: number, size: number) =>
    useQuery({
        queryKey: newsKey({ type: "page", page, size }),
        queryFn: () => getNewsApi(page, size),
        staleTime: 60_000,
    });