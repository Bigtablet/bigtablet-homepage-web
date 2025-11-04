"use client";

import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { getBlogApi, getBlogDetailApi, patchBlogViewApi } from "src/entities/blog/model/api/blog.api";
import { blogKeys } from "./keys";
import type { BlogItem, BlogOkResponse } from "src/entities/blog/model/schema/blog.schema";
import {ListProps} from "src/shared/types/list";

/** 페이지 결과 타입 */
export interface BlogPageResult {
    items: BlogItem[];
    hasNext: boolean;
    totalPages?: number;
}

/** 페이지네이션: size+1 전략으로 hasNext 계산 */
export const useBlogPageQuery = ({page, size}: ListProps) =>
    useQuery<BlogPageResult>({
        queryKey: blogKeys.page(page, size),
        queryFn: async () => {
            // 오버패치
            const over = size + 1;
            const list = await getBlogApi({ page, size: over });
            const hasNext = list.length > size;
            const items = hasNext ? list.slice(0, size) : list;
            return { items, hasNext };
        },
        placeholderData: (prev) => prev,
        staleTime: 60_000,
    });

/** 상세 */
export const useBlogDetailQuery = (idx: number) =>
    useQuery<BlogItem>({
        queryKey: blogKeys.detail(idx),
        queryFn: () => getBlogDetailApi(idx),
        enabled: Number.isFinite(idx) && idx > 0,
        staleTime: 60_000,
    });

/** 조회수 증가 */
export const useBlogViewMutation = (
    options?: UseMutationOptions<BlogOkResponse, Error, number>
) =>
    useMutation({
        mutationKey: blogKeys.views,
        mutationFn: (idx) => patchBlogViewApi(idx),
        ...options,
    });