"use client";

import {useQuery} from "@tanstack/react-query";
import {getNewsApi,} from "src/entities/news/api/news.api";
import type {NewsItem} from "src/entities/news/model/schema/news.schema";
import {ListSchema} from "src/shared/schema/list/list.schema";
import {newsQueryKey} from "./keys";

/** 페이지네이션: size+1 전략으로 hasNext 계산 */
export const useNewsPageQuery = ({page, size}: ListSchema) =>
    useQuery<{ items: NewsItem[]; hasNext: boolean }>({
        queryKey: newsQueryKey.page(page, size),
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