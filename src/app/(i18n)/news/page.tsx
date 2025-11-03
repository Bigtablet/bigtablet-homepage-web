"use client";

/** @description 뉴스 목록 페이지(페이지네이션 + 섹션 위젯 분리) */
import "./style.scss";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import Frame from "src/widgets/layout/frame";
import Pagination from "src/shared/ui/pagenation/ui";
import NewsListSection from "src/widgets/news/list";
import { useNewsPageQuery } from "src/features/news/model/news.query";

const DEFAULT_SIZE = 9;

const NewsPage = () => {
    const t = useTranslations("news");
    const locale = useLocale();
    const pathname = usePathname();
    const sp = useSearchParams();

    const page = Math.max(1, Number(sp.get("page") ?? 1));
    const size = Math.max(1, Number(sp.get("size") ?? DEFAULT_SIZE));

    const { data, isLoading } = useNewsPageQuery({ page, size });
    const items = useMemo(() => data?.items ?? [], [data]);
    const hasNext = Boolean(data?.hasNext);

    return (
        <Frame>
            <section className="news-page">
                <h2 className="news-page__title">{t("title")}</h2>

                <NewsListSection
                    items={items}
                    locale={locale}
                    isLoading={isLoading}
                    pageSize={size}
                />

                <Pagination
                    page={page}
                    size={size}
                    hasNext={hasNext}
                    basePath={pathname}
                />
            </section>
        </Frame>
    );
};

export default NewsPage;