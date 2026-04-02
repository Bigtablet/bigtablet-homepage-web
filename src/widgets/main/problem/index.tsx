"use client";

import { useTranslations } from "next-intl";
import { useScrollReveal } from "src/shared/hooks/use-scroll-reveal";
import styles from "./style.module.scss";

/**
 * @component Problem
 *
 * @description
 * 메인 페이지 문제 제기 섹션.
 * 스크롤 시 fade-up 애니메이션으로 등장한다.
 *
 * @see {@link useScrollReveal} 스크롤 애니메이션 훅
 */
const Problem = () => {
	const t = useTranslations("main.problem");
	const sectionRef = useScrollReveal<HTMLElement>(
		`.${styles.problem_title}, .${styles.problem_description}`,
		{ variant: "fade-up", stagger: 0.2 },
	);

	return (
		<section
			ref={sectionRef}
			className={styles.problem}
			aria-labelledby="problem_title"
		>
			<h2 id="problem_title" className={styles.problem_title}>
				{t("title")}
			</h2>
			<p className={styles.problem_description}>{t("description")}</p>
		</section>
	);
};

export default Problem;
