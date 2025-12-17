"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Template from "src/shared/ui/template";
import { useBlogPageQuery } from "src/entities/blog/queries/blog.query";
import BlogListSection from "src/widgets/blog/list";
import {Pagination} from "@bigtablet/design-system";
import "./style.scss";

const DEFAULT_SIZE = 6;

const BlogPage = () => {
    const locale = useLocale();
    const pathname = usePathname();
    const sp = useSearchParams();
    const router = useRouter();

    const page = Math.max(1, Number(sp.get("page") ?? 1));
    const size = Math.max(1, Number(sp.get("size") ?? DEFAULT_SIZE));

    const { data, isLoading } = useBlogPageQuery({ page, size });

    const items = useMemo(() => data?.items ?? [], [data?.items]);

    const totalPages = data?.hasNext ? page + 1 : page;

    const handlePageChange = (nextPage: number) => {
        const params = new URLSearchParams(sp.toString());
        params.set("page", String(nextPage));
        params.set("size", String(size));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Template align="center">
            <div className="blog-page">
                <BlogListSection
                    items={items}
                    locale={locale}
                    isLoading={isLoading}
                    pageSize={size}
                    hrefBuilder={(item) => `${pathname}/${item.idx}`}
                />

                {totalPages > 1 && (
                    <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
                )}
            </div>
        </Template>
    );
};

export default BlogPage;