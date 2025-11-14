"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./style.scss";

type RenderFn<T> = (
    pageItems: T[],
    info: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }
) => React.ReactNode;

export interface PaginationProps<T> {
    items: T[] | undefined;
    pageSize?: number;
    syncWithQuery?: boolean;
    maxPageButtons?: number | null;
    children: RenderFn<T>;
}

export const Pagination = <T,>({
                                   items,
                                   pageSize = 6,
                                   syncWithQuery = true,
                                   maxPageButtons = null,
                                   children,
                               }: PaginationProps<T>) => {
    const list = Array.isArray(items) ? items : [];
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const rawPage = Math.max(1, Number(sp.get("page") ?? 1));
    const page = Math.min(rawPage, totalPages);
    const start = (page - 1) * pageSize;
    const pageItems = useMemo(
        () => list.slice(start, start + pageSize),
        [list, start, pageSize]
    );

    useEffect(() => {
        if (!syncWithQuery) return;
        if (rawPage !== page) {
            const params = new URLSearchParams(sp.toString());
            params.set("page", String(page));
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [page, rawPage, router, pathname, sp, syncWithQuery]);

    const goPage = (next: number) => {
        const clamped = Math.max(1, Math.min(totalPages, next));
        if (!syncWithQuery) return;
        const params = new URLSearchParams(sp.toString());
        params.set("page", String(clamped));
        router.push(`${pathname}?${params.toString()}`);
    };

    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;

    const pages: number[] = useMemo(() => {
        if (!maxPageButtons || totalPages <= maxPageButtons) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const half = Math.floor(maxPageButtons / 2);
        let start = Math.max(1, page - half);
        let end = start + maxPageButtons - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxPageButtons + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [page, totalPages, maxPageButtons]);

    return (
        <>
            {children(pageItems, { page, pageSize, total, totalPages })}

            <nav className="pagination" aria-label="Pagination">
                <button
                    className="pagination__item"
                    onClick={() => goPage(page - 10)}
                    disabled={prevDisabled}
                >
                    «
                </button>
                <button
                    className="pagination__item"
                    onClick={() => goPage(page - 1)}
                    disabled={prevDisabled}
                >
                    ‹
                </button>

                <ul className="pagination__list">
                    {pages.map((p) => (
                        <li key={p}>
                            <button
                                className={`pagination__num ${p === page ? "is-active" : ""}`}
                                onClick={() => goPage(p)}
                                aria-current={p === page ? "page" : undefined}
                            >
                                {p}
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    className="pagination__item"
                    onClick={() => goPage(page + 1)}
                    disabled={nextDisabled}
                >
                    ›
                </button>
                <button
                    className="pagination__item"
                    onClick={() => goPage(page + 10)}
                    disabled={nextDisabled}
                >
                    »
                </button>
            </nav>
        </>
    );
};