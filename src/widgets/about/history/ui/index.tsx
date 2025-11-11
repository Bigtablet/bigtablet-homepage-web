"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    buildYearGroups,
    yearsFromGroups,
    findActiveYear,
    type YearGroup,
} from "src/widgets/about/history/lib/calcs";
import "./style.scss";

export interface HistoryItemType {
    id: string;
    year: number;
    title: string;
    description?: string;
    dateLabel?: string;
};

type Props = { items: HistoryItemType[] };

const STICKY_TOP = 96;

const History = ({ items }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // 연도별 그룹
    const groups: YearGroup[] = useMemo(() => buildYearGroups(items), [items]);
    const years = useMemo(() => yearsFromGroups(groups), [groups]);

    const [currentYear, setCurrentYear] = useState<number | null>(null);

    useEffect(() => {
        if (!groups.length) return;
        setCurrentYear(prev => prev ?? groups[0].year);
    }, [groups]);

    // 스크롤에 따른 활성 연도 갱신 (rAF)
    const rAfId = useRef<number | null>(null);
    const scheduleRecompute = useCallback(() => {
        if (rAfId.current != null) return;
        rAfId.current = window.requestAnimationFrame(() => {
            rAfId.current = null;
            const el = scrollRef.current;
            if (!el) return;
            const active = findActiveYear(el, STICKY_TOP);
            if (active != null) setCurrentYear(y => (y === active ? y : active));
        });
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const initial = findActiveYear(el, STICKY_TOP);
        if (initial != null) setCurrentYear(initial);

        const onScroll = () => scheduleRecompute();
        const onResize = () => scheduleRecompute();

        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (rAfId.current != null) {
                cancelAnimationFrame(rAfId.current);
                rAfId.current = null;
            }
        };
    }, [scheduleRecompute]);

    // 키보드 내비게이션
    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const el = scrollRef.current;
        if (!el) return;
        const step = 72;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            el.scrollBy({ top: step, behavior: "smooth" });
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            el.scrollBy({ top: -step, behavior: "smooth" });
        } else if (e.key === "Home") {
            e.preventDefault();
            el.scrollTo({ top: 0, behavior: "smooth" });
        } else if (e.key === "End") {
            e.preventDefault();
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }
    }, []);

    // 연도 클릭 이동
    const scrollToYear = useCallback((year: number) => {
        const container = scrollRef.current;
        if (!container) return;
        const target = container.querySelector<HTMLDivElement>(
            `.history__year-block[data-year="${year}"]`
        );
        if (!target) return;

        const targetTop = target.offsetTop - STICKY_TOP - 6;
        const maxTop = container.scrollHeight - container.clientHeight;

        container.scrollTo({
            top: Math.max(0, Math.min(targetTop, maxTop)),
            behavior: "smooth",
        });
    }, []);

    return (
        <section className={"history" + (currentYear ? " is-ready" : "")} aria-label="Company history">
            <div
                className="history__scroll"
                ref={scrollRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                role="list"
            >
                <div className="history__sticky">
                    <div className="history__years" role="tablist" aria-label="Years">
                        {years.map(y => (
                            <button
                                key={y}
                                type="button"
                                role="tab"
                                aria-selected={currentYear === y}
                                className={"history__year-item" + (currentYear === y ? " is-active" : "")}
                                onClick={() => scrollToYear(y)}
                            >
                                <span className="history__year-text">{y}</span>
                            </button>
                        ))}
                    </div>
                    <div />
                </div>

                {groups.map(({ year, list }) => {
                    const isActive = currentYear === year;
                    return (
                        <section
                            className={"history__year-block" + (isActive ? " is-active" : "")}
                            key={year}
                            role="listitem"
                            data-year={year}
                            aria-label={`${year} timeline`}
                        >
                            <div className="history__left" aria-hidden>
                                <span className="history__year history__year--inline">{year}</span>
                            </div>

                            <div className={"history__right" + (isActive ? " is-visible" : " is-hidden")} aria-hidden={!isActive}>
                                {list.map((it, i) => (
                                    <div className="history__row" key={i}>
                                        <span className="history__row-dot" aria-hidden />
                                        <div className="history__row-body">
                                            <div className="history__row-title">{it.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
};

export default History;