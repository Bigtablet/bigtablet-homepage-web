import ListPageLayout from "src/shared/ui/list-page-layout";
import SkeletonCard from "src/shared/ui/skeleton/card";
import styles from "./style.module.scss";

const SKELETON_KEYS = Array.from({ length: 6 }, (_, i) => `skeleton-${i}`);

/** 뉴스 목록 스켈레톤 (AsyncBoundary pendingFallback용) */
const NewsListSkeleton = () => (
	<ListPageLayout>
		<section className={styles.news_list}>
			<div className={styles.news_list_grid}>
				{SKELETON_KEYS.map((key) => (
					<SkeletonCard key={key} />
				))}
			</div>
		</section>
	</ListPageLayout>
);

export default NewsListSkeleton;
