"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryKey } from "src/queries/queryKey";
import { getBlogApi, getBlogDetailApi } from "src/api/blog/blog.api";
import type { BlogItem } from "src/types/blog/blog.type";

// 무한 스크롤용 쿼리
export const useBlogInfiniteQuery = (size: number) =>
    useInfiniteQuery<BlogItem[]>({
        queryKey: [QueryKey.blog.list, { type: "infinite", size }],
        queryFn: ({ pageParam }) => getBlogApi((pageParam as number) ?? 1, size),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < size ? undefined : allPages.length + 1,
        staleTime: 60_000,
    });

// 페이지 단위 쿼리
export const useBlogPageQuery = (page: number, size: number) =>
    useQuery({
        queryKey: [QueryKey.blog.list, { type: "page", page, size }],
        queryFn: () => getBlogApi(page, size),
        staleTime: 60_000,
    });

// 단일 상세 쿼리
export const useBlogDetailQuery = (idx: number) =>
    useQuery<BlogItem>({
        queryKey: [QueryKey.blog.detail, idx],
        queryFn: () => getBlogDetailApi(idx),
        enabled: Number.isFinite(idx),
        staleTime: 60_000,
    });