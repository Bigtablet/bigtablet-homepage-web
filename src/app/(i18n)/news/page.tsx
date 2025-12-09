"use client";

import "./style.scss";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import Template from "src/widgets/layout/template";
import NewsListSection from "src/widgets/news/list";
import { useNewsPageQuery } from "src/entities/news/query/news.query";
import { Pagination } from "src/shared/ui/navigation/pagination";

const DEFAULT_SIZE = 6;

const NewsPage = () => {
    const locale = useLocale();
    const { data, isLoading } = useNewsPageQuery({ page: 1, size: 9999 });
    const items = useMemo(() => data?.items ?? [], [data]);

    return (
        <Template>
            <section className="news-page">
                <Pagination items={items} pageSize={DEFAULT_SIZE} maxPageButtons={7}>
                    {(pageItems) => (
                        <NewsListSection
                            items={pageItems}
                            locale={locale}
                            isLoading={isLoading}
                            pageSize={DEFAULT_SIZE}
                        />
                    )}
                </Pagination>
            </section>
        </Template>
    );
};

export default NewsPage;