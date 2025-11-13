"use client";

import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

const Problem = () => {
    const t = useTranslations("main.problem");

    return (
        <section className={styles.problem} role="region" aria-labelledby="problem_title">
            <h2 id="problem_title" className={styles.problem_title}>
                {t("title")}
            </h2>
            <p className={styles.problem_description}>
                {t("description")}
            </p>
        </section>
    );
};

export default Problem;