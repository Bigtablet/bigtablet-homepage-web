/**
 * @description
 * Recruit detail header section component.
 */

import type { RecruitCard } from "src/entities/recruit/schema/recruit.schema";
import styles from "./style.module.scss";
import { formatDate } from "./utils";

/**
 * Props for RecruitHeader component.
 */
interface RecruitHeaderProps {
	/**
	 * Recruit data to display.
	 */
	recruit: RecruitCard;
}

/**
 * Header section with title and metadata (tags and date range).
 */
export const RecruitHeader = ({ recruit }: RecruitHeaderProps) => (
	<header className={styles.recruit_detail_header}>
		<h1 className={styles.recruit_detail_title}>{recruit.title}</h1>
		<div className={styles.recruit_detail_meta}>
			<div className={styles.recruit_detail_chips}>
				{recruit.tags.map((tag) => (
					<span key={tag} className={styles.chip}>
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
