"use client";

import styles from "./style.module.scss";

interface QAItem {
    q: string;
    a: string;
}

const Interview = ({ items }: { items: QAItem[] }) => {
    return (
        <main className={styles.interview} aria-label="Interview">
            <div className={styles.interview_scroll}>
                {items.length > 0 ? (
                    items.map((it, i) => (
                        <article className={styles.qa} key={i}>
                            <h3 className={styles.qa_q}>{it.q}</h3>
                            <p className={styles.qa_a}>{it.a}</p>
                        </article>
                    ))
                ) : (
                    <p className={styles.interview_empty}>No interview data available.</p>
                )}
            </div>
        </main>
    );
};

export default Interview;