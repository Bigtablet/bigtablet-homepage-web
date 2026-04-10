"use client";

import { Pagination } from "@bigtablet/design-system";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { useBlogPageQuery } from "src/features/blog/query/blog.query";
import BlogListSection from "src/widgets/blog/list";
import styles from "./style.module.scss";

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
		const searchParameters = new URLSearchParams(sp.toString());
		searchParameters.set("page", String(nextPage));
		searchParameters.set("size", String(size));
		router.push(`${pathname}?${searchParameters.toString()}`);
	};

	return (
		<div className={styles.blog_page}>
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
	);
};

export default BlogPage;
