"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { formatRelative } from "src/shared/libs/ui/date";
import styles from "./style.module.scss";
import {getPreviewUrl, getSourceFromUrl} from "src/widgets/news/card/model/news-card.util";

interface NewsCardProps {
    title: string;
    url: string;
    createdAt: string;
    locale: string;
}

const NewsCard = ({ title, url, createdAt, locale }: NewsCardProps) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const time = useMemo(() => formatRelative(createdAt, locale), [createdAt, locale]);
    const source = useMemo(() => getSourceFromUrl(url), [url]);
    const preview = useMemo(() => getPreviewUrl(url), [url]);

    const thumbClass = clsx(
        styles.news_card_thumb,
        loaded && styles.is_loaded,
        error && styles.is_error
    );

    return (
        <a className={styles.news_card} href={url} target="_blank" rel="noreferrer">
            <div className={thumbClass}>
                {!error && (
                    <img
                        className={styles.news_card_img}
                        src={preview}
                        alt=""
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        onError={() => setError(true)}
                    />
                )}
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