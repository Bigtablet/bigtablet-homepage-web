"use client";

import { Pagination } from "@bigtablet/design-system";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { useNewsPageQuery } from "src/features/news/query/news.query";
import { BigtabletSearchParams } from "src/shared/hooks/next";
import NewsListSection from "src/widgets/news/list";
import styles from "./style.module.scss";

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

	const totalPages = items.length === PAGE_SIZE ? page + 1 : page;

	const handleChangePage = (nextPage: number) => {
		const clamped = Math.max(1, nextPage);
		const searchParameters = new URLSearchParams(searchParams.toString());
		searchParameters.set("page", String(clamped));
		router.push(`${pathname}?${searchParameters.toString()}`);
	};

	return (
		<section className={styles.news_page}>
			<NewsListSection items={items} locale={locale} isLoading={isLoading} pageSize={PAGE_SIZE} />

			{totalPages > 1 && (
				<div className={styles.news_page_pagination}>
					<Pagination page={page} totalPages={totalPages} onChange={handleChangePage} />
				</div>
			)}
		</section>
	);
};

export default NewsPage;
