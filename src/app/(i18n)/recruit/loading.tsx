import { SkeletonList } from "src/shared/ui/skeleton/list";
import styles from "./style.module.scss";

const SKELETON_KEYS = ["s0", "s1", "s2", "s3", "s4"];

/**
 * @description
 * /recruit 라우트 segment loading. SSR prefetchQuery 진행 중 즉시 스트리밍.
 */
const RecruitLoading = () => (
	<section className={styles.recruit_page}>
		<div className={styles.recruit_page_list}>
			{SKELETON_KEYS.map((key) => (
				<SkeletonList key={key} />
			))}
		</div>
	</section>
);

export default RecruitLoading;
