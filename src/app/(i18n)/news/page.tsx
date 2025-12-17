"use client";

import "./style.scss";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Template from "src/shared/ui/template";
import NewsListSection from "src/widgets/news/list";
import { useNewsPageQuery } from "src/entities/news/query/news.query";
import { BigtabletSearchParams } from "src/shared/hooks/searchparams";
import {Pagination} from "@bigtablet/design-system";

const PAGE_SIZE = 6;

const NewsPage = () => {
    const locale = useLocale();
    const sp = BigtabletSearchParams();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = Math.max(1, sp.getNumber("page", 1) ?? 1);

    const { data, isLoading } = useNewsPageQuery({ page, size: PAGE_SIZE });
    const items = useMemo(() => data?.items ?? [], [data?.items]);

    /** 🔑 단순 totalPages 계산 */
    const totalPages = items.length === PAGE_SIZE ? page + 1 : page;

    const handleChangePage = (nextPage: number) => {
        const clamped = Math.max(1, nextPage);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(clamped));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Template align="center">
            <section className="news-page">
                <NewsListSection
                    items={items}
                    locale={locale}
                    isLoading={isLoading}
                    pageSize={PAGE_SIZE}
                />

                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={handleChangePage}
                    />
                )}
            </section>
        </Template>
    );
};

export default NewsPage;