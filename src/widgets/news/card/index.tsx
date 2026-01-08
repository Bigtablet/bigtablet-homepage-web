"use client";

import { useMemo } from "react";
import { formatRelative } from "src/shared/libs/ui/date";
import styles from "./style.module.scss";

interface NewsCardProps {
    title: string;
    url: string;
    createdAt: string;
    locale: string;
    thumbnailImageUrl: string;
    source?: string;
}

const NewsCard = ({
                      title,
                      url,
                      createdAt,
                      locale,
                      thumbnailImageUrl,
                      source,
                  }: NewsCardProps) => {
    const time = useMemo(() => formatRelative(createdAt, locale), [createdAt, locale]);

    const imageSrc = useMemo(() => {
        const trimmed = thumbnailImageUrl?.trim();
        if (!trimmed) return null;
        return encodeURI(trimmed);
    }, [thumbnailImageUrl]);

    return (
        <a className={styles.news_card} href={url} target="_blank" rel="noreferrer">
            <div className={styles.news_card_thumb}>
                {imageSrc ? (
                    <img
                        className={styles.news_card_img}
                        src={imageSrc}
                        alt=""
                        loading="lazy"
                    />
                ) : null}
            </div>

            <div className={styles.news_card_meta}>
                <span className={styles.news_card_time}>{time}</span>
                {source && <span className={styles.news_card_dot}>·</span>}
                {source && <span className={styles.news_card_source}>{source}</span>}
            </div>

            <span className={styles.news_card_title}>{title}</span>
        </a>
    );
};

export default NewsCard;