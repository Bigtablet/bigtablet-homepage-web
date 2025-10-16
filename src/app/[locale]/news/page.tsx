"use client";

import "./style.scss";
import Template from "src/components/common/template";
import NewsCard from "src/components/news";
import { useEffect, useMemo, useRef } from "react";
import useNews from "src/hooks/news/useNews";
import { useLocale, useTranslations } from "next-intl";

const PAGE_SIZE = 9;

const NewsPage = () => {
    const t = useTranslations("news");
    const locale = useLocale();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNews(PAGE_SIZE);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const items = useMemo(() => (data?.pages ?? []).flat(), [data]);

    useEffect(() => {
        if (!sentinelRef.current || !hasNextPage) return;
        const io = new IntersectionObserver(entries => {
            if (entries.some(e => e.isIntersecting) && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, { rootMargin: "800px 0px" });

        io.observe(sentinelRef.current);
        return () => io.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <Template>
            <section className="NewsPage">
                <h2 className="NewsPage__title">{t("title")}</h2>

                <div className="NewsPage__grid">
                    {items.map(item => (
                        <NewsCard
                            key={item.idx}
                            title={locale === "ko" ? item.titleKr : item.titleEn}
                            url={item.newsUrl}
                            createdAt={item.createdAt}
                            locale={locale}
                        />
                    ))}
                </div>

                <div ref={sentinelRef} className="NewsPage__sentinel" />
            </section>
        </Template>
    );
};

export default NewsPage;