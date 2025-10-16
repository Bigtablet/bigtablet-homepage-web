"use client";

import "./style.scss";
import Template from "src/components/common/template";
import BlogCard from "src/components/blog";
import { useEffect, useMemo, useRef } from "react";
import useBlog from "src/hooks/blog/useBlog";
import { useLocale, useTranslations } from "next-intl";

const PAGE_SIZE = 9;

const BlogPage = () => {
    const t = useTranslations("blog");
    const locale = useLocale();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlog(PAGE_SIZE);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const items = useMemo(() => (data?.pages ?? []).flat(), [data]);

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
        <Template>
            <section className="BlogPage">
                <h2 className="BlogPage__title">{t("title")}</h2>

                <div className="BlogPage__grid">
                    {items.map((item) => (
                        <BlogCard key={item.idx} {...item} locale={locale} />
                    ))}
                </div>

                <div ref={sentinelRef} className="BlogPage__sentinel" />
            </section>
        </Template>
    );
};

export default BlogPage;