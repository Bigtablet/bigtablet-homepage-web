"use client";

import styles from "./style.module.scss";

export const SkeletonList = () => (
    <div className={`${styles.request_item} ${styles.skeleton}`}>
        <div className={styles.request_item_left}>
            <div className={styles.skeleton_title} />

            <div className={styles.request_item_tags}>
                <span className={styles.skeleton_tag} />
                <span className={styles.skeleton_tag} />
                <span className={styles.skeleton_tag} />
            </div>
        </div>

        <div className={styles.request_item_dday}>
            <span className={styles.skeleton_dday} />
        </div>
    </div>
);