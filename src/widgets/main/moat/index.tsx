"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import BgFx from "src/shared/ui/bg-fx";
import Eyebrow from "src/shared/ui/eyebrow";
import styles from "./style.module.scss";

const ROW_IDS = ["1", "2", "3", "4"] as const;

/**
 * @component Moat
 *
 * @description
 * "왜 단순 영상 AI 가 아닌가" — VCM 원천기술(모트) 섹션.
 * 영상 경량화 압축률·MPEG 국제표준 기여를 일반 영상 AI 와 비교표로 대비해
 * 기술 방어력(투자자 관점의 멀티플 근거)을 전달한다. navy 배경 위 라이트 텍스트.
 */
const Moat = () => {
	const t = useTranslations("main.moat");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			ref={ref}
			className={`${styles.moat} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="moat_title"
		>
			<BgFx variant="frames" />

			<div className={styles.moat_inner}>
				<div className={styles.moat_copy}>
					<Eyebrow>{t("eyebrow")}</Eyebrow>
					<h2 id="moat_title" className={styles.moat_title}>
						{t("title")}
					</h2>
					<p className={styles.moat_description}>{t("description")}</p>
				</div>

				<table className={styles.moat_compare}>
					<thead>
						<tr>
							<th scope="col" className={styles.moat_th_feature}>
								{t("compare.head.feature")}
							</th>
							<th scope="col" className={styles.moat_th_legacy}>
								{t("compare.head.legacy")}
							</th>
							<th scope="col" className={styles.moat_th_us}>
								{t("compare.head.us")}
							</th>
						</tr>
					</thead>
					<tbody>
						{ROW_IDS.map((id) => (
							<tr key={id}>
								<th scope="row" className={styles.moat_td_feature}>
									{t(`compare.rows.${id}.feature`)}
								</th>
								<td className={styles.moat_td_legacy}>{t(`compare.rows.${id}.legacy`)}</td>
								<td className={styles.moat_td_us}>{t(`compare.rows.${id}.us`)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default Moat;
