"use client";

import { useEffect, useMemo, useRef } from "react";
import BlogCard from "src/entities/blog/ui/card";
import SkeletonCard from "src/shared/ui/skeleton/card";
import "./style.scss";
import { BlogListProps } from "src/widgets/blog/list/type";
import {useTranslations} from "next-intl";

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
        <section className="blog-page">

            <div className="blog-page__grid">
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
                <p className="blog-page__empty">(t{"empty"})</p>
            )}

            <div ref={sentinelRef} className="blog-page__sentinel" />
        </section>
    );
};

export default BlogListSection;