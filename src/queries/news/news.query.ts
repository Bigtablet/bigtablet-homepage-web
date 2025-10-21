"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewsItem } from "src/types/news/news.type";
import { getNewsApi, getNewsDetailApi, createNewsApi, updateNewsApi, deleteNewsApi } from "src/api/news/news.api";
import { QueryKey } from "src/queries/queryKey";

export const newsKey = (params: unknown) => [QueryKey.news.list, params] as const;

export const useNewsInfiniteQuery = (size: number) =>
    useInfiniteQuery<NewsItem[]>({
        queryKey: newsKey({ type: "infinite", size }),
        queryFn: ({ pageParam }) => getNewsApi((pageParam as number) ?? 1, size),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => (lastPage.length < size ? undefined : allPages.length + 1),
        staleTime: 60_000,
    });

export const useNewsPageQuery = (page: number, size: number) =>
    useQuery({
        queryKey: newsKey({ type: "page", page, size }),
        queryFn: () => getNewsApi(page, size),
        staleTime: 60_000,
    });

export const useNewsDetailQuery = (idx: number) =>
    useQuery({
        queryKey: [QueryKey.news.detail, idx],
        queryFn: () => getNewsDetailApi(idx),
        enabled: Number.isFinite(idx),
        staleTime: 60_000,
    });

export const useNewsCreateMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createNewsApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: [QueryKey.news.list] }),
    });
};

export const useNewsUpdateMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateNewsApi,
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: [QueryKey.news.list] });
            qc.invalidateQueries({ queryKey: [QueryKey.news.detail, vars.idx] });
        },
    });
};

export const useNewsDeleteMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteNewsApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: [QueryKey.news.list] }),
    });
};