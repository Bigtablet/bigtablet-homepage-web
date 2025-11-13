"use client";

import styles from "./style.module.scss";
import { useTranslations } from "next-intl";

interface AboutType {
    sectionKey: string;
    reverse?: boolean;
}

const Introduce = ({ sectionKey, reverse = false }: AboutType) => {
    const t = useTranslations("about.top");

    return (
        <section
            className={`${styles.about} ${reverse ? styles.about_reverse : ""}`}
        >
            <div className={styles.about_text}>
                <p className={styles.about_title}>{t(`${sectionKey}.title`)}</p>
                <p className={styles.about_desc}>{t(`${sectionKey}.description`)}</p>
            </div>
            <div className={styles.about_image} aria-hidden="true">
                <img src="/images/logo/img.png" alt="logo" />
            </div>
        </section>
    );
};

export default Introduce;