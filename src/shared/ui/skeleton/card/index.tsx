"use client";

import styles from "./style.module.scss";

const SkeletonCard = () => (
    <div className={styles.card_skeleton}>
        <div className={styles.card_skeleton_thumb} />
        <div className={styles.card_skeleton_text}>
            <div className={`${styles.card_skeleton_line} ${styles.short}`} />
            <div className={styles.card_skeleton_line} />
        </div>
    </div>
);

export default SkeletonCard;