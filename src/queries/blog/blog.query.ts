"use client";

import { useInfiniteQuery, useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { QueryKey } from "src/queries/queryKey";
import {
    deleteBlogApi,
    getBlogApi,
    getBlogDetailApi,
    postBlogApi,
    putBlogApi,
    patchBlogViewApi, // ✅ 추가
} from "src/api/blog/blog.api";
import type { BlogCreateRequest, BlogItem, BlogUpdateRequest } from "src/types/blog/blog.type";

export const useBlogInfiniteQuery = (size: number) =>
    useInfiniteQuery<BlogItem[]>({
        queryKey: [QueryKey.blog.list, { type: "infinite", size }],
        queryFn: ({ pageParam }) => getBlogApi((pageParam as number) ?? 1, size),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < size ? undefined : allPages.length + 1,
        staleTime: 60_000,
    });

export const useBlogDetailQuery = (idx: number) =>
    useQuery<BlogItem>({
        queryKey: [QueryKey.blog.detail, idx],
        queryFn: () => getBlogDetailApi(idx),
        enabled: Number.isFinite(idx),
        staleTime: 60_000,
    });

export const useBlogCreateMutation = (
    options?: UseMutationOptions<{ ok: true }, Error, BlogCreateRequest>
) =>
    useMutation({
        mutationKey: [QueryKey.blog.create],
        mutationFn: (body) => postBlogApi(body),
        ...options,
    });

export const useBlogUpdateMutation = (
    options?: UseMutationOptions<{ ok: true }, Error, BlogUpdateRequest>
) =>
    useMutation({
        mutationKey: [QueryKey.blog.update],
        mutationFn: (body) => putBlogApi(body),
        ...options,
    });

export const useBlogDeleteMutation = (
    options?: UseMutationOptions<{ ok: true }, Error, number>
) =>
    useMutation({
        mutationKey: [QueryKey.blog.delete],
        mutationFn: (idx) => deleteBlogApi(idx),
        ...options,
    });

export const useBlogViewMutation = (
    options?: UseMutationOptions<{ ok: true }, Error, number>
) =>
    useMutation({
        mutationKey: [QueryKey.blog.view],
        mutationFn: (idx) => patchBlogViewApi(idx),
        ...options,
    });