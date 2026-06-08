import { SkeletonList } from "src/shared/ui/skeleton/list";
import styles from "./style.module.scss";

const SKELETON_KEYS = ["s0", "s1", "s2", "s3", "s4"];

/** 채용 목록 스켈레톤 (route segment loading용) */
const RecruitListSkeleton = () => (
	<div className={styles.request_list}>
		{SKELETON_KEYS.map((key) => (
			<SkeletonList key={key} />
		))}
	</div>
);

export default RecruitListSkeleton;
