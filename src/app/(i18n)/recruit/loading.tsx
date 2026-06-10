import { SkeletonList } from "src/shared/ui/skeleton/list";
import RecruitHeaderLoading from "src/widgets/recruit/main/header/loading";
import styles from "./style.module.scss";

const SKELETON_KEYS = ["s0", "s1", "s2", "s3", "s4"];

/**
 * @description
 * /recruit 라우트 segment loading. SSR prefetchQuery 진행 중 즉시 스트리밍.
 * 헤더(텍스트 + 검색바)는 실물 그대로 노출하고, 공고 리스트만 카드 스켈레톤으로 표시.
 */
const RecruitLoading = () => (
	<section className={styles.recruit_page}>
		<RecruitHeaderLoading />

		<div className={styles.recruit_page_list}>
			{SKELETON_KEYS.map((key) => (
				<SkeletonList key={key} />
			))}
		</div>
	</section>
);

export default RecruitLoading;
