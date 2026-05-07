/**
 * @description
 * Recruit benefits section component.
 */

import { BENEFITS } from "../constants";
import styles from "../style.module.scss";

/**
 * Displays employee benefits list.
 */
export const RecruitBenefits = () => (
	<section className={styles.recruit_detail_section}>
		<h2>복지 및 혜택</h2>
		<ul className={styles.recruit_detail_list}>
			{BENEFITS.map((benefit) => (
				<li key={benefit}>{benefit}</li>
			))}
		</ul>
	</section>
);
