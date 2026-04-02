"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { BlogItem } from "src/entities/blog/schema/blog.schema";
import useDeferredLoading from "src/shared/hooks/use-deferred-loading";
import SkeletonCard from "src/shared/ui/skeleton/card";
import BlogCard from "src/widgets/blog/card";
import styles from "./style.module.scss";

interface BlogListProps {
	items: BlogItem[];
	locale: string;
	isLoading: boolean;
	pageSize: number;
	hrefBuilder?: (item: BlogItem, locale: string) => string;
}

/**
 * @component BlogListSection
 *
 * @description
 * 블로그 목록 그리드 섹션. 로딩 시 스켈레톤 카드를 표시한다.
 *
 * @param props.items - 블로그 아이템 배열
 * @param props.locale - 현재 로케일
 * @param props.isLoading - 로딩 상태
 * @param props.pageSize - 페이지 크기 (스켈레톤 수 결정)
 * @param props.hrefBuilder - 카드 링크 생성 함수
 */
const BlogListSection = ({
	items,
	locale,
	isLoading,
	pageSize,
	hrefBuilder = (item, l) => `/${l}/blog/${item.idx}`,
}: BlogListProps) => {
	const flatItems = useMemo(() => items ?? [], [items]);
	const showSkeleton = useDeferredLoading(isLoading);
	const t = useTranslations("blog");
	const skeletonKeys = useMemo(
		() => Array.from({ length: pageSize }, (_, index) => `skeleton-${index}`),
		[pageSize],
	);

	return (
		<section className={styles.blog_list}>
			<div className={styles.blog_list_grid}>
				{showSkeleton
					? skeletonKeys.map((key) => <SkeletonCard key={key} />)
					: flatItems.map((item, index) => (
							<BlogCard
								key={item.idx}
								item={item}
								locale={locale}
								href={hrefBuilder(item, locale)}
								priority={index < 2}
							/>
						))}
			</div>

			{!isLoading && flatItems.length === 0 && (
				<p className={styles.blog_list_empty}>{t("empty")}</p>
			)}
		</section>
	);
};

export default BlogListSection;
