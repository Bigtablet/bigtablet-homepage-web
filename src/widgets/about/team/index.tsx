"use client";

import { useTranslations } from "next-intl";
import type { MemberKey } from "src/entities/about/util/member.util";
import { MEMBER_DEFAULT_ORDER } from "src/entities/about/util/member.util";
import MemberCard from "src/widgets/about/member/card";
import styles from "./style.module.scss";

interface TeamProps {
	order?: MemberKey[];
}

/**
 * @component Team
 *
 * @description
 * About 페이지 팀 소개 섹션.
 * 멤버 카드 그리드를 표시하며, 표시 순서를 props로 제어할 수 있다.
 *
 * @param props.order - 멤버 표시 순서 (기본: MEMBER_DEFAULT_ORDER)
 */
const Team = ({ order = MEMBER_DEFAULT_ORDER }: TeamProps) => {
	const t = useTranslations("about.team");

	return (
		<section id="team" className={styles.team} aria-labelledby="team__title">
			<h2 id="team__title" className={styles.team_title}>
				{t("title")}
			</h2>
			<div className={styles.team_grid}>
				{order.map((memberSlug) => (
					<MemberCard key={memberSlug} memberSlug={memberSlug} />
				))}
			</div>
		</section>
	);
};

export default Team;
