"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import Eyebrow from "src/shared/ui/eyebrow";
import styles from "./style.module.scss";

const ITEM_IDS = ["1", "2", "3", "4", "5"] as const;

/**
 * @component Company
 *
 * @description
 * 회사 섹션 — "표준을 만드는 사람들이, 현장을 바꿉니다".
 * 우측 컬럼은 5개 짧은 항목이 한 줄씩 시차 등장하는 리스트.
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
			<div className={styles.company_head}>
				<Eyebrow>{t("eyebrow")}</Eyebrow>
				<h2 id="company_title" className={styles.company_title}>
					{t("title")}
				</h2>
			</div>

			<ul className={styles.company_list}>
				{ITEM_IDS.map((id) => (
					<li key={id} className={styles.company_item}>
						{t(`items.${id}`)}
					</li>
				))}
			</ul>
		</section>
	);
};

export default Company;
