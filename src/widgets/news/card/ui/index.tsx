"use client";

import "./style.scss";
import {useMemo, useState} from "react";
import {NewsCardProps} from "src/widgets/news/card/type";
import {formatRelative} from "src/shared/libs/ui/date";

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