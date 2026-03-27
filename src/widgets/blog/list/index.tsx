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
		() => Array.from({ length: pageSize }, (_, i) => `skeleton-${i}`),
		[pageSize],
	);

	return (
		<section className={styles.blog_list}>
			<div className={styles.blog_list_grid}>
				{showSkeleton
					? skeletonKeys.map((key) => <SkeletonCard key={key} />)
					: flatItems.map((item, i) => (
							<BlogCard
								key={item.idx}
								item={item}
								locale={locale}
								href={hrefBuilder(item, locale)}
								priority={i < 2}
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
