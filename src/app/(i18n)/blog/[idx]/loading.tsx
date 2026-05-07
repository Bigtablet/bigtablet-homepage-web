import styles from "./style.module.scss";

/**
 * @description
 * /blog/[idx] segment loading. SSR prefetchQuery 동안 즉시 스트리밍되는 셸.
 */
const BlogDetailLoading = () => (
	<div className={styles.blog_detail}>
		<div className={styles.blog_detail_loading}>...</div>
	</div>
);

export default BlogDetailLoading;
