"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HistoryItemType } from "src/types/about/history.type";
import "./style.scss";

type Props = { items: HistoryItemType[] };
type YearGroup = { year: number; list: HistoryItemType[] };

const groupByYear = (items: HistoryItemType[]) =>
    items.reduce<Record<number, HistoryItemType[]>>((acc, cur) => {
        acc[cur.year] = acc[cur.year] ? [...acc[cur.year], cur] : [cur];
        return acc;
    }, {});

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const formatYearMonthFromId = (id: string | number) => {
    const s = String(id).replace(/[^0-9]/g, "");
    if (s.length >= 6) {
        const y = s.slice(0, 4);
        const m = pad2(Number(s.slice(4, 6)) || 1);
        return `${y}.${m}`;
    }
    return s;
};

const STICKY_TOP = 96;

const History = ({ items }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [groups, setGroups] = useState<YearGroup[]>([]);
    const [currentYear, setCurrentYear] = useState<number | null>(null);

    useEffect(() => {
        const g = groupByYear(items);
        const years = Object.keys(g).map(Number).sort((a, b) => b - a);
        const mapped: YearGroup[] = years.map((y) => ({
            year: y,
            list: [...g[y]].sort((a, b) => (a.id > b.id ? 1 : -1)),
        }));
        setGroups(mapped);
        if (mapped.length) setCurrentYear((prev) => prev ?? mapped[0].year);
    }, [items]);

    const years = useMemo(() => groups.map((g) => g.year), [groups]);

    const recomputeActiveYear = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;

        const blocks = Array.from(
            container.querySelectorAll<HTMLDivElement>(".history__year-block")
        );
        if (!blocks.length) return;

        const pivot = container.scrollTop + STICKY_TOP + 8;
        let active = Number(blocks[0].dataset.year);

        for (const block of blocks) {
            const top = block.offsetTop;
            const bottom = top + block.offsetHeight;
            if (bottom >= pivot) {
                active = Number(block.dataset.year);
                break;
            }
        }
        setCurrentYear(active);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        recomputeActiveYear();
        const onScroll = () => recomputeActiveYear();
        const onResize = () => recomputeActiveYear();
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [recomputeActiveYear]);

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

    const scrollToYear = useCallback((year: number) => {
        const container = scrollRef.current;
        if (!container) return;
        const target = container.querySelector<HTMLDivElement>(
            `.history__year-block[data-year="${year}"]`
        );
        if (!target) return;
        setCurrentYear(year);
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
                        {years.map((y) => (
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
                            <div className="history__right">
                                {list.map((it) => (
                                    <div className="history__row" key={it.id}>
                                        <span className="history__row-dot" aria-hidden />
                                        <div className="history__row-body">
                                            <div className="history__row-meta">
                                                <span className="history__badge">{formatYearMonthFromId(it.id)}</span>
                                                {it.dateLabel && <span className="history__date">{it.dateLabel}</span>}
                                            </div>
                                            <div className="history__row-title">{it.title}</div>
                                            {it.description && <div className="history__row-desc">{it.description}</div>}
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