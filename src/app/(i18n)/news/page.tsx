"use client";

import { Pagination } from "@bigtablet/design-system";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { useSuspenseNewsPageQuery } from "src/features/news/query/news.query";
import AsyncBoundary from "src/shared/ui/async-boundary";
import ErrorFallback from "src/shared/ui/error-fallback";
import NewsListSection from "src/widgets/news/list";
import NewsListSkeleton from "src/widgets/news/list/skeleton";
import styles from "./style.module.scss";

const PAGE_SIZE = 6;

const NewsContent = () => {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = Math.max(1, Number(searchParams.get("page") ?? 1));

	const { data } = useSuspenseNewsPageQuery({ page, size: PAGE_SIZE });
	const items = useMemo(() => data?.items ?? [], [data?.items]);

	const totalPages = items.length === PAGE_SIZE ? page + 1 : page;

	const handleChangePage = (nextPage: number) => {
		const clamped = Math.max(1, nextPage);
		const sp = new URLSearchParams(searchParams.toString());
		sp.set("page", String(clamped));
		router.push(`${pathname}?${sp.toString()}`);
	};

	return (
		<section className={styles.news_page}>
			<NewsListSection items={items} locale={locale} isLoading={false} pageSize={PAGE_SIZE} />

			{totalPages > 1 && (
				<div className={styles.news_page_pagination}>
					<Pagination page={page} totalPages={totalPages} onChange={handleChangePage} />
				</div>
			)}
		</section>
	);
};

const NewsPage = () => (
	<AsyncBoundary
		pendingFallback={<NewsListSkeleton />}
		rejectedFallback={({ resetErrorBoundary }) => (
			<ErrorFallback reset={resetErrorBoundary} backHref="/main" backLabel="메인으로 돌아가기" />
		)}
	>
		<NewsContent />
	</AsyncBoundary>
);

export default NewsPage;
