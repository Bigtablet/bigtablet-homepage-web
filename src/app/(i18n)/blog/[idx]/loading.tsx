import SkeletonDetail from "src/shared/ui/skeleton/detail";
import styles from "./style.module.scss";

/**
 * @description
 * /blog/[idx] segment loading. SSR prefetchQuery 동안 즉시 스트리밍되는 셸.
 */
const BlogDetailLoading = () => (
	<div className={styles.blog_detail}>
		<SkeletonDetail />
	</div>
);

export default BlogDetailLoading;
