"use client";

import Image from "next/image";
import Link from "next/link";
import "./style.scss";
import type { BlogItem } from "src/entities/blog/model/schema/blog.schema";
import {formatRelative} from "src/shared/libs/ui/date";
import {ellipsis} from "src/shared/libs/ui/text";

type Props = {
    item: BlogItem;
    locale: string;
    href: string;
    priority?: boolean;
};

const BlogCard = ({ item, locale, href, priority = false }: Props) => {
    const { idx, titleKr, titleEn, contentKr, contentEn, imageUrl, createdAt, views } = item;

    const isKo = locale.startsWith("ko");
    const title = (isKo ? titleKr : titleEn) ?? "";
    const content = (isKo ? contentKr : contentEn) ?? "";
    const time = formatRelative(createdAt, locale);

    return (
        <Link
            href={href}
            className="blog-card"
            aria-label={title ? `${title} 상세보기` : "블로그 상세보기"}
            prefetch
        >
            <div className="blog-card__thumb">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title || `blog-${idx}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={priority}
                    />
                ) : (
                    <div className="blog-card__thumb-fallback" />
                )}
            </div>

            <div className="blog-card__meta">
                <div className="blog-card__time">{time}</div>
                <div className="blog-card__dot">·</div>
                <div className="blog-card__views">{(views ?? 0).toLocaleString()} views</div>
            </div>

            <h3 className="blog-card__title">{title}</h3>
            <p className="blog-card__excerpt">{ellipsis(content, 120)}</p>
        </Link>
    );
};

export default BlogCard;