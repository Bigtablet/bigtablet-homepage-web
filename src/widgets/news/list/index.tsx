"use client";

import { useTranslations } from "next-intl";
import type { NewsItem } from "src/entities/news/schema/news.schema";
import useDeferredLoading from "src/shared/hooks/use-deferred-loading";
import SkeletonCard from "src/shared/ui/skeleton/card";
import NewsCard from "src/widgets/news/card";
import styles from "./style.module.scss";

interface NewsListProps {
	items: NewsItem[];
	locale: string;
	isLoading: boolean;
	pageSize: number;
}

const NewsListSection = ({
	items,
	locale,
	isLoading,
	pageSize = 6,
}: NewsListProps) => {
	const showSkeleton = useDeferredLoading(isLoading);
	const t = useTranslations("news");

	const renderList = () => {
		if (showSkeleton) {
			return Array.from({ length: pageSize }).map((_, i) => (
				<SkeletonCard key={i} />
			));
		}

		return items.map((item, i) => (
			<NewsCard
				key={item.idx}
				title={locale === "ko" ? item.titleKr : item.titleEn}
				url={item.newsUrl}
				createdAt={item.createdAt}
				thumbnailImageUrl={item.thumbnailImageUrl}
				locale={locale}
				priority={i < 3}
			/>
		));
	};

	return (
		<section className={styles.news_list}>
			<div className={styles.news_list_grid}>{renderList()}</div>

			{!isLoading && items.length === 0 && (
				<p className={styles.news_list_empty}>{t("empty")}</p>
			)}
		</section>
	);
};

export default NewsListSection;
