"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { buildYearGroups, yearsFromGroups, type YearGroup } from "src/widgets/about/history/lib/calcs";
import styles from "./style.module.scss";

export interface HistoryItemType {
    id: string;
    year: number;
    title: string;
    description?: string;
    dateLabel?: string;
}

type Props = { items: HistoryItemType[] };

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const container: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.22,
            ease: EASE,
            when: "beforeChildren",
            staggerChildren: 0.04,
        },
    },
    exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

const History = ({ items }: Props) => {
    const groups: YearGroup[] = useMemo(() => buildYearGroups(items), [items]);
    const years = useMemo(() => yearsFromGroups(groups), [groups]);
    const [currentYear, setCurrentYear] = useState<number | null>(null);

    useEffect(() => {
        if (!groups.length) return;
        setCurrentYear((prev) => prev ?? groups[0].year);
    }, [groups]);

    const activeGroup = useMemo(
        () => (currentYear ? groups.find((g) => g.year === currentYear) ?? null : null),
        [groups, currentYear]
    );

    return (
        <section className={styles.history} aria-label="Company history">
            <div className={styles.history_sticky}>
                <div className={styles.history_years} role="tablist" aria-label="Years">
                    {years.map((y) => (
                        <button
                            key={y}
                            type="button"
                            role="tab"
                            aria-selected={currentYear === y}
                            className={`${styles.history_year_item} ${currentYear === y ? styles.is_active : ""}`}
                            onClick={() => setCurrentYear(y)}
                        >
                            <span className={styles.history_year_text}>{y}</span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeGroup && (
                    <motion.section
                        key={activeGroup.year}
                        className={`${styles.history_year_block} ${styles.is_active}`}
                        role="region"
                        aria-live="polite"
                        data-year={activeGroup.year}
                        aria-label={`${activeGroup.year} timeline`}
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className={styles.history_left} aria-hidden />
                        <motion.div className={styles.history_right} variants={container}>
                            {activeGroup.list.map((it) => (
                                <motion.div key={it.id} className={styles.history_row} variants={item}>
                                    <span className={styles.history_row_dot} aria-hidden />
                                    <div className={styles.history_row_body}>
                                        <div className={styles.history_row_title}>{it.title}</div>
                                        {it.description && <div className={styles.history_row_desc}>{it.description}</div>}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>
        </section>
    );
};

export default History;