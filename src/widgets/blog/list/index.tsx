"use client";

import { useMemo } from "react";
import BlogCard from "src/widgets/blog/card";
import SkeletonCard from "src/shared/ui/skeleton/card";
import styles from "./style.module.scss";
import { useTranslations } from "next-intl";
import type { BlogItem } from "src/entities/blog/model/schema/blog.schema";

interface BlogListProps {
    items: BlogItem[];
    locale: string;
    isLoading: boolean;
    pageSize: number;
    hrefBuilder?: (item: BlogItem, locale: string) => string;
}

const BlogListSection = ({
                             items,
                             locale,
                             isLoading,
                             pageSize,
                             hrefBuilder = (item, l) => `/${l}/blog/${item.idx}`,
                         }: BlogListProps) => {
    const flatItems = useMemo(() => items ?? [], [items]);
    const t = useTranslations("blog");

    return (
        <section className={styles.blog_list}>
            <div className={styles.blog_list_grid}>
                {isLoading
                    ? Array.from({ length: pageSize }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))
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
                <p className={styles.blog_list_empty}>{t("empty")}</p>
            )}
        </section>
    );
};

export default BlogListSection;