"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogApi, getBlogDetailApi } from "src/entities/blog/api/blog.api";
import type { BlogItem } from "src/entities/blog/model/schema/blog.schema";
import type { ListProps } from "src/shared/types/list";
import { blogQueryKeys } from "./keys";

/** 페이지 결과 타입 */
export interface BlogPageResult {
    items: BlogItem[];
    hasNext: boolean;
    totalPages?: number;
}

/** 페이지네이션: size+1 전략으로 hasNext 계산 */
export const useBlogPageQuery = ({ page, size }: ListProps) =>
    useQuery<BlogPageResult>({
        queryKey: blogQueryKeys.page(page, size),
        queryFn: async () => {
            const over = size + 1;
            const list = await getBlogApi({ page, size: over });

            const hasNext = list.length > size;
            const items = hasNext ? list.slice(0, size) : list;

            return { items, hasNext };
        },
        placeholderData: (prev) => prev,
        staleTime: 60_000,
    });

/** 상세 조회 */
export const useBlogDetailQuery = (idx: number) =>
    useQuery<BlogItem>({
        queryKey: blogQueryKeys.detail(idx),
        queryFn: () => getBlogDetailApi(idx),
        enabled: Number.isFinite(idx) && idx > 0,
        staleTime: 60_000,
    });