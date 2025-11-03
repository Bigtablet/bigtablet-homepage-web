"use client";

import "./style.scss";
import {useMemo, useState} from "react";
import {NewsCardProps} from "src/widgets/news/card/type";

const formatRelative = (dateStr: string, locale: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const absSec = Math.round(Math.abs(diffMs) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale === "ko" ? "ko" : "en", {numeric: "auto"});

    if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
    const absMin = Math.round(absSec / 60);
    if (absMin < 60) return rtf.format(Math.round(diffMs / (60 * 1000)), "minute");
    const absHr = Math.round(absMin / 60);
    if (absHr < 24) return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour");
    return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day");
};

const getSource = (raw: string) => {
    try {
        const u = new URL(raw);
        return u.hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
};

const getPreviewSrc = (raw: string) => `/api/news/preview?u=${encodeURIComponent(raw)}`;

const NewsCard = ({title, url, createdAt, locale}: NewsCardProps) => {
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
            /* noop */
        }
        setErrored(true);
    };

    return (
        <a className="news-card" href={url} target="_blank" rel="noreferrer">
            <div
                className={[
                    "news-card__thumb",
                    loaded ? "is-loaded" : "",
                    errored ? "is-error" : "",
                ].join(" ").trim()}
                aria-hidden
            >
                {!errored && (
                    <img
                        className="news-card__img"
                        src={preview}
                        alt=""
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        onError={onImgError}
                    />
                )}
            </div>

            <div className="news-card__meta">
                <div className="news-card__time">{time}</div>
                {source && <div className="news-card__dot">·</div>}
                {source && <div className="news-card__source">{source}</div>}
            </div>

            <h3 className="news-card__title">{title}</h3>
        </a>
    );
};

export default NewsCard;