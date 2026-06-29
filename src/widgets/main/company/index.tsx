"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import styles from "./style.module.scss";

/**
 * @component Company
 *
 * @description
 * 회사·팀 섹션 — "표준을 만드는 사람들이, 현장을 바꿉니다".
 * 설립연도·거점·MPEG 표준 기여 중심의 성숙한 톤(스타트업 색채·창업 스토리 배제 — 레드라인).
 */
const Company = () => {
	const t = useTranslations("main.company");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			ref={ref}
			className={`${styles.company} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="company_title"
		>
			<h2 id="company_title" className={styles.company_title}>
				{t("title")}
			</h2>
			<p className={styles.company_description}>{t("description")}</p>
		</section>
	);
};

export default Company;
