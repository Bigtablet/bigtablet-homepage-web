"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryKey } from "src/queries/queryKey";
import { getBlogApi } from "src/api/blog/blog.api";
import type { BlogItem } from "src/types/blog/blog.type";

export const blogKey = (params: unknown) => [QueryKey.blog.list, params] as const;

export const useBlogInfiniteQuery = (size: number) =>
    useInfiniteQuery<BlogItem[]>({
        queryKey: blogKey({ type: "infinite", size }),
        queryFn: ({ pageParam }) => getBlogApi((pageParam as number) ?? 1, size),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < size ? undefined : allPages.length + 1,
        staleTime: 60_000,
    });

export const useBlogPageQuery = (page: number, size: number) =>
    useQuery({
        queryKey: blogKey({ type: "page", page, size }),
        queryFn: () => getBlogApi(page, size),
        staleTime: 60_000,
    });