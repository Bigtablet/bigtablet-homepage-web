"use client";

import clsx from "clsx";
import styles from "./style.module.scss";
import { useTranslations } from "next-intl";

interface AboutSchema {
    sectionKey: string;
    reverse?: boolean;
}

const Introduce = ({ sectionKey, reverse = false }: AboutSchema) => {
    const t = useTranslations("about.top");

    return (
        <section
            className={clsx(styles.introduce, reverse && styles.introduce_reverse)}
        >
            <div className={styles.introduce_text}>
                <p className={styles.introduce_title}>{t(`${sectionKey}.title`)}</p>
                <p className={styles.introduce_desc}>{t(`${sectionKey}.description`)}</p>
            </div>
            <div className={styles.introduce_image} aria-hidden="true">
                <img src="/images/logo/img.png" alt="logo" />
            </div>
        </section>
    );
};

export default Introduce;