"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./style.scss";
import { ListProps } from "src/shared/types/list";

const DEFAULT_PAGE_SIZE = 9;
const PAGE_BLOCK_SIZE = 9;

interface Props {
    /** 현재 페이지(1-base) */
    page: number;
    /** 한 페이지 아이템 수(기본 9) */
    size?: number;
    /** 다음 페이지 존재 여부 */
    hasNext: boolean;
    /** 총 페이지 수(있으면 마지막 점프 정확) */
    totalPages?: number;
    /** 기본 경로 */
    basePath?: string;
    /** 링크 빌더 커스터마이즈 */
    hrefBuilder?: (args: ListProps) => string;
}

/** 단순 블록 페이지네이션(9개 단위) */
const Pagination = ({
                        page,
                        size,
                        hasNext,
                        totalPages,
                        basePath,
                        hrefBuilder,
                    }: Props) => {
    const pathname = usePathname();
    const effectivePath = basePath ?? pathname ?? "/";
    const effectiveSize = size ?? DEFAULT_PAGE_SIZE;

    const makeHref =
        hrefBuilder ??
        ((args: ListProps) => {
            const qs = new URLSearchParams();
            qs.set("page", String(args.page));
            qs.set("size", String(args.size));
            return `${effectivePath}?${qs.toString()}`;
        });

    const hasNextDerived =
        typeof totalPages === "number" ? page < totalPages : hasNext;

    const blockStart =
        Math.floor((page - 1) / PAGE_BLOCK_SIZE) * PAGE_BLOCK_SIZE + 1;
    let blockEnd = blockStart + PAGE_BLOCK_SIZE - 1;

    if (typeof totalPages === "number") {
        blockEnd = Math.min(blockEnd, totalPages);
    } else if (!hasNextDerived) {
        blockEnd = Math.min(blockEnd, page);
    }

    const prevBlock = Math.max(1, blockStart - PAGE_BLOCK_SIZE);
    const nextBlock = blockEnd + 1;

    const isFirst = page === 1;
    const isFirstBlock = blockStart === 1;
    const isNextBlockAvailable =
        typeof totalPages === "number" ? blockEnd < totalPages : hasNextDerived;
    const isLast =
        typeof totalPages === "number" ? page >= totalPages : !hasNextDerived;

    const pages: number[] = [];
    for (let p = blockStart; p <= blockEnd; p++) pages.push(p);

    const Nav = ({
                     disabled,
                     href,
                     children,
                     title,
                 }: {
        disabled: boolean;
        href: string;
        children: React.ReactNode;
        title: string;
    }) =>
        disabled ? (
            <span className="pg-simple__nav is-disabled" aria-disabled="true" title={title}>
        {children}
      </span>
        ) : (
            <Link href={href} className="pg-simple__nav" title={title}>
                {children}
            </Link>
        );

    return (
        <nav className="pg-simple" role="navigation" aria-label="pagination">
            <Nav
                disabled={isFirst}
                href={makeHref({ page: 1, size: effectiveSize })}
                title="첫 페이지"
            >
                «
            </Nav>

            <Nav
                disabled={isFirstBlock}
                href={makeHref({ page: prevBlock, size: effectiveSize })}
                title="이전 9페이지"
            >
                ‹
            </Nav>

            {pages.map((p) =>
                    p === page ? (
                        <span key={p} className="pg-simple__num is-active" aria-current="page">
            {p}
          </span>
                    ) : (
                        <Link
                            key={p}
                            href={makeHref({ page: p, size: effectiveSize })}
                            className="pg-simple__num"
                        >
                            {p}
                        </Link>
                    )
            )}

            <Nav
                disabled={!isNextBlockAvailable}
                href={makeHref({ page: nextBlock, size: effectiveSize })}
                title="다음 9페이지"
            >
                ›
            </Nav>

            <Nav
                disabled={typeof totalPages !== "number" || isLast}
                href={
                    typeof totalPages === "number"
                        ? makeHref({ page: totalPages, size: effectiveSize })
                        : effectivePath
                }
                title="마지막 페이지"
            >
                »
            </Nav>
        </nav>
    );
};

export default Pagination;