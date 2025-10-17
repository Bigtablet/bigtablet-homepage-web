"use client";

import "./style.scss";

type Props = {
    title: string;
    url: string;
    createdAt: string;
    locale: string;
};

const formatRelative = (dateStr: string, locale: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const absSec = Math.round(Math.abs(diff) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale === "ko" ? "ko" : "en", { numeric: "auto" });

    if (absSec < 60) return rtf.format(Math.round(diff / 1000), "second");
    const absMin = Math.round(absSec / 60);
    if (absMin < 60) return rtf.format(Math.round(diff / (60 * 1000)), "minute");
    const absHr = Math.round(absMin / 60);
    if (absHr < 24) return rtf.format(Math.round(diff / (60 * 60 * 1000)), "hour");
    const absDay = Math.round(absHr / 24);
    return rtf.format(Math.round(diff / (24 * 60 * 60 * 1000)), "day");
};

const getSource = (url: string) => {
    try {
        const u = new URL(url);
        return u.hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
};

const NewsCard = ({ title, url, createdAt, locale }: Props) => {
    const source = getSource(url);
    const time = formatRelative(createdAt, locale);

    return (
        <a className="NewsCard" href={url} target="_blank" rel="noreferrer">
            <div className="NewsCard__thumb" aria-hidden>
                <div className="NewsCard__thumbLabel">{source || "news"}</div>
            </div>

            <div className="NewsCard__meta">
                <div className="NewsCard__time">{time}</div>
                {source && <div className="NewsCard__dot">·</div>}
                {source && <div className="NewsCard__source">{source}</div>}
            </div>

            <h3 className="NewsCard__title">{title}</h3>
        </a>
    );
};

export default NewsCard;