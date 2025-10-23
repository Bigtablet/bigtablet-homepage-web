"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useRecruitList } from "src/hooks/recruit/useRecruit";
import type { RecruitCard } from "src/types/recruit/recruit.type";
import "./style.scss";

const SLICE_SIZE = 5;

const RequestList = () => {
    const { list, status, error, isEmpty } = useRecruitList();
    const [visibleCount, setVisibleCount] = useState(SLICE_SIZE);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const params = useParams<{ locale?: string }>();
    const pathname = usePathname();

    const locale = useMemo(() => {
        const fromParam = params?.locale;
        const fromPath = pathname.split("/")[1];
        return fromParam || fromPath || "ko";
    }, [params, pathname]);

    const items: RecruitCard[] = useMemo(
        () => list.slice(0, visibleCount),
        [list, visibleCount]
    );

    useEffect(() => {
        if (!bottomRef.current || !list.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setVisibleCount((prev) => (prev < list.length ? prev + SLICE_SIZE : prev));
                }
            },
            { rootMargin: "200px 0px" }
        );

        io.observe(bottomRef.current);
        return () => io.disconnect();
    }, [list]);

    if (status === "pending") {
        return <div className="request-list__loading">불러오는 중…</div>;
    }

    if (status === "error") {
        return (
            <div className="request-list__empty">
                데이터를 불러오지 못했습니다. {(error as Error).message}
            </div>
        );
    }

    if (status === "success" && isEmpty) {
        return <div className="request-list__empty">등록된 공고가 없습니다.</div>;
    }

    return (
        <>
            {items.map((item, idx) => (
                <Link
                    key={String(item.idx ?? `${item.title}-${idx}`)}
                    href={`/recruit/${String(item.idx)}`}
                    className="request-item"
                    prefetch
                >
                    <div className="request-item__left">
                        <h3 className="request-item__title">{item.title}</h3>
                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                            <div className="request-item__tags">
                                {item.tags.map((tag, i) => (
                                    <span key={`${item.idx}-${i}`} className="request-item__tag">
                    {tag}
                  </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="request-item__dday">{item.dday ?? ""}</div>
                </Link>
            ))}

            {visibleCount < list.length && (
                <div className="request-list__loading">더 불러오는 중…</div>
            )}

            <div ref={bottomRef} />
        </>
    );
};

export default RequestList;