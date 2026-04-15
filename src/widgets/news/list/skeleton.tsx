import SkeletonCard from "src/shared/ui/skeleton/card";
import styles from "./style.module.scss";

const SKELETON_KEYS = Array.from({ length: 6 }, (_, i) => `skeleton-${i}`);

/** 뉴스 목록 스켈레톤 (AsyncBoundary pendingFallback용) */
const NewsListSkeleton = () => (
	<section className={styles.news_list}>
		<div className={styles.news_list_grid}>
			{SKELETON_KEYS.map((key) => (
				<SkeletonCard key={key} />
			))}
		</div>
	</section>
);

export default NewsListSkeleton;
