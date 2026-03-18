/**
 * @description
 * Recruit detail header section component.
 */

import type { RecruitDTO } from "src/entities/recruit/schema/recruit.domain";
import styles from "./style.module.scss";
import { formatDate } from "./utils";

/**
 * Props for RecruitHeader component.
 */
interface RecruitHeaderProps {
	/**
	 * Recruit data to display.
	 */
	recruit: RecruitDTO;
}

/**
 * Header section with title and metadata (tags and date range).
 */
export const RecruitHeader = ({ recruit }: RecruitHeaderProps) => (
	<header className={styles.recruit_detail_header}>
		<h1 className={styles.recruit_detail_title}>{recruit.title}</h1>
		<div className={styles.recruit_detail_meta}>
			<div className={styles.recruit_detail_chips}>
				{recruit.tags.map((tag, index) => (
					<span key={`tag-${index}`} className={styles.chip}>
						{tag}
					</span>
				))}
			</div>
			<div className={styles.recruit_detail_datebar}>
				{formatDate(recruit.startDate)} -{" "}
				{recruit.endDate ? formatDate(recruit.endDate) : "상시"}
			</div>
		</div>
	</header>
);
