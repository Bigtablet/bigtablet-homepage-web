"use client";

import { useTranslations } from "next-intl";
import { useScrollReveal } from "src/shared/hooks/use-scroll-reveal";
import styles from "./style.module.scss";

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
