/**
 * @description
 * Request to apply section component.
 */

import { Button } from "@bigtablet/design-system";
import { BigtabletLink } from "src/shared/hooks/next";
import styles from "../style.module.scss";

/**
 * Props for RecruitRequestSection component.
 */
interface RecruitRequestSectionProps {
	/**
	 * Index parameter from URL for apply link.
	 */
	idx: string;
}

/**
 * Section with apply button and contact information.
 */
export const RecruitRequestSection = ({ idx }: RecruitRequestSectionProps) => (
	<section className={styles.recruit_detail_request}>
		<BigtabletLink className={styles.recruit_detail_request_button} href={`/recruit/${idx}/apply`}>
			<Button>지원하기</Button>
		</BigtabletLink>
		<p>
			채용 관련 문의는 <a href="mailto:recruit@bigtablet.com">recruit@bigtablet.com</a>
			으로 보내주시기 바랍니다.
		</p>
	</section>
);
