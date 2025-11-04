"use client";

import { useTranslations } from "next-intl";
/** @description 뉴스 리스트 섹션(UI 전용) */
import "./style.scss";
import NewsCard from "src/widgets/news/card/ui";
import SkeletonCard from "src/shared/ui/skeleton/card";
import {NewsListProps} from "./type";

const NewsListSection = ({ items, locale, isLoading, pageSize }: NewsListProps) => {
    const t = useTranslations("news");
    return (
        <section className="news-page">
            <div className="news-page__grid">
                {isLoading
                    ? Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
                    : items.map((item) => (
                        <NewsCard
                            key={item.idx}
                            title={locale === "ko" ? item.titleKr : item.titleEn}
                            url={item.newsUrl}
                            createdAt={item.createdAt}
                            locale={locale}
                        />
                    ))}
            </div>

            {!isLoading && items.length === 0 && (
                <p className="news-page__empty">(t{"empty"})</p>
            )}
        </section>
    );
};

export default NewsListSection;