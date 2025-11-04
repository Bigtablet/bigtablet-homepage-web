"use client";

import {useMemo} from "react";
import {useLocale} from "next-intl";
import {usePathname, useSearchParams} from "next/navigation";
import Frame from "src/widgets/layout/frame";
import {useBlogPageQuery} from "src/features/blog/model/queries/blog.query";
import BlogListSection from "src/widgets/blog/list";
import Pagination from "src/shared/ui/pagenation/ui";

const BlogPage = () => {
    const locale = useLocale();
    const pathname = usePathname();
    const sp = useSearchParams();

    const page = Math.max(1, Number(sp.get("page") ?? 1));
    const size = Math.max(1, Number(sp.get("size") ?? 9));

    const {data, isLoading} = useBlogPageQuery({page, size});
    const items = useMemo(() => data?.items ?? [], [data]);

    return (
        <Frame>
            <div className="blog-page">

                <BlogListSection
                    items={items}
                    locale={locale}
                    isLoading={isLoading}
                    hasNextPage={false}
                    isFetchingNextPage={false}
                    fetchNextPage={() => {
                    }}
                    pageSize={size}
                    hrefBuilder={(item) => `${pathname}/${item.idx}`}
                />

                <Pagination
                    page={page}
                    size={size}
                    hasNext={Boolean(data?.hasNext)}
                />
            </div>
        </Frame>
    );
};

export default BlogPage;