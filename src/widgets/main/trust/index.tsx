"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import styles from "./style.module.scss";

const ITEM_IDS = ["1", "2", "3", "4", "5", "6"] as const;

/**
 * @component Trust
 *
 * @description
 * 히어로 바로 아래 신뢰 띠. 매출·특허·국제표준·수상·파트너를 한 줄 stat 카드로 노출해
 * "검증된 딥테크"임을 첫 화면에서 즉시 전달한다(투자자·바이어 공통 첫인상).
 * 텍스트만 사용 — 외부 이미지 의존 없음. 진입 시 fade-up 리빌.
 */
const Trust = () => {
	const t = useTranslations("main.trust");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			ref={ref}
			className={`${styles.trust} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="trust_title"
		>
			<h2 id="trust_title" className={styles.trust_title}>
				{t("title")}
			</h2>

			<ul className={styles.trust_grid}>
				{ITEM_IDS.map((id) => (
					<li key={id} className={styles.trust_item}>
						<strong className={styles.trust_stat}>{t(`items.${id}.stat`)}</strong>
						<span className={styles.trust_desc}>{t(`items.${id}.desc`)}</span>
					</li>
				))}
			</ul>
		</section>
	);
};

export default Trust;
