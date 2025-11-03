"use client";

import { useMemo } from "react";

export interface PaginationOptions {
    total: number;      // 전체 아이템 수
    page: number;       // 현재 페이지(1-base)
    size: number;       // 페이지당 아이템 수
    siblingCount?: number; // 현재 페이지 양옆 표시 개수 (기본 1)
}

export type PaginationItem =
    | number            // 페이지 번호
    | "dots-prev"       // ... 앞쪽
    | "dots-next";      // ... 뒤쪽

export const usePagination = ({
                                  total,
                                  page,
                                  size,
                                  siblingCount = 1,
                              }: PaginationOptions) => {
    return useMemo<PaginationItem[]>(() => {
        const totalPages = Math.max(1, Math.ceil(total / size));
        const current = Math.min(Math.max(1, page), totalPages);

        const firstPage = 1;
        const lastPage = totalPages;

        const start = Math.max(firstPage, current - siblingCount);
        const end   = Math.min(lastPage, current + siblingCount);

        const items: PaginationItem[] = [];

        // 항상 첫 페이지 노출
        items.push(firstPage);

        // 시작 전 점 표시
        if (start > firstPage + 1) items.push("dots-prev");

        for (let p = start; p <= end; p++) {
            if (p !== firstPage && p !== lastPage) items.push(p);
        }

        // 끝 뒤 점 표시
        if (end < lastPage - 1) items.push("dots-next");

        // 항상 마지막 페이지 노출 (단, 1페이지인 경우 중복 방지)
        if (lastPage !== firstPage) items.push(lastPage);

        // 중복 제거
        return Array.from(new Set(items));
    }, [total, page, size, siblingCount]);
};