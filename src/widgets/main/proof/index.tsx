"use client";

import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { useReveal } from "src/shared/hooks/use-reveal";
import styles from "./style.module.scss";

const YEARS = ["2022", "2023", "2024", "2025"] as const;

/**
 * @component Proof
 *
 * @description
 * 트랙션 섹션 — "이미 현장에서, 이미 매출로".
 * 매출 추이를 CSS 막대그래프(외부 차트 의존성 없음)로, 값은 i18n 카피에서 파싱한다.
 * 매출은 'SI·용역·과제 기준' 라벨을 캡션에 명시 — recurring/ARR 오인 방지(레드라인 준수).
 */
const Proof = () => {
	const t = useTranslations("main.proof");
	const { ref, visible } = useReveal<HTMLElement>();

	const bars = YEARS.map((year) => {
		const value = Number.parseFloat(t(`revenue.y${year}`));
		return { year, value: Number.isFinite(value) ? value : 0 };
	});
	const peak = Math.max(...bars.map((b) => b.value), 1);

	return (
		<section
			ref={ref}
			className={`${styles.proof} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="proof_title"
		>
			<div className={styles.proof_copy}>
				<h2 id="proof_title" className={styles.proof_title}>
					{t("title")}
				</h2>
				<p className={styles.proof_description}>{t("description")}</p>

				<div className={styles.proof_highlight}>
					<strong className={styles.proof_stat_value}>{t("stat.value")}</strong>
					<span className={styles.proof_stat_label}>{t("stat.label")}</span>
				</div>

				<p className={styles.proof_partners}>
					<span className={styles.proof_partners_label}>{t("partners.label")}</span>
					<span className={styles.proof_partners_value}>{t("partners.value")}</span>
				</p>
			</div>

			<figure className={styles.proof_chart}>
				<div className={styles.proof_bars} role="img" aria-label={t("revenue.caption")}>
					{bars.map(({ year, value }) => (
						<div key={year} className={styles.proof_bar_col}>
							<span className={styles.proof_bar_value}>{value}</span>
							<div
								className={styles.proof_bar}
								style={{ "--bar-h": `${(value / peak) * 100}%` } as CSSProperties}
							/>
							<span className={styles.proof_bar_year}>{year}</span>
						</div>
					))}
				</div>
				<figcaption className={styles.proof_caption}>{t("revenue.caption")}</figcaption>
			</figure>
		</section>
	);
};

export default Proof;
