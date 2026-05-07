import SkeletonDetail from "src/shared/ui/skeleton/detail";
import styles from "./style.module.scss";

/**
 * @description
 * /recruit/[idx] segment loading. SSR prefetchQuery 동안 즉시 스트리밍되는 셸.
 */
const RecruitDetailLoading = () => (
	<div className={styles.recruit_detail}>
		<SkeletonDetail />
	</div>
);

export default RecruitDetailLoading;
