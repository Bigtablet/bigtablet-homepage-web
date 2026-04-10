/**
 * @description
 * Recruit hiring process section component.
 */

import { HIRING_PROCESS } from "./constants";
import styles from "./style.module.scss";

/**
 * Displays hiring process steps and additional information.
 */
export const RecruitProcess = () => (
	<section className={styles.recruit_detail_section}>
		<h2>채용 절차</h2>
		<p className={styles.recruit_detail_process}>{HIRING_PROCESS.join(" → ")}</p>
		<p className={styles.recruit_detail_notice_text}>
			경우에 따라 간단한 사전 과제 또는 레퍼런스 체크가 진행될 수 있습니다.
		</p>
	</section>
);
