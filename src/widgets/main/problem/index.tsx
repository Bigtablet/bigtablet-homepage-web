import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

/**
 * @component Problem
 *
 * @description
 * 메인 페이지 문제 제기 섹션.
 * 스크롤 시 등장 애니메이션은 IntersectionObserver + CSS keyframe 로 처리하던 GSAP
 * scroll-reveal 을 대체 — 메인 페이지 초기 번들에서 GSAP 의존성 제거.
 */
const Problem = () => {
	const t = useTranslations("main.problem");

	return (
		<section className={styles.problem} aria-labelledby="problem_title">
			<h2 id="problem_title" className={styles.problem_title}>
				{t("title")}
			</h2>
			<p className={styles.problem_description}>{t("description")}</p>
		</section>
	);
};

export default Problem;
