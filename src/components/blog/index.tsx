"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import "./style.scss";
import type { BlogItem } from "src/types/blog/blog.type";

interface BlogCardProps extends Partial<BlogItem> {
    locale?: string;
}

const formatRelative = (dateStr?: string, locale?: string) => {
    if (!dateStr || !locale) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const absSec = Math.round(Math.abs(diffMs) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale.startsWith("ko") ? "ko" : "en", { numeric: "auto" });

    if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
    const absMin = Math.round(absSec / 60);
    if (absMin < 60) return rtf.format(Math.round(diffMs / (60 * 1000)), "minute");
    const absHr = Math.round(absMin / 60);
    if (absHr < 24) return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour");
    const absDay = Math.round(absHr / 24);
    return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day");
};

const ellipsis = (text?: string, max = 120) => {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "…";
};

const BlogCard = ({
                      idx,
                      titleKr,
                      titleEn,
                      contentKr,
                      contentEn,
                      imageUrl,
                      createdAt,
                      views,
                      locale: localeProp,
                  }: BlogCardProps) => {
    const params = useParams<{ locale?: string }>();
    const pathname = usePathname();

    const locale = useMemo(() => {
        if (localeProp) return localeProp;
        const fromParam = params?.locale;
        const fromPath = (pathname || "").split("/")[1];
        return fromParam || fromPath || "ko";
    }, [localeProp, params, pathname]);

    const title = (locale.startsWith("ko") ? titleKr : titleEn) ?? "";
    const content = (locale.startsWith("ko") ? contentKr : contentEn) ?? "";
    const time = formatRelative(createdAt, locale);

    if (typeof idx !== "number") {
        return (
            <div className="BlogCard" aria-disabled="true">
                <div className="BlogCard__thumb">
                    {imageUrl ? (
                        <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                        <div className="BlogCard__thumbFallback" />
                    )}
                </div>
                <div className="BlogCard__meta">
                    <div className="BlogCard__time">{time}</div>
                    <div className="BlogCard__dot">·</div>
                    <div className="BlogCard__views">{views?.toLocaleString() ?? 0} views</div>
                </div>
                <h3 className="BlogCard__title">{title}</h3>
                <p className="BlogCard__excerpt">{ellipsis(content, 120)}</p>
            </div>
        );
    }

    return (
        <Link
            href={`/${locale}/blog/${idx}`}
            className="BlogCard"
            aria-label={title ? `${title} 상세보기` : "블로그 상세보기"}
            prefetch
        >
            <div className="BlogCard__thumb">
                {imageUrl ? (
                    <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                    <div className="BlogCard__thumbFallback" />
                )}
            </div>

            <div className="BlogCard__meta">
                <div className="BlogCard__time">{time}</div>
                <div className="BlogCard__dot">·</div>
                <div className="BlogCard__views">{views?.toLocaleString() ?? 0} views</div>
            </div>

            <h3 className="BlogCard__title">{title}</h3>
            <p className="BlogCard__excerpt">{ellipsis(content, 120)}</p>
        </Link>
    );
};

export default BlogCard;