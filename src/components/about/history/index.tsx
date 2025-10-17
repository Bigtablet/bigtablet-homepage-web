"use client";

import { useCallback, useMemo, useRef } from "react";
import type { HistoryItemType } from "src/types/about/history.type";
import "./style.scss";

type Props = { items: HistoryItemType[] };

const groupByYear = (items: HistoryItemType[]) =>
    items.reduce<Record<number, HistoryItemType[]>>((acc, cur) => {
        acc[cur.year] = acc[cur.year] ? [...acc[cur.year], cur] : [cur];
        return acc;
    }, {});

const History = ({ items }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    const grouped = useMemo(() => {
        const g = groupByYear(items);
        return Object.keys(g)
            .map(Number)
            .sort((a, b) => b - a)
            .map((y) => ({
                year: y,
                list: g[y].slice().sort((a, b) => (a.id > b.id ? 1 : -1))
            }));
    }, [items]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const step = 80;
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

    return (
        <section className="history" aria-label="Company history">
            <div className="history__scroll" ref={ref} tabIndex={0} onKeyDown={onKeyDown} role="list">
                {grouped.map(({ year, list }) => (
                    <div className="history__year-block" key={year} role="listitem">
                        <div className="history__left">
                            <div className="history__dot" />
                            <div className="history__year">{year}</div>
                        </div>
                        <div className="history__right">
                            {list.map((it) => (
                                <article className="history__card" key={it.id}>
                                    <header className="history__card-head">
                                        <h3 className="history__title">{it.title}</h3>
                                        {it.dateLabel && <span className="history__date">{it.dateLabel}</span>}
                                    </header>
                                    {it.description && <p className="history__desc">{it.description}</p>}
                                </article>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default History;