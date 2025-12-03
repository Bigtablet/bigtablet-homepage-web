"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import Template from "src/widgets/layout/template";
import { useBlogPageQuery } from "src/features/blog/model/queries/blog.query";
import BlogListSection from "src/widgets/blog/list";
import { Pagination } from "src/shared/ui/navigation/pagination";

const DEFAULT_SIZE = 9;

const BlogPage = () => {
    const locale = useLocale();
    const pathname = usePathname();
    const sp = useSearchParams();

    const size = Math.max(1, Number(sp.get("size") ?? DEFAULT_SIZE));

    const { data, isLoading } = useBlogPageQuery({ page: 1, size: 6 });

    const items = useMemo(() => data?.items ?? [], [data]);

    return (
        <Template>
            <div className="blog-page">
                <Pagination items={items} pageSize={size} maxPageButtons={7}>
                    {(pageItems) => (
                        <BlogListSection
                            items={pageItems}
                            locale={locale}
                            isLoading={isLoading}
                            hasNextPage={false}
                            isFetchingNextPage={false}
                            fetchNextPage={() => {}}
                            pageSize={size}
                            hrefBuilder={(item) => `${pathname}/${item.idx}`}
                        />
                    )}
                </Pagination>
            </div>
        </Template>
    );
};

export default BlogPage;