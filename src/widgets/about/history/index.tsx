"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import styles from "./style.module.scss";
import { buildYearGroups, YearGroup, yearsFromGroups } from "src/entities/about/history/model/util/group";

export interface HistoryItemType {
    id: string;
    year: number;
    title: string;
    description?: string;
    dateLabel?: string;
}

type Props = { items: HistoryItemType[] };

const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const item: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 }
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
        <section className={styles.history}>
            <div className={styles.history_sticky}>
                <div className={styles.history_years}>
                    {years.map((y) => (
                        <button
                            key={y}
                            type="button"
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
                        className={styles.history_year_block}
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        transition={{ duration: 0.32, ease: "easeInOut" }}
                    >
                        <div className={styles.history_left} />
                        <motion.div
                            className={styles.history_right}
                            variants={container}
                            layout
                            transition={{ duration: 0.32, ease: "easeInOut" }}
                        >
                            {activeGroup.list.map((it) => (
                                <motion.div
                                    key={it.id}
                                    className={styles.history_row}
                                    variants={item}
                                    layout
                                    transition={{ duration: 0.24, ease: "easeOut" }}
                                >
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