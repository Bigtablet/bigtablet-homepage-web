"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useRecruitListQuery} from "src/queries/recruit/recruit.query";
import type {RecruitCard} from "src/types/recruit/recruit.type";
import "./style.scss";

const SLICE_SIZE = 10;

const RequestList = () => {
    const {data, status, error} = useRecruitListQuery();
    const [visibleCount, setVisibleCount] = useState(SLICE_SIZE);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const items: RecruitCard[] = useMemo(
        () => (data ?? []).slice(0, visibleCount),
        [data, visibleCount]
    );

    useEffect(() => {
        if (!bottomRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisibleCount((prev) => (data && prev < data.length ? prev + SLICE_SIZE : prev));
                }
            },
            {rootMargin: "200px 0px"}
        );
        observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [data]);

    return (
        <>
            {status === "pending" && <div className="request-list__loading">불러오는 중…</div>}
            {status === "error" && (
                <div className="request-list__empty">데이터를 불러오지 못했습니다. {(error as Error).message}</div>
            )}
            {status === "success" &&
                items.map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="request-item">
                        <div className="request-item__left">
                            <h3 className="request-item__title">{item.title}</h3>
                            <div className="request-item__tags">
                                {item.tags.map((tag, i) => (
                                    <span key={`${idx}-${i}`} className="request-item__tag">
                      {tag}
                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="request-item__dday">{item.dday}</div>
                    </div>
                ))}
            {status === "success" && data && visibleCount < data.length && (
                <div className="request-list__loading">더 불러오는 중…</div>
            )}
            <div ref={bottomRef}/>
        </>
    );
};

export default RequestList;