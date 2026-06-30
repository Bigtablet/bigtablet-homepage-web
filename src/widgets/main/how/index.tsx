"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import BgFx from "src/shared/ui/bg-fx";
import Eyebrow from "src/shared/ui/eyebrow";
import styles from "./style.module.scss";

const STEP_IDS = ["1", "2", "3", "4"] as const;

/**
 * @component How
 *
 * @description
 * "작동 원리 · 하나의 엔진" — 제품이 서비스가 아니라 엔진임을 4단계 파이프라인으로 보여준다.
 * INPUT → VCM → ENGINE → OUTPUT. 2번째(VCM) 스텝이 key 강조.
 * 다크 그라운드 위 BgFx(processor) 배경 + 진입 시 fade-up.
 */
const How = () => {
	const t = useTranslations("main.how");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			id="how"
			ref={ref}
			className={`${styles.how} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="how_title"
		>
			<BgFx variant="processor" />

			<div className={styles.how_inner}>
				<div className={styles.how_head}>
					<Eyebrow>{t("eyebrow")}</Eyebrow>
					<h2 id="how_title" className={styles.how_title}>
						{t("title")}
					</h2>
					<p className={styles.how_subtitle}>{t("subtitle")}</p>
				</div>

				<ol className={styles.how_pipe}>
					{STEP_IDS.map((id) => (
						<li key={id} className={`${styles.how_step} ${id === "2" ? styles.how_step_key : ""}`}>
							<span className={styles.how_step_n}>{t(`steps.${id}.n`)}</span>
							<h3 className={styles.how_step_title}>{t(`steps.${id}.title`)}</h3>
							<p className={styles.how_step_desc}>{t(`steps.${id}.description`)}</p>
							<span className={styles.how_step_tag}>{t(`steps.${id}.tag`)}</span>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
};

export default How;
