"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import Eyebrow from "src/shared/ui/eyebrow";
import styles from "./style.module.scss";

const CARD_IDS = ["1", "2"] as const;

/**
 * @component SolutionSection (Deployments)
 *
 * @description
 * "한 엔진이 배포되는 곳" — 같은 엔진이 실제로 배포된 두 현장(RETAIL 고객 인식 / FACTORY 불량 인식).
 * 좌/우 시차 슬라이드인 + "✓ 실제 레퍼런스" 배지. 라이트 그라운드.
 * (기존 5개 비디오 카드 + 모달 구현을 임시 디자인의 2카드 버전으로 대체)
 */
const SolutionSection = () => {
	const t = useTranslations("main.solution");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			ref={ref}
			className={`${styles.solution} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="solution_title"
		>
			<div className={styles.solution_head}>
				<Eyebrow>{t("eyebrow")}</Eyebrow>
				<h2 id="solution_title" className={styles.solution_title}>
					{t("title")}
				</h2>
				<p className={styles.solution_subtitle}>{t("subtitle")}</p>
			</div>

			<div className={styles.solution_grid}>
				{CARD_IDS.map((id) => (
					<article
						key={id}
						className={`${styles.dep_card} ${id === "1" ? styles.from_left : styles.from_right}`}
					>
						<div className={styles.dep_top}>
							<span className={styles.dep_tag}>{t(`cards.${id}.tag`)}</span>
							<span className={styles.dep_no}>{t(`cards.${id}.no`)}</span>
						</div>
						<span className={styles.dep_badge}>{t("badge")}</span>
						<h3 className={styles.dep_card_title}>{t(`cards.${id}.title`)}</h3>
						<p className={styles.dep_card_desc}>{t(`cards.${id}.description`)}</p>
					</article>
				))}
			</div>

			<p className={styles.dep_note}>{t("note")}</p>
		</section>
	);
};

export default SolutionSection;
