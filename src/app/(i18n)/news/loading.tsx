import NewsListSkeleton from "src/widgets/news/list/skeleton";
import styles from "./style.module.scss";

/**
 * @description
 * /news 라우트 segment loading. 서버 prefetch 진행 중 즉시 스트리밍되는 셸.
 */
const NewsLoading = () => (
	<div className={styles.news_page}>
		<NewsListSkeleton />
	</div>
);

export default NewsLoading;
