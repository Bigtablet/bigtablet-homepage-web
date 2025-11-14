"use client";

import { useEffect, useMemo, useRef } from "react";
import BlogCard from "src/widgets/blog/card";
import SkeletonCard from "src/shared/ui/skeleton/card";
import styles from "./style.module.scss";
import { useTranslations } from "next-intl";
import type { BlogItem } from "src/entities/blog/model/schema/blog.schema";

interface BlogListProps {
    items: BlogItem[];
    locale: string;
    isLoading: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    pageSize: number;
    hrefBuilder?: (item: BlogItem, locale: string) => string;
}

const BlogListSection = ({
                             items,
                             locale,
                             isLoading,
                             hasNextPage,
                             isFetchingNextPage,
                             fetchNextPage,
                             pageSize,
                             hrefBuilder = (item, l) => `/${l}/blog/${item.idx}`,
                         }: BlogListProps) => {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const flatItems = useMemo(() => items ?? [], [items]);
    const t = useTranslations("blog");

    useEffect(() => {
        if (!sentinelRef.current || !hasNextPage) return;

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting) && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: "800px 0px" }
        );

        io.observe(sentinelRef.current);
        return () => io.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <section className={styles["blog-list"]}>
            <div className={styles["blog-list__grid"]}>
                {isLoading
                    ? Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
                    : flatItems.map((item, i) => (
                        <BlogCard
                            key={item.idx}
                            item={item}
                            locale={locale}
                            href={hrefBuilder(item, locale)}
                            priority={i < 2}
                        />
                    ))}
            </div>

            {!isLoading && flatItems.length === 0 && (
                <p className={styles["blog-list__empty"]}>{t("empty")}</p>
            )}

            <div ref={sentinelRef} className={styles["blog-list__sentinel"]} />
        </section>
    );
};

export default BlogListSection;