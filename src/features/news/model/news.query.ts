"use client";

import {useQuery} from "@tanstack/react-query";
import {
    getNewsApi,
    getNewsDetailApi,
} from "src/entities/news/model/api/news.api";
import type {NewsItem} from "src/entities/news/model/schema/news.schema";
import {ListProps} from "src/shared/types/list";
import {newsKeys} from "./keys";

/** 페이지네이션: size+1 전략으로 hasNext 계산 */
export const useNewsPageQuery = ({page, size}: ListProps) =>
    useQuery<{ items: NewsItem[]; hasNext: boolean }>({
        queryKey: newsKeys.page(page, size),
        queryFn: async () => {
            const over = size + 1;
            const list = await getNewsApi({page, size: over});
            const hasNext = list.length > size;
            const items = hasNext ? list.slice(0, size) : list;
            return {items, hasNext};
        },
        placeholderData: (prev) => prev,
        staleTime: 60_000,
    });

/** 상세 */
export const useNewsDetailQuery = (idx: number) =>
    useQuery<NewsItem>({
        queryKey: newsKeys.detail(idx),
        queryFn: () => getNewsDetailApi(idx),
        enabled: Number.isFinite(idx) && idx > 0,
        staleTime: 60_000,
    });