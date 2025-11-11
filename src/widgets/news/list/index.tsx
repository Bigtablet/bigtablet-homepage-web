"use client";

import { useTranslations } from "next-intl";
import "./style.scss";
import NewsCard from "src/widgets/news/card";
import SkeletonCard from "src/shared/ui/skeleton/card";
import {NewsItem} from "src/entities/news/model/schema/news.schema";

interface NewsListProps {
    items: NewsItem[];
    locale: string;
    isLoading: boolean;
    pageSize: number;
};

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