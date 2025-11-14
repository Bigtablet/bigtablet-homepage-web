"use client";

import { useMemo, useState } from "react";
import { formatRelative } from "src/shared/libs/ui/date";
import styles from "./style.module.scss";

const getSource = (raw: string) => {
    try {
        const u = new URL(raw);
        return u.hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
};

const getPreviewSrc = (raw: string) => `/api/news/preview?u=${encodeURIComponent(raw)}`;

interface NewsCardProps {
    title: string;
    url: string;
    createdAt: string;
    locale: string;
}

const NewsCard = ({ title, url, createdAt, locale }: NewsCardProps) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    const time = useMemo(() => formatRelative(createdAt, locale), [createdAt, locale]);
    const source = useMemo(() => getSource(url), [url]);
    const preview = useMemo(() => getPreviewSrc(url), [url]);

    const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        try {
            const u = new URL(img.src, location.origin);
            if (!u.searchParams.get("f")) {
                u.searchParams.set("f", "1");
                img.src = u.toString();
                return;
            }
        } catch {
        }
        setErrored(true);
    };

    const thumbClass = [
        styles.news_card_thumb,
        loaded && styles.is_loaded,
        errored && styles.is_error,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <a className={styles.news_card} href={url} target="_blank" rel="noreferrer">
            <div className={thumbClass} aria-hidden>
                {!errored && (
                    <img
                        className={styles.news_card_img}
                        src={preview}
                        alt=""
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        onError={onImgError}
                    />
                )}
            </div>

            <div className={styles.news_card_meta}>
                <div className={styles.news_card_time}>{time}</div>
                {source && <div className={styles.news_card_dot}>·</div>}
                {source && <div className={styles.news_card_source}>{source}</div>}
            </div>

            <h3 className={styles.news_card_title}>{title}</h3>
        </a>
    );
};

export default NewsCard;