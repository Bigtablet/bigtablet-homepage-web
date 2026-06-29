"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import styles from "./style.module.scss";

const ITEM_IDS = ["1", "2", "3", "4"] as const;
const HIGHLIGHT = "2";

/**
 * @component Proof
 *
 * @description
 * 검증 & 모멘텀 섹션 — 시드 단계에 맞는 신호(현장 실증·글로벌 액셀러레이터·국제표준/IP·
 * 기술 파트너)를 타일로 제시한다. 매출 성장률은 시드 핵심지표가 아니고 SI 매출이라
 * '용역사' 인상을 강화해 전면에서 제외 — 자본 효율은 하단 note 한 줄로만.
 */
const Proof = () => {
	const t = useTranslations("main.proof");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			ref={ref}
			className={`${styles.proof} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="proof_title"
		>
			<h2 id="proof_title" className={styles.proof_title}>
				{t("title")}
			</h2>

			<ul className={styles.proof_grid}>
				{ITEM_IDS.map((id) => (
					<li key={id} className={`${styles.proof_card} ${id === HIGHLIGHT ? styles.is_key : ""}`}>
						<span className={styles.proof_k}>{t(`items.${id}.k`)}</span>
						<strong className={styles.proof_card_title}>{t(`items.${id}.title`)}</strong>
						<span className={styles.proof_desc}>{t(`items.${id}.desc`)}</span>
					</li>
				))}
			</ul>

			<p className={styles.proof_note}>{t("note")}</p>
		</section>
	);
};

export default Proof;
