"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import BgFx from "src/shared/ui/bg-fx";
import Eyebrow from "src/shared/ui/eyebrow";
import styles from "./style.module.scss";

/**
 * @component Problem
 *
 * @description
 * 메인 페이지 문제 제기 섹션. 다크 그라운드 위 BgFx(people) 배경 모션그래픽.
 * 진입 시 fade-up 스크롤 리빌.
 */
const Problem = () => {
	const t = useTranslations("main.problem");
	const { ref, visible } = useReveal<HTMLElement>();

	return (
		<section
			ref={ref}
			className={`${styles.problem} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="problem_title"
		>
			<BgFx variant="people" />

			<div className={styles.problem_inner}>
				<div className={styles.problem_head}>
					<Eyebrow>{t("eyebrow")}</Eyebrow>
					<h2 id="problem_title" className={styles.problem_title}>
						{t("title")}
					</h2>
				</div>
				<p className={styles.problem_description}>{t("description")}</p>
			</div>
		</section>
	);
};

export default Problem;
