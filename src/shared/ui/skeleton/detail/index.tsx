"use client";

import styles from "./style.module.scss";

/**
 * @description
 * 상세 페이지 셸 스켈레톤 — 제목 + 메타 + 본문 라인.
 * blog/[idx], recruit/[idx] 등 SSR prefetch 동안 즉시 시각 피드백 제공.
 */
const SkeletonDetail = () => (
	<div className={styles.detail_skeleton}>
		<div className={`${styles.detail_skeleton_line} ${styles.title}`} />
		<div className={`${styles.detail_skeleton_line} ${styles.meta}`} />
		<div className={styles.detail_skeleton_thumb} />
		<div className={styles.detail_skeleton_body}>
			<div className={styles.detail_skeleton_line} />
			<div className={styles.detail_skeleton_line} />
			<div className={`${styles.detail_skeleton_line} ${styles.short}`} />
			<div className={styles.detail_skeleton_line} />
			<div className={`${styles.detail_skeleton_line} ${styles.medium}`} />
		</div>
	</div>
);

export default SkeletonDetail;
