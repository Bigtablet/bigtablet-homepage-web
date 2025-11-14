"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";
import type { BlogItem } from "src/entities/blog/model/schema/blog.schema";
import { formatRelative } from "src/shared/libs/ui/date";
import { ellipsis } from "src/shared/libs/ui/text";

type Props = {
    item: BlogItem;
    locale: string;
    href: string;
    priority?: boolean;
};

const stripMarkdown = (value: string) =>
    value
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]*)`/g, "$1")
        .replace(/!$begin:math:display$([^$end:math:display$]*)\]$begin:math:text$[^)]+$end:math:text$/g, "$1")
        .replace(/$begin:math:display$([^$end:math:display$]+)\]$begin:math:text$[^)]+$end:math:text$/g, "$1")
        .replace(/^\s{0,3}#{1,6}\s+/gm, "")
        .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
        .replace(/^>\s?/gm, "")
        .replace(/^\s*[-+*]\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim();

const BlogCard = ({ item, locale, href, priority = false }: Props) => {
    const { idx, titleKr, titleEn, contentKr, contentEn, imageUrl, createdAt, views } = item;

    const isKo = locale.startsWith("ko");
    const title = (isKo ? titleKr : titleEn) ?? "";
    const content = (isKo ? contentKr : contentEn) ?? "";
    const plainContent = stripMarkdown(content);
    const time = formatRelative(createdAt, locale);

    return (
        <Link
            href={href}
            className={styles.blog_card}
            aria-label={title ? `${title} 상세보기` : "블로그 상세보기"}
            prefetch
        >
            <div className={styles.blog_card_thumb}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title || `blog-${idx}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={priority}
                    />
                ) : (
                    <div className={styles.blog_card_thumb_fallback} />
                )}
            </div>

            <div className={styles.blog_card_meta}>
                <div className={styles.blog_card_time}>{time}</div>
                <div className={styles.blog_card_dot}>·</div>
                <div className={styles.blog_card_views}>{(views ?? 0).toLocaleString()} views</div>
            </div>

            <h3 className={styles.blog_card_title}>{title}</h3>
            <p className={styles.blog_card_excerpt}>{ellipsis(plainContent, 120)}</p>
        </Link>
    );
};

export default BlogCard;