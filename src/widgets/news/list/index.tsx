"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
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

/**
 * @component NewsListSection
 *
 * @description
 * 뉴스 목록 그리드 섹션. 로딩 시 스켈레톤 카드를 표시한다.
 *
 * @param props.items - 뉴스 아이템 배열
 * @param props.locale - 현재 로케일
 * @param props.isLoading - 로딩 상태
 * @param props.pageSize - 페이지 크기 (스켈레톤 수 결정)
 */
const NewsListSection = ({
	items,
	locale,
	isLoading,
	pageSize = 6,
}: NewsListProps) => {
	const showSkeleton = useDeferredLoading(isLoading);
	const t = useTranslations("news");
	const skeletonKeys = useMemo(
		() => Array.from({ length: pageSize }, (_, index) => `skeleton-${index}`),
		[pageSize],
	);

	const renderList = () => {
		if (showSkeleton) {
			return skeletonKeys.map((key) => <SkeletonCard key={key} />);
		}

		return items.map((item, index) => (
			<NewsCard
				key={item.idx}
				title={locale === "ko" ? item.titleKr : item.titleEn}
				url={item.newsUrl}
				createdAt={item.createdAt}
				thumbnailImageUrl={item.thumbnailImageUrl}
				locale={locale}
				priority={index < 3}
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
